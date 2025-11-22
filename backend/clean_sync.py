"""
Clean, working email sync implementation with domain filtering
"""
import asyncio
import imaplib
import email
from email.utils import parsedate_to_datetime
from datetime import datetime, timezone
from sqlalchemy import select
from app.database import get_db
from app.models import EmailAccount, Email, User
from app.services.email_service import decrypt_password


async def sync_account_emails(account_id: int, user_id: int, limit: int = 50):
    """
    Sync emails from an IMAP account with proper domain filtering.
    Returns number of emails synced.
    """
    async for db in get_db():
        try:
            # Get account
            result = await db.execute(
                select(EmailAccount).where(EmailAccount.id == account_id)
            )
            account = result.scalar_one_or_none()
            if not account:
                return {"error": "Account not found"}

            # Decrypt password
            password = decrypt_password(account.imap_password_encrypted)

            # Connect to IMAP
            print(f"[SYNC] Connecting to {account.imap_server}:{account.imap_port}")
            imap = imaplib.IMAP4_SSL(account.imap_server, account.imap_port)
            imap.login(account.imap_username, password)
            imap.select('INBOX')

            # Get recent messages
            _, message_numbers = imap.search(None, 'ALL')
            msg_ids = message_numbers[0].split()[-limit:]  # Last N messages

            print(f"[SYNC] Found {len(msg_ids)} messages to process")
            
            synced_count = 0
            skipped_count = 0

            for num in msg_ids:
                try:
                    # Fetch full message
                    _, msg_data = imap.fetch(num, '(RFC822)')
                    email_body = msg_data[0][1]
                    msg = email.message_from_bytes(email_body)

                    # Extract email data
                    from_addr = msg.get('from', '')
                    subject = msg.get('subject', '(no subject)')
                    date_str = msg.get('date', '')
                    message_id = msg.get('Message-ID', f'<generated-{num.decode()}@imported>')

                    # Parse date
                    try:
                        received_date = parsedate_to_datetime(date_str)
                        if received_date.tzinfo is None:
                            received_date = received_date.replace(tzinfo=timezone.utc)
                    except:
                        received_date = datetime.now(timezone.utc)

                    # Apply domain filter if set
                    if account.domain_filter:
                        # Extract domain from 'from' address
                        email_part = from_addr
                        if '<' in from_addr:
                            email_part = from_addr.split('<')[1].split('>')[0]
                        
                        sender_domain = email_part.split('@')[-1].lower() if '@' in email_part else ''
                        
                        # Check against allowed domains
                        allowed_domains = [d.strip().lower() for d in account.domain_filter.split(',')]
                        
                        if sender_domain not in allowed_domains:
                            skipped_count += 1
                            print(f"[SKIP] Domain {sender_domain} not in whitelist")
                            continue

                    # Extract body
                    body = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain":
                                try:
                                    body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                                    break
                                except:
                                    pass
                    else:
                        try:
                            body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
                        except:
                            body = str(msg.get_payload())

                    # Limit body size
                    if body:
                        body = body[:10000]

                    # Check if email already exists
                    existing = await db.execute(
                        select(Email).where(
                            (Email.user_id == user_id) &
                            (Email.message_id == message_id)
                        )
                    )
                    
                    if existing.scalar_one_or_none():
                        print(f"[EXISTS] {subject[:50]}")
                        continue

                    # Create email record
                    from_name = from_addr.split('<')[0].strip() if '<' in from_addr else from_addr
                    
                    new_email = Email(
                        user_id=user_id,
                        message_id=message_id,
                        from_address=from_addr,
                        from_name=from_name,
                        to_address="",
                        subject=subject,
                        body_text=body or "[No content]",
                        body_html="",
                        received_at=received_date,
                        is_read=False,
                        ai_category="primary"
                    )
                    
                    db.add(new_email)
                    await db.commit()
                    
                    synced_count += 1
                    print(f"[SYNCED] {subject[:50]}")

                except Exception as e:
                    print(f"[ERROR] Failed to process message: {e}")
                    await db.rollback()
                    continue

            imap.close()
            imap.logout()

            print(f"\n[DONE] Synced: {synced_count}, Skipped: {skipped_count}")
            return {
                "synced": synced_count,
                "skipped": skipped_count,
                "total_processed": len(msg_ids)
            }

        except Exception as e:
            print(f"[FATAL ERROR] {e}")
            import traceback
            traceback.print_exc()
            await db.rollback()
            return {"error": str(e)}
        
        break


if __name__ == "__main__":
    # Test: sync account ID 2 for user ID 2
    result = asyncio.run(sync_account_emails(account_id=2, user_id=2, limit=20))
    print(f"\nResult: {result}")
