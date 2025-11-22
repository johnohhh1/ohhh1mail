from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from contextlib import asynccontextmanager
import logging

from .config import get_settings
from .database import engine, Base, get_db
from .models import User, Email
from .schemas import UserRegister, EmailSend, AIPrompt, EmailStar
from .utils.auth import create_access_token, verify_password, get_password_hash, get_current_user
from .services.email_service import IMAPWorker, encrypt_password, decrypt_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("🚀 Ohhh1Mail AI started")
    
    yield
    
    # Shutdown
    logger.info("👋 Ohhh1Mail AI shutting down")

app = FastAPI(title="Ohhh1Mail AI", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3040", "http://localhost:3000", "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= AUTH ENDPOINTS =============

@app.post("/auth/register")
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """Register new user"""
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        hashed_pw = get_password_hash(user_data.password)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid password")

    # Create user
    user = User(
        email=user_data.email,
        hashed_password=hashed_pw,
        full_name=user_data.full_name
    )
    db.add(user)
    await db.flush()
    await db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@app.post("/auth/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Login user"""
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }

# ============= EMAIL ENDPOINTS =============

@app.get("/emails")
async def get_emails(
    category: str = None,
    search: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get emails with filters"""
    query = select(Email).where(Email.user_id == current_user.id)
    
    if category:
        query = query.where(Email.ai_category == category)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            (Email.subject.ilike(search_pattern)) |
            (Email.from_address.ilike(search_pattern)) |
            (Email.body_text.ilike(search_pattern))
        )
    
    query = query.order_by(Email.received_at.desc()).limit(50)
    
    result = await db.execute(query)
    emails = result.scalars().all()
    
    return [
        {
            "id": e.id,
            "message_id": e.message_id,
            "from_address": e.from_address,
            "from_name": e.from_name,
            "subject": e.subject,
            "ai_summary": e.ai_summary,
            "ai_category": e.ai_category,
            "is_read": e.is_read,
            "is_starred": e.is_starred,
            "received_at": e.received_at.isoformat() if e.received_at else None,
            "preview": e.body_text[:200] if e.body_text else ""
        }
        for e in emails
    ]

@app.get("/emails/{email_id}")
async def get_email(
    email_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get single email"""
    result = await db.execute(
        select(Email).where(
            (Email.id == email_id) &
            (Email.user_id == current_user.id)
        )
    )
    email = result.scalar_one_or_none()
    
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    return {
        "id": email.id,
        "from_address": email.from_address,
        "from_name": email.from_name,
        "subject": email.subject,
        "body_text": email.body_text,
        "ai_summary": email.ai_summary,
        "ai_category": email.ai_category,
        "is_read": email.is_read,
        "is_starred": email.is_starred,
        "received_at": email.received_at.isoformat() if email.received_at else None
    }

@app.post("/emails/sync")
async def sync_emails(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Trigger email sync"""
    from .models import EmailAccount, Email
    
    try:
        # Get all user accounts
        result = await db.execute(
            select(EmailAccount).where(EmailAccount.user_id == current_user.id)
        )
        accounts = result.scalars().all()
        
        synced_count = 0
        
        for account in accounts:
            if account.account_type == 'imap':
                try:
                    # Decrypt password
                    password = decrypt_password(account.imap_password_encrypted)
                    
                    # Connect and fetch
                    worker = IMAPWorker(
                        server=account.imap_server,
                        port=account.imap_port,
                        username=account.imap_username,
                        password=password
                    )
                    worker.connect()
                    
                    # Fetch last 20 emails
                    emails = worker.fetch_emails(limit=20)
                    
                    for email_data in emails:
                        # Apply domain filtering if configured
                        if account.domain_filter:
                            from_email = email_data['from']
                            # Extract domain from email address
                            if '<' in from_email:
                                from_email = from_email.split('<')[1].split('>')[0]
                            email_domain = from_email.split('@')[-1] if '@' in from_email else ''
                            
                            # Check if domain is in the allowed list
                            allowed_domains = [d.strip().lower() for d in account.domain_filter.split(',')]
                            if email_domain.lower() not in allowed_domains:
                                continue  # Skip this email
                        
                        # Parse the date from IMAP format
                        from email.utils import parsedate_to_datetime
                        try:
                            received_date = parsedate_to_datetime(email_data['date'])
                        except:
                            # Fallback to current time if parsing fails
                            from datetime import datetime
                            received_date = datetime.now()
                        
                        # Check if email already exists by message-id
                        existing = await db.execute(
                            select(Email).where(
                                (Email.user_id == current_user.id) &
                                (Email.message_id == email_data['message_id'])
                            )
                        )
                        if not existing.scalar_one_or_none():
                            new_email = Email(
                                user_id=current_user.id,
                                message_id=email_data['message_id'],
                                from_address=email_data['from'],
                                from_name=email_data['from'].split('<')[0].strip() if '<' in email_data['from'] else email_data['from'],
                                to_address="",
                                subject=email_data['subject'],
                                body_text=email_data['body'],
                                body_html="",
                                received_at=received_date,
                                is_read=False,
                                ai_category="primary"
                            )
                            db.add(new_email)
                            await db.commit()  # Commit immediately
                            synced_count += 1
                            
                except Exception as e:
                    print(f"Sync failed for account {account.email_address}: {e}")
                    import traceback
                    traceback.print_exc()
                    await db.rollback()
                    continue
        
        return {"message": f"Sync complete. Imported {synced_count} new emails."}
    except Exception as e:
        await db.rollback()
        logger.error(f"Global sync error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

@app.post("/emails/send")
async def send_email(
    email_data: EmailSend,
    current_user: User = Depends(get_current_user)
):
    """Send email"""
    return {"message": "Email send not implemented yet"}

@app.patch("/emails/{email_id}/star")
async def star_email(
    email_id: int,
    star_data: EmailStar,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Star/unstar email"""
    result = await db.execute(
        select(Email).where(
            (Email.id == email_id) &
            (Email.user_id == current_user.id)
        )
    )
    email = result.scalar_one_or_none()
    
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    email.is_starred = star_data.is_starred
    await db.commit()
    
    return {"message": "Email updated"}

    return {"message": "Email updated"}

@app.post("/settings/accounts/test")
async def test_imap_connection(
    config: dict,
    current_user: User = Depends(get_current_user)
):
    """Test IMAP connection"""
    try:
        worker = IMAPWorker(
            server=config['imapServer'],
            port=config['imapPort'],
            username=config['email'],
            password=config['password']
        )
        worker.connect()
        return {"status": "success", "message": "Connection successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/settings/accounts")
async def get_email_accounts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all connected email accounts"""
    from .models import EmailAccount
    
    result = await db.execute(
        select(EmailAccount).where(EmailAccount.user_id == current_user.id)
    )
    accounts = result.scalars().all()
    
    return [
        {
            "id": str(acc.id),
            "email": acc.email_address,
            "type": acc.account_type,
            "status": "synced", # TODO: Real status
            "lastSync": acc.updated_at.strftime("%Y-%m-%d %H:%M") if acc.updated_at else "Never"
        }
        for acc in accounts
    ]

@app.post("/settings/accounts")
async def add_email_account(
    account_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add new email account"""
    from .models import EmailAccount
    
    # Check if account already exists
    result = await db.execute(
        select(EmailAccount).where(
            (EmailAccount.user_id == current_user.id) &
            (EmailAccount.email_address == account_data['email'])
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Account already exists")

    new_account = EmailAccount(
        user_id=current_user.id,
        email_address=account_data['email'],
        account_type='imap',
        imap_server=account_data['imapServer'],
        imap_port=int(account_data['imapPort']),
        imap_username=account_data['email'],
        imap_password_encrypted=encrypt_password(account_data['password']),
        smtp_server=account_data['smtpServer'],
        smtp_port=int(account_data['smtpPort']),
        smtp_username=account_data['email'],
        smtp_password_encrypted=encrypt_password(account_data['password']),
        domain_filter=account_data.get('domainFilter', '')  # Optional domain filter
    )
    
    db.add(new_account)
    await db.commit()
    
    return {"status": "success", "message": "Account added successfully"}

@app.delete("/settings/accounts/{account_id}")
async def delete_email_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete an email account"""
    from .models import EmailAccount
    
    result = await db.execute(
        select(EmailAccount).where(
            (EmailAccount.id == account_id) &
            (EmailAccount.user_id == current_user.id)
        )
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    await db.delete(account)
    await db.commit()
    
    return {"status": "success", "message": "Account deleted"}

# ============= AI ENDPOINTS =============

@app.post("/ai/quick-replies/{email_id}")
async def generate_quick_replies(
    email_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate AI quick replies"""
    result = await db.execute(
        select(Email).where(
            (Email.id == email_id) &
            (Email.user_id == current_user.id)
        )
    )
    email = result.scalar_one_or_none()
    
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Mock responses for now
    return {
        "replies": [
            {"tone": "professional", "text": "Thank you for reaching out. I'll review this and get back to you shortly."},
            {"tone": "friendly", "text": "Thanks! I'll take a look and let you know."}
        ]
    }

@app.post("/ai/compose")
async def compose_with_ai(
    prompt_data: AIPrompt,
    current_user: User = Depends(get_current_user)
):
    """Generate email from prompt"""
    # Mock response for now
    return {
        "email_text": f"[AI Generated based on: {prompt_data.prompt}]\n\nHello,\n\nThank you for your message.\n\nBest regards,\nJohn"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {"message": "Ohhh1Mail AI API"}
