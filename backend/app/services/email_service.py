import imaplib
import smtplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from cryptography.fernet import Fernet
from ..config import get_settings

settings = get_settings()
# Use key from config
cipher_suite = Fernet(settings.ENCRYPTION_KEY)

def encrypt_password(password: str) -> str:
    return cipher_suite.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password: str) -> str:
    return cipher_suite.decrypt(encrypted_password.encode()).decode()

class IMAPWorker:
    def __init__(self, server, port, username, password):
        self.server = server
        self.port = int(port)
        self.username = username
        self.password = password
        self.connection = None

    def connect(self):
        try:
            self.connection = imaplib.IMAP4_SSL(self.server, self.port)
            self.connection.login(self.username, self.password)
            return True
        except Exception as e:
            print(f"IMAP Connection Error: {e}")
            raise e

    def fetch_emails(self, limit=10):
        if not self.connection:
            self.connect()
        
        self.connection.select('INBOX')
        _, message_numbers = self.connection.search(None, 'ALL')
        
        messages = []
        for num in message_numbers[0].split()[-limit:]:
            _, msg_data = self.connection.fetch(num, '(RFC822)')
            email_body = msg_data[0][1]
            email_message = email.message_from_bytes(email_body)
            
            # Extract body text
            body = ""
            if email_message.is_multipart():
                for part in email_message.walk():
                    if part.get_content_type() == "text/plain":
                        try:
                            body = part.get_payload(decode=True).decode()
                            break
                        except:
                            pass
            else:
                try:
                    body = email_message.get_payload(decode=True).decode()
                except:
                    body = str(email_message.get_payload())
            
            # Extract message-id or create one
            message_id = email_message.get('Message-ID', f'<generated-{num.decode()}@imported>')
            
            messages.append({
                'message_id': message_id,
                'subject': email_message.get('subject', '(no subject)'),
                'from': email_message.get('from', ''),
                'date': email_message.get('date', ''),
                'body': body[:5000] if body else "[No content]"  # Limit to 5000 chars
            })
            
        return messages

class SMTPWorker:
    def __init__(self, server, port, username, password):
        self.server = server
        self.port = int(port)
        self.username = username
        self.password = password

    def send_email(self, to_email, subject, body):
        msg = MIMEMultipart()
        msg['From'] = self.username
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        try:
            server = smtplib.SMTP_SSL(self.server, self.port)
            server.login(self.username, self.password)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"SMTP Error: {e}")
            raise e
