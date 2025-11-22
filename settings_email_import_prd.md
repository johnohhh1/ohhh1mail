# Product Requirements Document: Settings & Email Account Import

## Executive Summary

This PRD outlines the requirements for implementing a comprehensive Settings system and Email Account Import functionality for the email client, inspired by Superhuman's approach but enhanced with IMAP/SMTP support.

**Key Finding from Research**: Superhuman ONLY supports Gmail and Microsoft 365 (Outlook) accounts via OAuth and explicitly does NOT support IMAP/SMTP accounts. However, users frequently request this feature, making it a competitive differentiator.

---

## 1. Settings System

### 1.1 Settings Access

**Primary Access Methods:**
- Keyboard shortcut: `Cmd+K` (Mac) / `Ctrl+K` (Windows) → Type "Settings"
- Click on profile picture/avatar in top-right corner → Settings
- Gear icon in navigation sidebar

**Settings URL Structure:**
- Main settings: `/settings`
- Account-specific: `/settings/accounts`
- Appearance: `/settings/appearance`
- Notifications: `/settings/notifications`
- Keyboard shortcuts: `/settings/shortcuts`
- Email import: `/settings/import`

### 1.2 Settings Categories

#### 1.2.1 General Settings
**Location:** `/settings/general`

**Options:**
- **Window Behavior**
  - Save window position and size between sessions (toggle)
  - Open links in: [System Default Browser | Chrome | Firefox | Safari]
  - Default view on startup: [Inbox | Last viewed Split | Specific Split dropdown]

- **Auto-Save Preferences**
  - Auto-save drafts every: [30s | 1m | 2m | 5m]
  - Keep failed syncs for review (toggle)
  - Retain sent messages for: [Forever | 1 year | 6 months]

- **Quick Tips**
  - Show keyboard shortcut tips at bottom (toggle)
  - Show onboarding tooltips (toggle)
  - Enable contextual help hints (toggle)

#### 1.2.2 Appearance Settings
**Location:** `/settings/appearance`

**Theme Options:**
- Light Mode ("Snow" theme)
- Dark Mode ("Carbon" theme)  
- Auto (matches system preference)
- Schedule dark mode: [Time-based scheduling with start/end times]

**Display Preferences:**
- Font size: [Small | Medium | Large | Extra Large]
- Email density: [Comfortable | Cozy | Compact]
- Show email preview snippets (toggle, with character count slider: 50-200)
- Conversation threading: [Nested | Flat | Gmail-style]
- Avatar display: [Show | Hide | Show for contacts only]

**Color Customization:**
- Accent color picker (for labels, buttons, highlights)
- Custom theme builder (advanced users)

#### 1.2.3 Account Settings
**Location:** `/settings/accounts`

**Account Management:**
- List of all connected accounts
- For each account, display:
  - Email address
  - Account type badge (Gmail | Outlook | IMAP)
  - Sync status indicator (green = synced, yellow = syncing, red = error)
  - Last sync timestamp
  - Three-dot menu: [Set as Primary | Edit Settings | Sign Out | Remove]

**Account Operations:**
- Add Account button (prominent, top-right)
- Drag-and-drop reordering (six-dot handle on left)
- Account switching keyboard shortcuts displayed (Ctrl+1, Ctrl+2, etc.)

**Per-Account Settings:**
- Default signature selection
- Reply-from preferences: [Always default address | Match recipient address | Custom]
- Sync frequency: [Real-time | Every 5 minutes | Every 15 minutes | Manual]
- Folders to sync: [All | Selective with folder picker]

#### 1.2.4 Notification Settings
**Location:** `/settings/notifications`

**Desktop Notifications:**
- Enable push notifications (master toggle)
- Notification filtering:
  - All emails
  - High priority only (when Important/Other enabled)
  - Per-Split customization
  - Specific senders/domains (whitelist/blacklist)

**Notification Display:**
- Show sender name (toggle)
- Show subject line (toggle)
- Show email preview (toggle)
- Notification position: [Top Right | Top Left | Bottom Right | Bottom Left]
- Auto-dismiss after: [Never | 5s | 10s | 30s | 1m]

**Notification Sound:**
- Play sound (toggle)
- Sound selection: [Default | Chime | Ding | Custom | System default]
- Volume slider (0-100%)

**Badge Settings:**
- Show badge icon (toggle)
- Badge count type:
  - Total emails in current Split (Desktop default)
  - Unread emails only
  - High priority unread only
  - Off

**Mobile-Specific Settings:**
- Per-account notification preferences
- Per-Split notification preferences
- Quiet hours (start time, end time, days)

#### 1.2.5 Keyboard Shortcuts
**Location:** `/settings/shortcuts`

**Display:**
- Searchable/filterable list of all shortcuts
- Categories: Actions | Messages | Folders | Calendar | Navigation | Formatting
- Each shortcut shows:
  - Action name
  - Current keyboard combination
  - Description
  - Edit button (for future customization)

**Features:**
- "View All Shortcuts" button → Opens printable/downloadable PDF
- Conflict detection (highlights conflicting shortcuts)
- Export shortcuts as JSON/CSV
- Import custom shortcut schemes

**Note:** Current implementation should match Superhuman's approach (non-customizable), but UI should be ready for future customization

#### 1.2.6 Signature Settings
**Location:** `/settings/signatures`

**Gmail Account Signature:**
- Display: "Signatures for Gmail accounts are managed in Gmail settings"
- "Open Gmail Settings" button → Opens Gmail in new tab
- Preview section showing current Gmail signature
- Refresh button to pull latest signature from Gmail

**Outlook Account Signature:**
- Rich text editor for creating signature
- Formatting toolbar: Bold, Italic, Underline, Font, Size, Color, Link, Image
- "Copy from Outlook" button → Instructions modal
- Variable insertion: {{name}}, {{title}}, {{company}}, {{phone}}

**Signature Options:**
- Include signature on: [New emails | Replies | Forwards | All]
- Include "Sent via [Product Name]" referral link (toggle)
  - Referral benefit explainer: "You and new users get 1 free month"

**Multiple Signatures:**
- Current limitation notice: "Multiple signatures coming soon"
- Workaround suggestion: "Use Snippets for additional signatures"

#### 1.2.7 Split Inbox Settings
**Location:** `/settings/splits`

**Split Management:**
- List of all created splits
- For each split:
  - Name
  - Search query/filter
  - Email count
  - Reorder handle
  - Edit/Delete buttons

**Split Creation:**
- Name input
- Query builder with:
  - From/To/Subject fields
  - Label selector
  - Boolean operators (AND, OR, NOT)
  - Date ranges
  - Attachment filter
  - Read/unread status

**Split Display Options:**
- Show in Inbox (toggle)
- Show in Important/Other (toggle)
- Badge count behavior
- Notification preferences

#### 1.2.8 Advanced Settings
**Location:** `/settings/advanced`

**Sync & Storage:**
- Offline access (toggle)
- Clear cache button
- Cache size display
- Reset app data (with confirmation)

**Experimental Features:**
- Beta features toggle section
- Feature flags for A/B testing

**Privacy & Security:**
- Enable read receipts (toggle)
- Enable link tracking (toggle)
- Enable analytics (toggle)
- Data export options

**Developer Options:**
- API access management
- Webhook configuration
- Debug mode (toggle)

---

## 2. Email Account Import System

### 2.1 Account Type Support

**Supported Account Types:**

1. **Gmail / Google Workspace** (OAuth)
2. **Microsoft 365 / Outlook** (OAuth)
3. **IMAP/SMTP** (Manual configuration) ← **KEY DIFFERENTIATOR**

### 2.2 Add Account Flow

#### 2.2.1 Account Selection Screen

**URL:** `/settings/accounts/add`

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│              Add Email Account                   │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────────────────────────────┐    │
│   │  [G] Sign in with Google              │    │
│   │      Gmail & Google Workspace         │    │
│   └──────────────────────────────────────┘    │
│                                                  │
│   ┌──────────────────────────────────────┐    │
│   │  [M] Sign in with Microsoft           │    │
│   │      Outlook & Microsoft 365          │    │
│   └──────────────────────────────────────┘    │
│                                                  │
│   ┌──────────────────────────────────────┐    │
│   │  [⚙] Configure IMAP/SMTP              │    │
│   │      Any email provider               │    │
│   └──────────────────────────────────────┘    │
│                                                  │
│   Need help? [See supported providers]         │
└─────────────────────────────────────────────────┘
```

**Button Behaviors:**
- **Gmail:** Initiates Google OAuth flow
- **Microsoft:** Initiates Microsoft OAuth flow
- **IMAP/SMTP:** Opens manual configuration wizard

#### 2.2.2 OAuth Flow (Gmail & Outlook)

**Process:**
1. Click "Sign in with Google/Microsoft"
2. Open OAuth popup window (centered, 600x700px)
3. User completes authentication on provider's site
4. Request permissions:
   - Gmail: Read, compose, send, and modify emails
   - Outlook: Read, compose, send, and modify emails
5. Receive OAuth token and refresh token
6. Close popup, return to settings
7. Show success message: "✓ [email@domain.com] added successfully"
8. Begin background sync
9. Show sync progress indicator
10. Redirect to inbox when sync completes initial pull

**Error Handling:**
- Permission denied → Show "Permission required to add account" message
- Network error → Retry button with exponential backoff
- Invalid credentials → Prompt to try again
- Account already added → "This account is already connected"

#### 2.2.3 IMAP/SMTP Manual Configuration

**URL:** `/settings/accounts/add/imap`

**Step 1: Email Provider Detection**

```
┌─────────────────────────────────────────────────┐
│         Configure IMAP/SMTP Account              │
├─────────────────────────────────────────────────┤
│                                                  │
│  Email Address                                   │
│  ┌─────────────────────────────────────────┐   │
│  │ user@example.com                         │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  Password                                        │
│  ┌─────────────────────────────────────────┐   │
│  │ ••••••••••••                             │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  [Try Auto-Configuration]  [Manual Setup]       │
│                                                  │
│  ℹ️ We'll attempt to detect your email          │
│     provider's settings automatically            │
└─────────────────────────────────────────────────┘
```

**Auto-Detection Logic:**
- Extract domain from email address
- Check against known provider database:
  - iCloud: imap.mail.me.com, smtp.mail.me.com
  - Yahoo: imap.mail.yahoo.com, smtp.mail.yahoo.com
  - ProtonMail: 127.0.0.1 (ProtonMail Bridge)
  - FastMail: imap.fastmail.com, smtp.fastmail.com
  - Zoho: imap.zoho.com, smtp.zoho.com
  - Custom: Query MX records, attempt common patterns

**Step 2: Manual Configuration (if auto-detect fails)**

```
┌─────────────────────────────────────────────────┐
│         IMAP/SMTP Configuration                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  Account Information                             │
│  ├─ Your Name: [John Smith                ]    │
│  └─ Email: [user@example.com               ]    │
│                                                  │
│  Incoming Mail (IMAP)                           │
│  ├─ IMAP Server: [imap.example.com         ]    │
│  ├─ Port: [993        ] ▾                       │
│  ├─ Security: [SSL/TLS] ▾                       │
│  ├─ Username: [user@example.com            ]    │
│  └─ Password: [••••••••••                  ]    │
│                                                  │
│  Outgoing Mail (SMTP)                           │
│  ├─ SMTP Server: [smtp.example.com         ]    │
│  ├─ Port: [465        ] ▾                       │
│  ├─ Security: [SSL/TLS] ▾                       │
│  ├─ Username: [user@example.com            ]    │
│  ├─ Password: [••••••••••                  ]    │
│  └─ ☑ Use same credentials as IMAP              │
│                                                  │
│  Advanced Settings                               │
│  └─ [Show Advanced]                             │
│                                                  │
│  [Test Connection]          [Cancel] [Save]     │
└─────────────────────────────────────────────────┘
```

**Port Options:**
- IMAP: 143 (STARTTLS), 993 (SSL/TLS)
- SMTP: 25 (None), 587 (STARTTLS), 465 (SSL/TLS)

**Security Options:**
- None (not recommended, show warning)
- STARTTLS
- SSL/TLS

**Advanced Settings (expandable):**
- Root folder path
- Sent folder name
- Drafts folder name
- Trash folder name
- Archive folder name
- Sync folders: [All | Selective]
- Authentication method: [Password | OAuth2 | Kerberos]

**Step 3: Connection Testing**

```
┌─────────────────────────────────────────────────┐
│         Testing Connection                       │
├─────────────────────────────────────────────────┤
│                                                  │
│  ⏳ Testing IMAP connection...                  │
│  ━━━━━━━━━━━━━━━━━━━━                  65%     │
│                                                  │
│  ✓ Connected to imap.example.com                │
│  ✓ Authenticated successfully                   │
│  ⏳ Fetching folder list...                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Test Results:**
- Success: ✓ Connection successful
- Failure: ✗ Could not connect - [specific error message]
  - Common errors:
    - Invalid credentials
    - Server not found
    - Connection timeout
    - SSL/TLS error
    - Authentication method not supported

**Step 4: Initial Sync Configuration**

```
┌─────────────────────────────────────────────────┐
│         Initial Sync Options                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  How much email history should we sync?          │
│                                                  │
│  ○ Last 7 days                                  │
│  ○ Last 30 days (recommended)                   │
│  ◉ Last 3 months                                │
│  ○ Last year                                    │
│  ○ All mail (may take several hours)            │
│                                                  │
│  Estimated: ~12,500 messages, ~2.4 GB           │
│                                                  │
│  Sync attachments? ☑ Yes  ☐ No                 │
│                                                  │
│  [Begin Sync]                      [Cancel]     │
└─────────────────────────────────────────────────┘
```

**Step 5: Sync Progress**

```
┌─────────────────────────────────────────────────┐
│         Syncing user@example.com                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  Fetching messages from server...               │
│  ━━━━━━━━━━━━━━━━━━━━                  42%     │
│                                                  │
│  5,234 of 12,500 messages synced                │
│  Time remaining: ~8 minutes                      │
│                                                  │
│  You can use your inbox while this completes    │
│  in the background.                              │
│                                                  │
│  [Continue in Background]  [View Details]       │
└─────────────────────────────────────────────────┘
```

### 2.3 Provider-Specific Setup Guides

**Help System Integration:**

For each major provider, provide:
- Step-by-step setup guide
- Screenshots
- Common issues and solutions
- App-specific password instructions (where applicable)

**Example Providers:**
1. **iCloud**
   - Requires app-specific password
   - IMAP: imap.mail.me.com:993 (SSL)
   - SMTP: smtp.mail.me.com:587 (STARTTLS)

2. **Yahoo Mail**
   - Requires "Allow less secure apps" or app password
   - IMAP: imap.mail.yahoo.com:993 (SSL)
   - SMTP: smtp.mail.yahoo.com:587 (STARTTLS)

3. **ProtonMail**
   - Requires ProtonMail Bridge (local proxy)
   - IMAP: 127.0.0.1:1143
   - SMTP: 127.0.0.1:1025
   - Special setup instructions for Bridge

4. **Fastmail**
   - Supports app-specific passwords
   - IMAP: imap.fastmail.com:993 (SSL)
   - SMTP: smtp.fastmail.com:465 (SSL)

5. **Zoho Mail**
   - IMAP: imap.zoho.com:993 (SSL)
   - SMTP: smtp.zoho.com:465 (SSL)

6. **Custom Domain (Generic)**
   - Contact hosting provider for settings
   - Common patterns and what to ask for

### 2.4 Account Management Post-Import

**Account Settings Per Provider:**

**Gmail/Outlook (OAuth):**
- Sync status
- Re-authenticate button
- Disconnect button
- No manual server settings (managed via OAuth)

**IMAP/SMTP:**
- Edit server settings
- Re-test connection
- Manual sync trigger
- Sync frequency: [Real-time push if supported | Poll every X minutes]
- Folder mapping
- Advanced options

### 2.5 Error Handling & Troubleshooting

**Connection Issues:**
- Visual indicators in settings
- Red badge on account in list
- Last sync timestamp shows "Failed at [time]"
- Click for details → Error log modal

**Common Error Scenarios:**

1. **Authentication Expired (OAuth)**
   - "Your Gmail/Outlook session has expired"
   - "Re-authenticate" button
   - Auto-retry with exponential backoff

2. **IMAP Connection Lost**
   - "Cannot connect to mail server"
   - Check if:
     - Internet connection active
     - Server settings correct
     - Password changed
     - App password revoked
   - "Test Connection" and "Edit Settings" buttons

3. **Sync Errors**
   - Partial sync warning
   - Failed message list
   - Retry individual messages
   - Skip and continue option

4. **Quota Exceeded**
   - "Server quota exceeded"
   - Show usage: X of Y GB used
   - Suggestion to archive or delete old emails

### 2.6 Sync Settings

**Per-Account Sync Configuration:**

**Sync Frequency:**
- Real-time (IMAP IDLE if supported)
- Every 5 minutes
- Every 15 minutes
- Every 30 minutes
- Manual only

**Folder Sync:**
- All folders (default)
- Selective sync (folder picker)
- Exclude folders (e.g., spam, large archives)

**Conflict Resolution:**
- Server wins (default)
- Local wins
- Ask each time

**Bandwidth Optimization:**
- Download headers only initially
- Download full messages on demand
- Limit attachment auto-download size: [1MB | 5MB | 10MB | 25MB | Unlimited]
- Sync only on WiFi (mobile option)

---

## 3. Settings Navigation & UX

### 3.1 Settings Sidebar Navigation

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  [<] Settings                                 [Save All] │
│                                                           │
│  ┌───────────────┐  ┌─────────────────────────────────┐ │
│  │ General       │  │                                  │ │
│  │ Appearance    │  │  [Settings Content Panel]       │ │
│  │ Accounts      │  │                                  │ │
│  │ Notifications │  │                                  │ │
│  │ Shortcuts     │  │                                  │ │
│  │ Signatures    │  │                                  │ │
│  │ Split Inbox   │  │                                  │ │
│  │ Calendar      │  │                                  │ │
│  │ Advanced      │  │                                  │ │
│  │               │  │                                  │ │
│  │ ───────────── │  │                                  │ │
│  │ Help & Support│  │                                  │ │
│  │ About         │  │                                  │ │
│  └───────────────┘  └─────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Settings State Management

**Save Behavior:**
- Auto-save for most settings (instant apply)
- Manual save required for:
  - Account credentials
  - Server settings
  - Major sync changes
- Unsaved changes indicator (yellow dot on category)
- Confirmation dialog on navigation if unsaved changes exist

### 3.3 Mobile Settings Access

**iOS/Android:**
- Pull down from top of inbox
- Swipe right (like making an "L")
- Superhuman Command → Settings
- Or tap profile icon → Settings

**Mobile-Optimized Views:**
- Single-column layout
- Touch-friendly controls
- Native pickers for selections
- Swipe gestures for navigation

---

## 4. Technical Implementation

### 4.1 Settings Storage

**Backend Storage:**
- User preferences stored in PostgreSQL `user_settings` table
- Account configurations in `email_accounts` table with encrypted credentials
- Settings synced across devices via API

**Schema Example:**
```sql
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light',
    font_size VARCHAR(20) DEFAULT 'medium',
    email_density VARCHAR(20) DEFAULT 'comfortable',
    notifications_enabled BOOLEAN DEFAULT true,
    notification_sound VARCHAR(50) DEFAULT 'default',
    badge_type VARCHAR(50) DEFAULT 'total',
    keyboard_shortcuts JSONB DEFAULT '{}',
    split_inbox_config JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_accounts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    email_address VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) NOT NULL, -- 'gmail', 'outlook', 'imap'
    display_name VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sync_enabled BOOLEAN DEFAULT true,
    sync_frequency_minutes INT DEFAULT 5,
    
    -- OAuth fields (for Gmail/Outlook)
    oauth_access_token TEXT,
    oauth_refresh_token TEXT,
    oauth_expires_at TIMESTAMP,
    
    -- IMAP fields
    imap_server VARCHAR(255),
    imap_port INT,
    imap_security VARCHAR(20),
    imap_username VARCHAR(255),
    imap_password_encrypted TEXT,
    
    -- SMTP fields
    smtp_server VARCHAR(255),
    smtp_port INT,
    smtp_security VARCHAR(20),
    smtp_username VARCHAR(255),
    smtp_password_encrypted TEXT,
    
    -- Folder mapping
    folder_config JSONB DEFAULT '{}',
    
    -- Sync state
    last_sync_at TIMESTAMP,
    last_sync_status VARCHAR(50),
    sync_error_message TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 IMAP/SMTP Implementation

**Libraries:**
- Python: `imaplib`, `smtplib` (standard library) or `imapclient` (better)
- Node.js: `node-imap`, `nodemailer`

**IMAP Sync Worker:**
```python
class IMAPSyncWorker:
    def __init__(self, account_config):
        self.account = account_config
        self.imap = None
        
    def connect(self):
        """Establish IMAP connection with SSL/TLS"""
        if self.account.imap_security == 'SSL/TLS':
            self.imap = imaplib.IMAP4_SSL(
                self.account.imap_server,
                self.account.imap_port
            )
        else:
            self.imap = imaplib.IMAP4(
                self.account.imap_server,
                self.account.imap_port
            )
            if self.account.imap_security == 'STARTTLS':
                self.imap.starttls()
        
        self.imap.login(
            self.account.imap_username,
            decrypt(self.account.imap_password_encrypted)
        )
        
    def sync_messages(self, folder='INBOX', since_date=None):
        """Sync messages from IMAP server"""
        self.imap.select(folder)
        
        # Build search criteria
        search_criteria = 'ALL'
        if since_date:
            search_criteria = f'(SINCE {since_date.strftime("%d-%b-%Y")})'
        
        # Search for messages
        status, message_ids = self.imap.search(None, search_criteria)
        
        for msg_id in message_ids[0].split():
            # Fetch message
            status, data = self.imap.fetch(msg_id, '(RFC822)')
            
            # Parse and store message
            email_message = email.message_from_bytes(data[0][1])
            self.store_message(email_message, folder)
            
    def idle_mode(self):
        """Use IMAP IDLE for real-time push notifications"""
        self.imap.select('INBOX')
        self.imap.send(b'IDLE\r\n')
        
        while True:
            response = self.imap.readline()
            if b'EXISTS' in response:
                # New message arrived
                self.sync_new_messages()
```

**SMTP Send Worker:**
```python
class SMTPSendWorker:
    def __init__(self, account_config):
        self.account = account_config
        self.smtp = None
        
    def connect(self):
        """Establish SMTP connection"""
        if self.account.smtp_security == 'SSL/TLS':
            self.smtp = smtplib.SMTP_SSL(
                self.account.smtp_server,
                self.account.smtp_port
            )
        else:
            self.smtp = smtplib.SMTP(
                self.account.smtp_server,
                self.account.smtp_port
            )
            if self.account.smtp_security == 'STARTTLS':
                self.smtp.starttls()
        
        self.smtp.login(
            self.account.smtp_username,
            decrypt(self.account.smtp_password_encrypted)
        )
        
    def send_email(self, message_data):
        """Send email via SMTP"""
        msg = MIMEMultipart()
        msg['From'] = message_data['from']
        msg['To'] = message_data['to']
        msg['Subject'] = message_data['subject']
        
        msg.attach(MIMEText(message_data['body'], 'html'))
        
        # Handle attachments
        for attachment in message_data.get('attachments', []):
            self.attach_file(msg, attachment)
        
        self.smtp.send_message(msg)
```

### 4.3 OAuth Implementation

**OAuth Flow Handlers:**

```python
# Gmail OAuth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

def initiate_gmail_oauth():
    flow = Flow.from_client_secrets_file(
        'credentials.json',
        scopes=[
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.modify'
        ],
        redirect_uri='http://localhost:8000/oauth/callback'
    )
    
    auth_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    
    return auth_url, state

def handle_gmail_oauth_callback(code, state):
    flow = Flow.from_client_secrets_file(
        'credentials.json',
        scopes=[...],
        state=state,
        redirect_uri='http://localhost:8000/oauth/callback'
    )
    
    flow.fetch_token(code=code)
    credentials = flow.credentials
    
    # Store tokens
    store_oauth_tokens(
        access_token=credentials.token,
        refresh_token=credentials.refresh_token,
        expires_at=credentials.expiry
    )
    
    return credentials

# Outlook OAuth (similar pattern)
from msal import PublicClientApplication

def initiate_outlook_oauth():
    app = PublicClientApplication(
        client_id='your-client-id',
        authority='https://login.microsoftonline.com/common'
    )
    
    result = app.acquire_token_interactive(
        scopes=[
            'https://outlook.office.com/Mail.ReadWrite',
            'https://outlook.office.com/Mail.Send'
        ]
    )
    
    return result['access_token'], result['refresh_token']
```

### 4.4 Background Sync Service

**Sync Queue Architecture:**
- Celery/RQ for background job processing
- Redis for queue management
- Per-account sync workers
- Rate limiting to respect IMAP server limits
- Retry logic with exponential backoff

**Sync Scheduling:**
```python
from celery import Celery
from celery.schedules import crontab

app = Celery('email_sync')

@app.task
def sync_account(account_id):
    """Sync a single email account"""
    account = EmailAccount.get(account_id)
    
    if account.account_type == 'imap':
        worker = IMAPSyncWorker(account)
    elif account.account_type == 'gmail':
        worker = GmailAPIWorker(account)
    elif account.account_type == 'outlook':
        worker = OutlookAPIWorker(account)
    
    try:
        worker.connect()
        worker.sync_messages()
        account.update_sync_status('success')
    except Exception as e:
        account.update_sync_status('failed', str(e))
        raise

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Schedule sync for each account based on its sync frequency
    accounts = EmailAccount.all()
    for account in accounts:
        if account.sync_enabled:
            sender.add_periodic_task(
                account.sync_frequency_minutes * 60.0,
                sync_account.s(account.id),
            )
```

### 4.5 Security Considerations

**Credential Encryption:**
- Use AES-256-GCM for encrypting passwords
- Store encryption key in secure key management service (AWS KMS, HashiCorp Vault)
- Rotate encryption keys periodically

**OAuth Token Security:**
- Store refresh tokens encrypted
- Implement token rotation
- Revoke tokens on account deletion
- Monitor for suspicious OAuth activity

**IMAP/SMTP Security:**
- Enforce TLS/SSL for all connections
- Validate SSL certificates
- Block plaintext authentication
- Rate limit authentication attempts

**API Security:**
- Require authentication for all settings endpoints
- Validate user ownership of accounts
- Audit log all settings changes
- CSRF protection on all forms

---

## 5. User Experience Flows

### 5.1 First-Time Setup Flow

1. User signs up/logs in
2. Welcome screen: "Add your first email account"
3. Shows account type selector (Gmail/Outlook/IMAP)
4. User selects account type
5. Completes authentication
6. Initial sync begins
7. Onboarding tutorial while syncing
8. Redirects to inbox when ready

### 5.2 Adding Additional Accounts

1. User clicks "Add Account" in settings or Command Palette
2. Account type selector appears
3. Authentication/configuration flow
4. Account added to list
5. Background sync begins
6. Success notification

### 5.3 Switching Between Accounts

**Keyboard:**
- `Ctrl+1`, `Ctrl+2`, `Ctrl+3`, etc.
- `Cmd+K` → "Switch Accounts" → Select from list

**Mouse:**
- Click account avatar/icon
- Click account in settings sidebar

**Mobile:**
- Tap account icon in bottom-right
- Swipe to flip through accounts

### 5.4 Troubleshooting Flow

1. User notices sync issue (red badge)
2. Clicks on account in settings
3. Sees error message: "Connection failed: Invalid credentials"
4. Clicks "Test Connection" or "Edit Settings"
5. Updates password
6. Clicks "Save & Test"
7. Success message: "✓ Connection restored"
8. Sync resumes automatically

---

## 6. Success Metrics

**Settings Usage:**
- % of users who access settings (target: >80% within first week)
- Average time to complete first settings configuration (target: <2 minutes)
- % of users who customize theme (target: >50%)
- % of users who modify notification settings (target: >30%)

**Account Import:**
- Account addition success rate (target: >95% for OAuth, >85% for IMAP)
- Average time to add Gmail account (target: <1 minute)
- Average time to add IMAP account (target: <3 minutes)
- % of users who successfully auto-configure IMAP (target: >70%)
- % of users with multiple accounts (target: >40%)

**Sync Performance:**
- Initial sync completion time (target: <5 minutes for 10k messages)
- Real-time sync latency (target: <30 seconds for new messages)
- Sync error rate (target: <1%)
- % of accounts with successful syncs (target: >98%)

**Support Metrics:**
- % of users who require support for account setup (target: <5%)
- Average resolution time for account issues (target: <2 hours)
- Most common account setup errors (track and address)

---

## 7. Competitive Analysis

**Superhuman (Current Leader):**
- ✅ Clean, fast settings interface
- ✅ OAuth-only (Gmail/Outlook)
- ❌ No IMAP/SMTP support (major limitation)
- ✅ Auto-detection of settings
- ✅ Excellent onboarding
- ❌ $30/month pricing barrier

**Our Competitive Advantages:**
- ✅ IMAP/SMTP support (access to all email providers)
- ✅ iCloud, Yahoo, ProtonMail support
- ✅ Custom domain support
- ✅ Auto-configuration for common providers
- ✅ More affordable pricing
- ✅ Same speed and UX quality

**Mailbird/Spark/Thunderbird:**
- ✅ IMAP/SMTP support
- ❌ Slower, clunkier UI
- ❌ Less intuitive settings
- ❌ Poor mobile experience
- ✅ Free or lower cost

**Our Position:** Premium experience with broad compatibility

---

## 8. Implementation Phases

### Phase 1: Core Settings (2 weeks)
- Settings navigation structure
- General settings
- Appearance settings
- Notification settings
- Keyboard shortcuts display

### Phase 2: OAuth Accounts (2 weeks)
- Gmail OAuth integration
- Outlook OAuth integration
- Account management UI
- Basic sync implementation

### Phase 3: IMAP/SMTP (3 weeks)
- IMAP account configuration UI
- SMTP account configuration UI
- Auto-detection system
- Provider setup guides
- Manual configuration flow
- Connection testing

### Phase 4: Advanced Sync (2 weeks)
- Background sync workers
- Real-time IMAP IDLE
- Folder synchronization
- Conflict resolution
- Error handling and retry logic

### Phase 5: Polish & Optimization (1 week)
- Performance optimization
- UI refinements
- Mobile responsiveness
- Error message improvements
- Analytics integration

**Total Timeline: 10 weeks**

---

## 9. Technical Requirements

### Frontend
- React or Vue.js for settings UI
- Form validation library (e.g., Formik, VeeValidate)
- Toast notifications for feedback
- Loading states and progress indicators
- Responsive design for mobile

### Backend
- FastAPI or Node.js/Express
- OAuth2 client libraries (Google, Microsoft)
- IMAP/SMTP client libraries
- Encryption library (e.g., cryptography for Python)
- Background job processing (Celery, Bull)
- Redis for queue and caching

### Database
- PostgreSQL for settings and account data
- Encrypted storage for credentials
- Indexes on user_id, email_address, account_type

### Infrastructure
- Secure key management (AWS KMS, HashiCorp Vault)
- SSL/TLS certificates
- Monitoring and alerting for sync failures
- Rate limiting for IMAP connections

---

## 10. Open Questions

1. **Sync Strategy:** Should we support POP3 in addition to IMAP? (Recommendation: No, IMAP is superior)

2. **Provider Limits:** How do we handle providers with aggressive rate limits? (Recommendation: Auto-adjust sync frequency)

3. **Large Mailboxes:** How do we handle users with 100k+ messages? (Recommendation: Incremental sync with user-selectable history depth)

4. **Offline Mode:** Should settings be editable offline? (Recommendation: Yes, with sync on reconnect)

5. **Settings Import/Export:** Should users be able to export settings for backup? (Recommendation: Yes, JSON export)

6. **Team Settings:** Should we support team-wide settings management? (Recommendation: Future phase)

---

## 11. Documentation Requirements

**User-Facing:**
- Settings overview guide
- Account setup tutorials for each provider
- Troubleshooting common issues
- FAQ for IMAP/SMTP setup
- Video tutorials for complex setups

**Developer-Facing:**
- API documentation for settings endpoints
- OAuth integration guide
- IMAP/SMTP implementation details
- Security best practices
- Testing procedures

---

## 12. Appendix: Superhuman Settings Reference

Based on research, Superhuman's settings include:

**Accessible via Cmd+K:**
- Account Settings (add, remove, reorder accounts)
- Signatures (Gmail auto-sync, Outlook manual)
- Shortcuts (view only, non-customizable)
- Notifications (per-Split customization on mobile)
- Badge Settings (iOS only)
- Calendar Settings
- Salesforce Settings (enterprise feature)
- Edit Profile (sidebar profile)
- Split Inbox Settings

**Superhuman Limitations:**
- No IMAP/SMTP support
- No unified inbox
- No customizable shortcuts
- No multiple signatures (use Snippets workaround)
- Gmail signatures managed in Gmail, not in-app
- Settings scattered across Command Palette vs dedicated settings page

**Our Improvements:**
- Unified settings page (vs scattered in Command Palette)
- IMAP/SMTP support (major differentiator)
- More granular notification controls
- Settings import/export
- Better mobile settings experience
- Future: customizable shortcuts
