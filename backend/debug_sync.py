"""
Debug version with detailed logging
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


async def sync_with_logging():
    """Sync with detailed logging"""
    async for db in get_db():
        try:
            # Get account
            result = await db.execute(
                select(EmailAccount).where(EmailAccount.id == 3)
            )
            account = result.scalar_one()
            print(f"✅ Found account: {account.email_address}")
            print(f"   Domain filter: {account.domain_filter}")

            # Decrypt and connect
            password = decrypt_password(account.imap_password_encrypted)
            print(f"✅ Password decrypted")
            
            imap = imaplib.IMAP4_SSL(account.imap_server, account.imap_port)
            imap.login(account.imap_username, password)
            imap.select('INBOX')
            print(f"✅ Connected to IMAP")

            # Get messages
            _, message_numbers = imap.search(None, 'ALL')
            msg_ids = message_numbers[0].split()[-5:]  # Last 5 for testing
            print(f"✅ Found {len(msg_ids)} messages")

            for i, num in enumerate(msg_ids, 1):
                print(f"\n--- Processing message {i}/{len(msg_ids)} ---")
                
                # Fetch message
                _, msg_data = imap.fetch(num, '(RFC822)')
                email_body = msg_data[0][1]
                msg = email.message_from_bytes(email_body)

                from_addr = msg.get('from', '')
                subject = msg.get('subject', '(no subject)')
                message_id = msg.get('Message-ID', f'<gen-{num.decode()}>')
                
                print(f"From: {from_addr}")
                print(f"Subject: {subject[:60]}")
                print(f"Message-ID: {message_id}")

                # Check if exists
                existing = await db.execute(
                    select(Email).where(Email.message_id == message_id)
                )
                if existing.scalar_one_or_none():
                    print(f"❌ Already exists, skipping")
                    continue

                # Parse body
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

                print(f"Body length: {len(body)} chars")

                # Parse date
                date_str = msg.get('date', '')
                try:
                    received_date = parsedate_to_datetime(date_str)
                    if received_date.tzinfo is None:
                        received_date = received_date.replace(tzinfo=timezone.utc)
                except:
                    received_date = datetime.now(timezone.utc)
                
                print(f"Date: {received_date}")

                # Create email
                from_name = from_addr.split('<')[0].strip() if '<' in from_addr else from_addr
                
                new_email = Email(
                    user_id=2,
                    message_id=message_id,
                    from_address=from_addr,
                    from_name=from_name,
                    to_address="",
                    subject=subject,
                    body_text=body[:5000] or "[No content]",
                    body_html="",
                    received_at=received_date,
                    is_read=False,
                    ai_category="primary"
                )
                
                db.add(new_email)
                print(f"📝 Added to database")
                
                try:
                    await db.commit()
                    print(f"✅ COMMITTED!")
                except Exception as e:
                    print(f"❌ COMMIT FAILED: {e}")
                    await db.rollback()
                    raise

            imap.close()
            imap.logout()

        except Exception as e:
            print(f"\n💥 FATAL ERROR: {e}")
            import traceback
            traceback.print_exc()
        
        break


if __name__ == "__main__":
    asyncio.run(sync_with_logging())
