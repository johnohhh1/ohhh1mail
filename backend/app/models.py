from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Email settings
    email_provider = Column(String, nullable=True)
    imap_server = Column(String, nullable=True)
    imap_port = Column(Integer, nullable=True)
    smtp_server = Column(String, nullable=True)
    smtp_port = Column(Integer, nullable=True)
    access_token = Column(Text, nullable=True)
    
    emails = relationship("Email", back_populates="user")

class Email(Base):
    __tablename__ = "emails"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    message_id = Column(String, unique=True, index=True)
    from_address = Column(String, index=True)
    from_name = Column(String, nullable=True)
    to_address = Column(String, nullable=True)
    subject = Column(Text)
    body_text = Column(Text, nullable=True)
    body_html = Column(Text, nullable=True)
    
    # AI generated
    ai_summary = Column(Text, nullable=True)
    ai_category = Column(String, index=True, nullable=True)
    
    # Status
    is_read = Column(Boolean, default=False)
    is_starred = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    
    # Timestamps
    received_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="emails")

class EmailAccount(Base):
    __tablename__ = "email_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    email_address = Column(String, index=True)
    account_type = Column(String) # gmail, outlook, imap
    
    # IMAP
    imap_server = Column(String, nullable=True)
    imap_port = Column(Integer, nullable=True)
    imap_username = Column(String, nullable=True)
    imap_password_encrypted = Column(String, nullable=True)
    
    # SMTP
    smtp_server = Column(String, nullable=True)
    smtp_port = Column(Integer, nullable=True)
    smtp_username = Column(String, nullable=True)
    smtp_password_encrypted = Column(Text, nullable=True)
    
    # Domain filtering (comma-separated list of domains to import from)
    domain_filter = Column(Text, nullable=True)  # e.g., "example.com,company.com"
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="accounts")

# Update User relationship
User.accounts = relationship("EmailAccount", back_populates="user")
