# Comprehensive Product Requirements Document: Complete Email System
## Superhuman-Inspired Email Client with Selective Domain Syncing

---

## Executive Summary

This PRD defines a complete, production-ready email system inspired by Superhuman but with critical enhancements including **selective sender domain syncing** - allowing users to choose which sender domains to sync from their email accounts. This addresses a major gap in existing email clients where users are forced to sync everything, wasting storage and bandwidth on unwanted promotional emails, newsletters, and spam.

**Core Innovation:** Domain-based selective sync - sync only from domains you care about (e.g., `@company.com`, `@client.org`) while ignoring marketing emails, reducing sync time by up to 80% and storage by up to 70%.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Selective Domain Syncing](#2-selective-domain-syncing-core-feature)
3. [Account Management & Authentication](#3-account-management--authentication)
4. [Email Sync Engine](#4-email-sync-engine)
5. [Message Storage & Database](#5-message-storage--database)
6. [Email Composition & Sending](#6-email-composition--sending)
7. [Threading & Conversation Management](#7-threading--conversation-management)
8. [Search & Filtering](#8-search--filtering)
9. [Split Inbox & Views](#9-split-inbox--views)
10. [Real-Time Updates](#10-real-time-updates)
11. [Attachment Handling](#11-attachment-handling)
12. [Labels & Organization](#12-labels--organization)
13. [Keyboard Shortcuts](#13-keyboard-shortcuts)
14. [Notifications System](#14-notifications-system)
15. [Read Receipts & Tracking](#15-read-receipts--tracking)
16. [Snippets & Templates](#16-snippets--templates)
17. [Calendar Integration](#17-calendar-integration)
18. [AI Features](#18-ai-features)
19. [Performance & Optimization](#19-performance--optimization)
20. [Security & Privacy](#20-security--privacy)
21. [Mobile Experience](#21-mobile-experience)
22. [Analytics & Insights](#22-analytics--insights)
23. [API & Integrations](#23-api--integrations)
24. [Implementation Plan](#24-implementation-plan)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  Desktop App │  │  Mobile App  │         │
│  │  (React/Vue) │  │   (Electron) │  │(React Native)│         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   API Gateway    │
                    │   (Rate Limit,   │
                    │   Auth, Cache)   │
                    └────────┬─────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼──────────┐              ┌──────────▼──────────┐
│  Application API   │              │   WebSocket Server  │
│    (FastAPI)       │              │  (Real-time sync)   │
└─────────┬──────────┘              └──────────┬──────────┘
          │                                     │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼──────────┐              ┌──────────▼──────────┐
│   Core Services    │              │   Background Jobs   │
│ ┌────────────────┐ │              │ ┌────────────────┐ │
│ │ Auth Service   │ │              │ │ Sync Workers   │ │
│ │ Email Service  │ │              │ │ IMAP Workers   │ │
│ │ Search Service │ │              │ │ SMTP Workers   │ │
│ │ Storage Svc    │ │              │ │ AI Workers     │ │
│ └────────────────┘ │              │ └────────────────┘ │
└─────────┬──────────┘              └──────────┬──────────┘
          │                                     │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼──────────┐              ┌──────────▼──────────┐
│   Data Layer       │              │   Cache Layer       │
│ ┌────────────────┐ │              │ ┌────────────────┐ │
│ │ PostgreSQL     │ │              │ │ Redis          │ │
│ │ (Messages,     │ │              │ │ (Sessions,     │ │
│ │  Threads,      │ │              │ │  Queue, Cache) │ │
│ │  Accounts)     │ │              │ └────────────────┘ │
│ └────────────────┘ │              └─────────────────────┘
│ ┌────────────────┐ │
│ │ Elasticsearch  │ │
│ │ (Full-text     │ │
│ │  search)       │ │
│ └────────────────┘ │
└────────────────────┘
┌─────────────────────┐
│  Object Storage     │
│  (S3/MinIO)         │
│  (Attachments)      │
└─────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Gmail API    │  │ Outlook API  │  │ IMAP Servers │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- Web: React 18+ with TypeScript, TailwindCSS
- Desktop: Electron with same React codebase
- Mobile: React Native with shared business logic
- State Management: Zustand or Redux Toolkit
- Real-time: Socket.io client

**Backend:**
- API: FastAPI (Python 3.11+)
- WebSocket: FastAPI WebSockets or Socket.io
- Background Jobs: Celery with Redis broker
- Task Scheduling: Celery Beat

**Data Storage:**
- Primary DB: PostgreSQL 15+ (JSONB for flexible schemas)
- Search: Elasticsearch 8+ or OpenSearch
- Cache: Redis 7+ (sessions, queues, real-time data)
- Object Storage: S3 or MinIO (attachments)

**Email Processing:**
- IMAP: `imapclient` (Python) or `node-imap` (Node.js)
- SMTP: `aiosmtplib` (async Python) or `nodemailer` (Node.js)
- Parsing: `email` (Python stdlib) or `mailparser` (Node.js)
- OAuth: `google-auth` and `msal` libraries

**Infrastructure:**
- Container: Docker, Docker Compose
- Orchestration: Kubernetes (production)
- CI/CD: GitHub Actions, GitLab CI
- Monitoring: Prometheus + Grafana
- Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
- Error Tracking: Sentry

---

## 2. Selective Domain Syncing (Core Feature)

### 2.1 Feature Overview

**Problem Statement:**
Current email clients sync ALL emails, forcing users to download and store thousands of unwanted promotional emails, newsletters, and notifications. This:
- Wastes 70%+ of storage on emails users never read
- Slows initial sync (can take hours for large mailboxes)
- Clutters the inbox with irrelevant content
- Wastes bandwidth and server resources

**Solution:**
Allow users to specify which sender domains to sync. Only emails from whitelisted domains are downloaded and stored locally.

**Example Use Cases:**
1. **Professional User:** Only sync from `@company.com`, `@client.com`, `@partner.org`
2. **Entrepreneur:** Only sync from paying customers' domains, ignore marketing
3. **Student:** Only sync from `@university.edu`, `@professor.edu`, key domains
4. **Power User:** Sync from specific domains, exclude all promotional/newsletter domains

### 2.2 Domain Selection Interface

**Location:** `/settings/accounts/[account_id]/sync-filters`

**UI Mockup:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Selective Sync for john@example.com                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Sync Strategy                                                   │
│  ○ Sync all emails (default)                                    │
│  ● Sync only from specific domains (recommended)                │
│  ○ Sync everything except specific domains                      │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Allowed Domains (whitelist)                    [Analyze Inbox] │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ @company.com                              [×] Remove     │   │
│  │ @client.org                               [×] Remove     │   │
│  │ @partner.net                              [×] Remove     │   │
│  │ @university.edu                           [×] Remove     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  [+ Add Domain]                                                 │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Domain Suggestions (based on your inbox)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ @gmail.com              2,345 emails      [+ Add]       │   │
│  │ @github.com               892 emails      [+ Add]       │   │
│  │ @slack.com                654 emails      [+ Add]       │   │
│  │ @notion.so                234 emails      [+ Add]       │   │
│  │ @stripe.com               189 emails      [+ Add]       │   │
│  │                                     [Show More (50+)]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Advanced Options                                                │
│  ☑ Sync emails to me personally (not in TO/CC with others)     │
│  ☑ Sync emails where I'm the only recipient                    │
│  ☐ Ignore automated emails (unsubscribe links, bulk mail)      │
│  ☐ Ignore marketing emails (detected by headers)               │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Impact Analysis                                                 │
│  Current inbox: 45,892 total emails                            │
│  With current filters: ~8,234 emails (82% reduction)           │
│  Estimated sync time: 8 minutes (was: 2 hours)                 │
│  Storage saved: ~12.4 GB                                        │
│                                                                  │
│  [Cancel]                    [Save & Apply] [Save & Re-sync]   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Domain Analysis Tool

**"Analyze Inbox" Feature:**
When clicked, runs a quick IMAP scan to:
1. Fetch all sender domains from the last 90 days
2. Count emails per domain
3. Categorize domains:
   - **Personal:** Individual email addresses (e.g., john@gmail.com)
   - **Professional:** Company domains (e.g., @company.com)
   - **Services:** SaaS/services (e.g., @github.com, @stripe.com)
   - **Marketing:** Promotional emails (detected by headers/unsubscribe links)
   - **Newsletters:** Newsletter services (e.g., @substack.com, @beehiiv.com)
4. Show breakdown with recommendations

**Analysis Results Modal:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Inbox Analysis Results                                     [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Analyzed 45,892 emails from last 90 days                      │
│                                                                  │
│  Top Sender Domains                         Select All Categories│
│                                                                  │
│  Professional (8 domains, 12,345 emails)            [Select All]│
│  ☑ @mycompany.com                    5,234 emails              │
│  ☑ @client-a.com                     2,891 emails              │
│  ☑ @client-b.org                     1,456 emails              │
│  ☑ @partner.net                        892 emails              │
│  ... 4 more                                        [Show All]   │
│                                                                  │
│  Services (15 domains, 8,932 emails)                [Select All]│
│  ☑ @github.com                         892 emails              │
│  ☑ @slack.com                          654 emails              │
│  ☑ @notion.so                          234 emails              │
│  ☑ @stripe.com                         189 emails              │
│  ☑ @figma.com                          145 emails              │
│  ... 10 more                                       [Show All]   │
│                                                                  │
│  Personal (234 addresses, 3,421 emails)             [Select All]│
│  ☑ john@gmail.com                      456 emails              │
│  ☑ sarah@yahoo.com                     234 emails              │
│  ☑ mike@outlook.com                    189 emails              │
│  ... 231 more                                      [Show All]   │
│                                                                  │
│  Marketing (892 domains, 15,234 emails)             [Ignore All]│
│  ☐ @promo.company.com                2,345 emails              │
│  ☐ @newsletter.site.com              1,892 emails              │
│  ☐ @deals.shop.com                   1,456 emails              │
│  ... 889 more                                      [Show All]   │
│                                                                  │
│  Newsletters (45 domains, 5,960 emails)             [Ignore All]│
│  ☐ @substack.com                     1,234 emails              │
│  ☐ @beehiiv.com                        892 emails              │
│  ☐ @convertkit.com                     654 emails              │
│  ... 42 more                                       [Show All]   │
│                                                                  │
│  Selected: 42 domains (24,698 emails, 54% of total)            │
│                                                                  │
│  [Cancel]                     [Apply Selected Domains]          │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Domain Matching Rules

**Exact Domain Match:**
```
@company.com → Matches emails from *@company.com
@client.org  → Matches emails from *@client.org
```

**Subdomain Support:**
```
*.company.com → Matches @mail.company.com, @support.company.com, etc.
```

**Individual Email Addresses:**
```
john@gmail.com → Matches only this specific address
```

**Wildcard Patterns:**
```
*@*.company.com → Matches any subdomain of company.com
```

### 2.5 Sync Behavior

**Initial Sync with Domain Filtering:**
1. User configures domain whitelist
2. Click "Save & Re-sync"
3. System connects to IMAP server
4. For each folder:
   - Fetch message headers only (FROM field)
   - Filter messages by domain whitelist
   - Download full content only for matching messages
5. Store filtered messages in local database
6. Continue with incremental sync

**Incremental Sync:**
- New messages checked via IMAP IDLE or polling
- Only messages from whitelisted domains are downloaded
- Non-matching messages are ignored (never downloaded)

**Server-Side Filtering (when supported):**
```python
# IMAP SEARCH with OR conditions for each domain
search_query = "OR " * (len(domains) - 1)
for domain in domains:
    search_query += f'FROM "@{domain}" '
```

**Client-Side Filtering (fallback):**
```python
def should_sync_message(message_from: str, whitelist: List[str]) -> bool:
    """Check if message sender matches any whitelisted domain"""
    email_domain = message_from.split('@')[-1].lower()
    
    for pattern in whitelist:
        if pattern.startswith('*'):
            # Wildcard pattern matching
            if fnmatch(email_domain, pattern[1:]):
                return True
        elif '@' in pattern:
            # Exact email address match
            if message_from.lower() == pattern.lower():
                return True
        else:
            # Domain match
            if email_domain == pattern.lower():
                return True
    
    return False
```

### 2.6 Domain Management Features

**Bulk Operations:**
- Import domains from CSV
- Export current whitelist
- Temporary disable domain (without removing)
- Domain groups (e.g., "Clients", "Team", "Services")

**Smart Suggestions:**
- Auto-suggest domains from sent mail (likely important)
- Suggest domains from starred/flagged messages
- ML-based suggestions based on reply rate
- Suggest domains from calendar meeting attendees

**Domain Statistics:**
- Emails synced per domain (last 7/30/90 days)
- Storage used per domain
- Last received email from domain
- Response rate per domain (for prioritization)

### 2.7 Migration & Re-sync

**Changing Domain Filters:**
- User modifies whitelist
- Option 1: "Apply to new emails only" (keep existing)
- Option 2: "Re-sync from server" (purge non-matching)

**Re-sync Behavior:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Re-sync Confirmation                                       [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  You've changed your domain sync filters.                       │
│                                                                  │
│  What would you like to do?                                     │
│                                                                  │
│  ○ Apply to new emails only                                     │
│     Keep existing emails (24,698 emails)                        │
│     New emails will be filtered                                 │
│                                                                  │
│  ● Re-sync entire account                                       │
│     Delete emails not matching new filters (12,456 emails)      │
│     Re-download matching emails from server                     │
│     This may take ~8 minutes                                    │
│                                                                  │
│  ☐ Delete local attachments for removed emails                 │
│     (save ~8.2 GB of storage)                                   │
│                                                                  │
│  [Cancel]                                  [Continue]           │
└─────────────────────────────────────────────────────────────────┘
```

### 2.8 Technical Implementation

**Database Schema for Domain Filters:**
```sql
CREATE TABLE account_sync_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
    
    -- Sync strategy
    strategy VARCHAR(50) NOT NULL DEFAULT 'all', 
    -- 'all' | 'whitelist' | 'blacklist'
    
    -- Domain patterns (JSONB array)
    domain_patterns JSONB DEFAULT '[]'::jsonb,
    -- Example: ["@company.com", "john@gmail.com", "*.client.org"]
    
    -- Additional filters
    only_direct_emails BOOLEAN DEFAULT false,
    only_solo_recipient BOOLEAN DEFAULT false,
    ignore_automated BOOLEAN DEFAULT false,
    ignore_marketing BOOLEAN DEFAULT false,
    
    -- Statistics
    total_messages_in_account INTEGER DEFAULT 0,
    estimated_matching_messages INTEGER DEFAULT 0,
    last_analysis_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_account_sync_filters_account 
ON account_sync_filters(account_id);
```

**Sync Worker with Domain Filtering:**
```python
class IMAPSyncWorker:
    def __init__(self, account_id: UUID):
        self.account = get_account(account_id)
        self.filters = get_sync_filters(account_id)
        self.imap = None
        
    def should_sync_message(self, message_from: str) -> bool:
        """Check if message matches sync filters"""
        if self.filters.strategy == 'all':
            return True
            
        email_domain = extract_domain(message_from)
        
        if self.filters.strategy == 'whitelist':
            return self._matches_patterns(
                message_from, 
                email_domain,
                self.filters.domain_patterns
            )
        elif self.filters.strategy == 'blacklist':
            return not self._matches_patterns(
                message_from,
                email_domain, 
                self.filters.domain_patterns
            )
            
    def sync_folder(self, folder_name: str):
        """Sync a single folder with domain filtering"""
        self.imap.select(folder_name)
        
        # Try server-side filtering first (faster)
        if self.filters.strategy == 'whitelist' and len(self.filters.domain_patterns) < 50:
            search_criteria = self._build_imap_search()
            message_ids = self.imap.search(search_criteria)
        else:
            # Fallback to fetching all headers and filtering client-side
            all_ids = self.imap.search(['ALL'])
            message_ids = []
            
            for msg_id in all_ids:
                # Fetch only FROM header (fast)
                envelope = self.imap.fetch([msg_id], ['ENVELOPE'])[msg_id]
                message_from = envelope[b'ENVELOPE'].from_[0].mailbox + '@' + \
                              envelope[b'ENVELOPE'].from_[0].host
                
                if self.should_sync_message(message_from):
                    message_ids.append(msg_id)
        
        # Now download full messages for matching IDs
        for msg_id in message_ids:
            self._download_and_store_message(msg_id, folder_name)
    
    def _build_imap_search(self) -> List[str]:
        """Build IMAP search criteria from domain patterns"""
        criteria = []
        
        for pattern in self.filters.domain_patterns:
            if '@' in pattern and not pattern.startswith('@'):
                # Specific email address
                criteria.append(f'FROM "{pattern}"')
            elif pattern.startswith('@'):
                # Domain pattern
                domain = pattern[1:]
                criteria.append(f'FROM "@{domain}"')
        
        # Combine with OR
        if len(criteria) > 1:
            return ['OR'] * (len(criteria) - 1) + criteria
        return criteria
```

**Domain Analysis Service:**
```python
class DomainAnalyzer:
    def __init__(self, account_id: UUID):
        self.account = get_account(account_id)
        
    async def analyze_inbox(
        self, 
        days: int = 90,
        sample_size: int = 10000
    ) -> Dict[str, Any]:
        """Analyze inbox to suggest domains"""
        
        # Connect to IMAP
        imap = await self._connect_imap()
        imap.select('INBOX')
        
        # Get messages from last N days
        since_date = datetime.now() - timedelta(days=days)
        message_ids = imap.search([
            'SINCE', 
            since_date.strftime('%d-%b-%Y')
        ])
        
        # Sample if too many messages
        if len(message_ids) > sample_size:
            message_ids = random.sample(message_ids, sample_size)
        
        # Fetch envelopes (FROM field) for all messages
        domain_stats = defaultdict(lambda: {
            'count': 0,
            'category': 'unknown',
            'examples': []
        })
        
        for msg_id in message_ids:
            envelope = imap.fetch([msg_id], ['ENVELOPE'])[msg_id]
            from_addr = self._extract_email_from_envelope(envelope)
            domain = extract_domain(from_addr)
            
            domain_stats[domain]['count'] += 1
            if len(domain_stats[domain]['examples']) < 3:
                domain_stats[domain]['examples'].append(from_addr)
        
        # Categorize domains
        categorized = await self._categorize_domains(domain_stats)
        
        # Calculate impact
        total_messages = len(message_ids)
        
        return {
            'total_analyzed': total_messages,
            'analysis_period_days': days,
            'domains': categorized,
            'categories': {
                'professional': [d for d in categorized if d['category'] == 'professional'],
                'services': [d for d in categorized if d['category'] == 'services'],
                'personal': [d for d in categorized if d['category'] == 'personal'],
                'marketing': [d for d in categorized if d['category'] == 'marketing'],
                'newsletters': [d for d in categorized if d['category'] == 'newsletters'],
            }
        }
    
    async def _categorize_domains(
        self, 
        domain_stats: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Categorize domains using heuristics and ML"""
        
        categorized = []
        
        for domain, stats in domain_stats.items():
            category = await self._determine_category(domain, stats)
            
            categorized.append({
                'domain': domain,
                'count': stats['count'],
                'category': category,
                'examples': stats['examples']
            })
        
        # Sort by count descending
        categorized.sort(key=lambda x: x['count'], reverse=True)
        
        return categorized
    
    async def _determine_category(
        self,
        domain: str,
        stats: Dict[str, Any]
    ) -> str:
        """Determine domain category using heuristics"""
        
        # Check against known patterns
        if domain in KNOWN_SERVICE_DOMAINS:
            return 'services'
        
        if domain in KNOWN_NEWSLETTER_DOMAINS:
            return 'newsletters'
        
        # Check domain structure
        if domain.count('.') == 1:  # e.g., company.com
            if stats['count'] > 50:
                return 'professional'
            else:
                return 'personal'
        
        # Check for marketing indicators in subdomain
        marketing_keywords = ['promo', 'newsletter', 'deals', 'offers', 'marketing']
        if any(kw in domain.lower() for kw in marketing_keywords):
            return 'marketing'
        
        # Default to professional for company domains
        if stats['count'] > 20:
            return 'professional'
        
        return 'personal'
```

---

## 3. Account Management & Authentication

### 3.1 Supported Account Types

**OAuth Providers:**
- Google (Gmail, Google Workspace)
- Microsoft (Outlook, Microsoft 365, Hotmail)
- Yahoo (OAuth 2.0)
- AOL (OAuth 2.0)

**IMAP/SMTP Providers:**
- iCloud (app-specific password required)
- FastMail
- ProtonMail (via ProtonMail Bridge)
- Zoho Mail
- Custom domains (any IMAP/SMTP server)

### 3.2 OAuth Authentication Flow

**Gmail OAuth:**
```python
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://www.googleapis.com/auth/gmail.settings.basic'
]

def initiate_gmail_oauth(user_id: UUID) -> str:
    """Initiate Gmail OAuth flow"""
    flow = Flow.from_client_secrets_file(
        'client_secret.json',
        scopes=SCOPES,
        redirect_uri=f'{BASE_URL}/auth/gmail/callback'
    )
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    
    # Store state in Redis for validation
    redis.setex(f'oauth_state:{state}', 600, user_id)
    
    return authorization_url

async def handle_gmail_callback(code: str, state: str):
    """Handle OAuth callback"""
    user_id = redis.get(f'oauth_state:{state}')
    if not user_id:
        raise ValueError('Invalid OAuth state')
    
    flow = Flow.from_client_secrets_file(
        'client_secret.json',
        scopes=SCOPES,
        state=state,
        redirect_uri=f'{BASE_URL}/auth/gmail/callback'
    )
    
    flow.fetch_token(code=code)
    credentials = flow.credentials
    
    # Get user email
    service = build('gmail', 'v1', credentials=credentials)
    profile = service.users().getProfile(userId='me').execute()
    email_address = profile['emailAddress']
    
    # Store account
    account = await create_email_account(
        user_id=user_id,
        email_address=email_address,
        account_type='gmail',
        oauth_access_token=credentials.token,
        oauth_refresh_token=credentials.refresh_token,
        oauth_expires_at=credentials.expiry
    )
    
    # Start initial sync
    await trigger_initial_sync(account.id)
    
    return account
```

**Microsoft OAuth:**
```python
from msal import ConfidentialClientApplication

SCOPES = [
    'https://outlook.office.com/Mail.ReadWrite',
    'https://outlook.office.com/Mail.Send',
    'offline_access'
]

def initiate_microsoft_oauth(user_id: UUID) -> str:
    """Initiate Microsoft OAuth flow"""
    app = ConfidentialClientApplication(
        client_id=MICROSOFT_CLIENT_ID,
        client_credential=MICROSOFT_CLIENT_SECRET,
        authority=f'https://login.microsoftonline.com/common'
    )
    
    auth_url = app.get_authorization_request_url(
        scopes=SCOPES,
        redirect_uri=f'{BASE_URL}/auth/microsoft/callback',
        state=generate_state()
    )
    
    return auth_url
```

### 3.3 IMAP/SMTP Configuration

**Auto-Detection for Common Providers:**
```python
PROVIDER_CONFIGS = {
    'icloud.com': {
        'imap_server': 'imap.mail.me.com',
        'imap_port': 993,
        'imap_security': 'SSL/TLS',
        'smtp_server': 'smtp.mail.me.com',
        'smtp_port': 587,
        'smtp_security': 'STARTTLS',
        'notes': 'Requires app-specific password from appleid.apple.com'
    },
    'yahoo.com': {
        'imap_server': 'imap.mail.yahoo.com',
        'imap_port': 993,
        'imap_security': 'SSL/TLS',
        'smtp_server': 'smtp.mail.yahoo.com',
        'smtp_port': 587,
        'smtp_security': 'STARTTLS',
        'notes': 'Enable "Less secure apps" or use app password'
    },
    'fastmail.com': {
        'imap_server': 'imap.fastmail.com',
        'imap_port': 993,
        'imap_security': 'SSL/TLS',
        'smtp_server': 'smtp.fastmail.com',
        'smtp_port': 465,
        'smtp_security': 'SSL/TLS',
        'notes': 'Use app-specific password for security'
    },
    'protonmail.com': {
        'imap_server': '127.0.0.1',
        'imap_port': 1143,
        'imap_security': 'STARTTLS',
        'smtp_server': '127.0.0.1',
        'smtp_port': 1025,
        'smtp_security': 'STARTTLS',
        'notes': 'Requires ProtonMail Bridge installed locally'
    },
    'zoho.com': {
        'imap_server': 'imap.zoho.com',
        'imap_port': 993,
        'imap_security': 'SSL/TLS',
        'smtp_server': 'smtp.zoho.com',
        'smtp_port': 465,
        'smtp_security': 'SSL/TLS'
    }
}

def auto_detect_settings(email_address: str) -> Optional[Dict[str, Any]]:
    """Auto-detect IMAP/SMTP settings from email address"""
    domain = email_address.split('@')[-1].lower()
    
    if domain in PROVIDER_CONFIGS:
        return PROVIDER_CONFIGS[domain]
    
    # Try MX record lookup for custom domains
    return try_mx_record_detection(domain)
```

### 3.4 Account Storage Schema

```sql
CREATE TABLE email_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic info
    email_address VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    account_type VARCHAR(50) NOT NULL, 
    -- 'gmail' | 'outlook' | 'imap' | 'yahoo'
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- OAuth credentials (encrypted)
    oauth_access_token TEXT,
    oauth_refresh_token TEXT,
    oauth_token_type VARCHAR(50),
    oauth_expires_at TIMESTAMP,
    oauth_scope TEXT,
    
    -- IMAP credentials (encrypted)
    imap_server VARCHAR(255),
    imap_port INTEGER,
    imap_security VARCHAR(20), -- 'SSL/TLS' | 'STARTTLS' | 'NONE'
    imap_username VARCHAR(255),
    imap_password_encrypted TEXT,
    
    -- SMTP credentials (encrypted)
    smtp_server VARCHAR(255),
    smtp_port INTEGER,
    smtp_security VARCHAR(20),
    smtp_username VARCHAR(255),
    smtp_password_encrypted TEXT,
    smtp_use_same_credentials BOOLEAN DEFAULT true,
    
    -- Sync settings
    sync_enabled BOOLEAN DEFAULT true,
    sync_frequency_minutes INTEGER DEFAULT 5,
    sync_from_date TIMESTAMP, -- Only sync emails after this date
    
    -- Folder configuration
    folders_config JSONB DEFAULT '{}'::jsonb,
    -- {
    --   "inbox": "INBOX",
    --   "sent": "[Gmail]/Sent Mail",
    --   "drafts": "Drafts",
    --   "trash": "[Gmail]/Trash",
    --   "archive": "[Gmail]/All Mail",
    --   "spam": "[Gmail]/Spam"
    -- }
    
    -- Sync state
    last_sync_at TIMESTAMP,
    last_sync_status VARCHAR(50), -- 'success' | 'failed' | 'partial'
    last_sync_error TEXT,
    sync_progress JSONB DEFAULT '{}'::jsonb,
    -- {
    --   "total_messages": 10000,
    --   "synced_messages": 2500,
    --   "current_folder": "INBOX",
    --   "started_at": "2025-01-01T10:00:00Z"
    -- }
    
    -- Statistics
    total_messages INTEGER DEFAULT 0,
    total_threads INTEGER DEFAULT 0,
    unread_count INTEGER DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, email_address)
);

CREATE INDEX idx_email_accounts_user ON email_accounts(user_id);
CREATE INDEX idx_email_accounts_active ON email_accounts(user_id, is_active);
CREATE INDEX idx_email_accounts_sync ON email_accounts(sync_enabled, last_sync_at);
```

### 3.5 Credential Encryption

```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2

class CredentialEncryption:
    def __init__(self, master_key: bytes):
        self.cipher = Fernet(master_key)
    
    def encrypt(self, plaintext: str) -> str:
        """Encrypt credentials"""
        return self.cipher.encrypt(plaintext.encode()).decode()
    
    def decrypt(self, ciphertext: str) -> str:
        """Decrypt credentials"""
        return self.cipher.decrypt(ciphertext.encode()).decode()

# Initialize with master key from environment or KMS
encryption = CredentialEncryption(
    master_key=os.getenv('ENCRYPTION_MASTER_KEY').encode()
)

# Usage
encrypted_password = encryption.encrypt('user_password')
decrypted_password = encryption.decrypt(encrypted_password)
```

---

## 4. Email Sync Engine

### 4.1 Sync Architecture

**Three-Tier Sync Strategy:**

1. **Real-Time Sync (IMAP IDLE):**
   - For active accounts
   - Push notifications for new mail
   - Near-instant updates (<5 seconds)

2. **Periodic Sync (Polling):**
   - Every 5-15 minutes
   - Fallback when IDLE not supported
   - Checks for new/moved/deleted messages

3. **Full Re-Sync (On-Demand):**
   - User-triggered
   - Rebuilds entire mailbox from server
   - Reconciles any discrepancies

### 4.2 Initial Sync Process

```python
class InitialSyncWorker:
    async def run(self, account_id: UUID):
        """Perform initial sync for new account"""
        account = await get_account(account_id)
        filters = await get_sync_filters(account_id)
        
        # Update status
        await update_sync_status(account_id, 'syncing', {
            'phase': 'connecting',
            'progress': 0
        })
        
        try:
            # 1. Connect to server
            if account.account_type == 'gmail':
                client = GmailAPIClient(account)
            elif account.account_type == 'outlook':
                client = OutlookAPIClient(account)
            else:
                client = IMAPClient(account)
            
            await client.connect()
            
            # 2. Get folder list
            folders = await client.list_folders()
            await update_sync_status(account_id, 'syncing', {
                'phase': 'folders_fetched',
                'folder_count': len(folders),
                'progress': 5
            })
            
            # 3. Sync each folder
            total_messages = 0
            for i, folder in enumerate(folders):
                folder_messages = await self.sync_folder(
                    client,
                    folder,
                    account_id,
                    filters
                )
                total_messages += folder_messages
                
                progress = 5 + int((i + 1) / len(folders) * 90)
                await update_sync_status(account_id, 'syncing', {
                    'phase': 'syncing_folders',
                    'current_folder': folder.name,
                    'completed_folders': i + 1,
                    'total_folders': len(folders),
                    'total_messages': total_messages,
                    'progress': progress
                })
            
            # 4. Build threads
            await update_sync_status(account_id, 'syncing', {
                'phase': 'building_threads',
                'progress': 95
            })
            await build_threads_for_account(account_id)
            
            # 5. Complete
            await update_sync_status(account_id, 'success', {
                'phase': 'complete',
                'progress': 100,
                'total_messages': total_messages
            })
            
            # 6. Start IDLE monitoring
            await start_idle_monitor(account_id)
            
        except Exception as e:
            await update_sync_status(account_id, 'failed', {
                'error': str(e),
                'progress': 0
            })
            raise
    
    async def sync_folder(
        self,
        client: EmailClient,
        folder: Folder,
        account_id: UUID,
        filters: SyncFilters
    ) -> int:
        """Sync a single folder"""
        
        # Select folder
        await client.select_folder(folder.name)
        
        # Get message UIDs
        if filters.strategy == 'whitelist':
            # Try server-side search if supported
            uids = await client.search_with_filter(filters)
        else:
            # Get all UIDs
            uids = await client.search(['ALL'])
        
        # Fetch messages in batches
        batch_size = 100
        synced = 0
        
        for i in range(0, len(uids), batch_size):
            batch_uids = uids[i:i + batch_size]
            
            # Fetch message data
            messages = await client.fetch_messages(batch_uids, [
                'UID',
                'ENVELOPE',
                'FLAGS',
                'INTERNALDATE',
                'RFC822.SIZE',
                'BODY.PEEK[]'  # Full message without marking as read
            ])
            
            for uid, msg_data in messages.items():
                # Apply client-side filtering if needed
                if filters.strategy != 'all':
                    if not should_sync_message(msg_data['ENVELOPE'].from_, filters):
                        continue
                
                # Parse and store message
                await self.store_message(
                    account_id,
                    folder.name,
                    uid,
                    msg_data
                )
                synced += 1
        
        return synced
    
    async def store_message(
        self,
        account_id: UUID,
        folder: str,
        uid: int,
        msg_data: Dict[str, Any]
    ):
        """Parse and store a message"""
        # Parse raw message
        raw_email = msg_data['BODY[]']
        parsed = email.message_from_bytes(raw_email)
        
        # Extract data
        message = {
            'account_id': account_id,
            'folder': folder,
            'uid': uid,
            'message_id': parsed.get('Message-ID', ''),
            'in_reply_to': parsed.get('In-Reply-To'),
            'references': parsed.get('References', '').split(),
            'from_email': parseaddr(parsed.get('From', ''))[1],
            'from_name': parseaddr(parsed.get('From', ''))[0],
            'to_emails': [addr[1] for addr in getaddresses(parsed.get_all('To', []))],
            'cc_emails': [addr[1] for addr in getaddresses(parsed.get_all('Cc', []))],
            'bcc_emails': [addr[1] for addr in getaddresses(parsed.get_all('Bcc', []))],
            'subject': parsed.get('Subject', ''),
            'date': parsedate_to_datetime(parsed.get('Date', '')),
            'size_bytes': msg_data['RFC822.SIZE'],
            'flags': list(msg_data['FLAGS']),
            'is_read': b'\\Seen' in msg_data['FLAGS'],
            'is_starred': b'\\Flagged' in msg_data['FLAGS'],
            'is_draft': b'\\Draft' in msg_data['FLAGS'],
        }
        
        # Extract body
        if parsed.is_multipart():
            text_body = None
            html_body = None
            
            for part in parsed.walk():
                content_type = part.get_content_type()
                
                if content_type == 'text/plain' and not text_body:
                    text_body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                elif content_type == 'text/html' and not html_body:
                    html_body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
            
            message['body_text'] = text_body
            message['body_html'] = html_body or text_body
        else:
            body = parsed.get_payload(decode=True).decode('utf-8', errors='ignore')
            message['body_text'] = body
            message['body_html'] = body
        
        # Handle attachments
        attachments = []
        if parsed.is_multipart():
            for part in parsed.walk():
                if part.get_content_disposition() == 'attachment':
                    filename = part.get_filename()
                    content = part.get_payload(decode=True)
                    
                    # Upload to object storage
                    attachment_id = await upload_attachment(
                        account_id,
                        filename,
                        content,
                        part.get_content_type()
                    )
                    
                    attachments.append({
                        'id': attachment_id,
                        'filename': filename,
                        'content_type': part.get_content_type(),
                        'size_bytes': len(content)
                    })
        
        message['attachments'] = attachments
        
        # Store in database
        await db.messages.insert(message)
        
        # Index for search
        await search.index_message(message)
```

### 4.3 Real-Time Sync (IMAP IDLE)

```python
class IMAPIdleMonitor:
    def __init__(self, account_id: UUID):
        self.account_id = account_id
        self.account = None
        self.client = None
        self.running = False
    
    async def start(self):
        """Start IDLE monitoring"""
        self.account = await get_account(self.account_id)
        self.client = IMAPClient(self.account)
        await self.client.connect()
        
        self.running = True
        
        while self.running:
            try:
                await self.client.select_folder('INBOX')
                
                # Start IDLE
                await self.client.idle()
                
                # Wait for events (with 29-minute timeout to refresh)
                events = await asyncio.wait_for(
                    self.client.idle_check(),
                    timeout=1740  # 29 minutes
                )
                
                # Stop IDLE
                await self.client.idle_done()
                
                # Process events
                if events:
                    await self.handle_events(events)
                
            except asyncio.TimeoutError:
                # IDLE timed out, restart
                await self.client.idle_done()
            except Exception as e:
                logger.error(f"IDLE error for account {self.account_id}: {e}")
                await asyncio.sleep(60)  # Wait before retry
    
    async def handle_events(self, events: List[str]):
        """Handle IMAP IDLE events"""
        for event in events:
            if b'EXISTS' in event:
                # New message
                await self.sync_new_messages()
            elif b'EXPUNGE' in event:
                # Message deleted
                uid = int(event.split()[0])
                await self.handle_message_deleted(uid)
            elif b'FETCH' in event:
                # Message flags changed
                await self.sync_flag_changes()
    
    async def sync_new_messages(self):
        """Sync newly arrived messages"""
        # Get highest UID we have
        last_uid = await db.messages.get_max_uid(
            self.account_id, 
            'INBOX'
        )
        
        # Fetch messages after last_uid
        new_uids = await self.client.search([f'UID {last_uid + 1}:*'])
        
        if new_uids:
            await self.fetch_and_store_messages(new_uids)
            
            # Send real-time notification to user
            await send_websocket_event(
                user_id=self.account.user_id,
                event='new_messages',
                data={'count': len(new_uids)}
            )
    
    async def stop(self):
        """Stop IDLE monitoring"""
        self.running = False
        if self.client:
            await self.client.idle_done()
            await self.client.disconnect()
```

### 4.4 Incremental Sync (Polling)

```python
class IncrementalSyncWorker:
    async def sync(self, account_id: UUID):
        """Perform incremental sync"""
        account = await get_account(account_id)
        
        if account.account_type == 'gmail':
            await self.sync_gmail_incremental(account)
        elif account.account_type == 'outlook':
            await self.sync_outlook_incremental(account)
        else:
            await self.sync_imap_incremental(account)
    
    async def sync_imap_incremental(self, account: EmailAccount):
        """Incremental sync for IMAP accounts"""
        client = IMAPClient(account)
        await client.connect()
        
        folders = await client.list_folders()
        
        for folder in folders:
            await client.select_folder(folder.name)
            
            # Get last synced UID for this folder
            last_uid = await db.messages.get_max_uid(
                account.id,
                folder.name
            )
            
            # Check for new messages
            new_uids = await client.search([f'UID {last_uid + 1}:*'])
            if new_uids:
                await self.fetch_and_store_messages(
                    client,
                    account.id,
                    folder.name,
                    new_uids
                )
            
            # Check for flag changes on existing messages
            changed_uids = await client.search([
                f'UID 1:{last_uid}',
                'SINCE',
                (account.last_sync_at - timedelta(days=7)).strftime('%d-%b-%Y')
            ])
            
            if changed_uids:
                await self.sync_flag_changes(
                    client,
                    account.id,
                    folder.name,
                    changed_uids
                )
        
        await client.disconnect()
        
        # Update last sync time
        account.last_sync_at = datetime.now()
        account.last_sync_status = 'success'
        await db.accounts.update(account)
```

### 4.5 Gmail API Sync

```python
class GmailAPISyncWorker:
    def __init__(self, account: EmailAccount):
        self.account = account
        self.service = self._build_service()
    
    def _build_service(self):
        """Build Gmail API service"""
        credentials = Credentials(
            token=self.account.oauth_access_token,
            refresh_token=self.account.oauth_refresh_token,
            token_uri='https://oauth2.googleapis.com/token',
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET
        )
        return build('gmail', 'v1', credentials=credentials)
    
    async def sync_incremental(self):
        """Incremental sync using Gmail API history"""
        
        # Get history ID from last sync
        last_history_id = await db.accounts.get_history_id(self.account.id)
        
        try:
            # List history changes
            history = self.service.users().history().list(
                userId='me',
                startHistoryId=last_history_id,
                historyTypes=['messageAdded', 'messageDeleted', 'labelAdded', 'labelRemoved']
            ).execute()
            
            if 'history' not in history:
                return  # No changes
            
            # Process history items
            for item in history['history']:
                # New messages
                if 'messagesAdded' in item:
                    for msg in item['messagesAdded']:
                        await self.fetch_and_store_message(msg['message']['id'])
                
                # Deleted messages
                if 'messagesDeleted' in item:
                    for msg in item['messagesDeleted']:
                        await self.mark_message_deleted(msg['message']['id'])
                
                # Label changes
                if 'labelsAdded' in item or 'labelsRemoved' in item:
                    await self.sync_message_labels(item)
            
            # Update history ID
            new_history_id = history['historyId']
            await db.accounts.set_history_id(self.account.id, new_history_id)
            
        except Exception as e:
            if 'historyId' in str(e):
                # History ID expired, do full sync
                await self.full_sync()
            else:
                raise
    
    async def fetch_and_store_message(self, gmail_id: str):
        """Fetch and store a single Gmail message"""
        msg = self.service.users().messages().get(
            userId='me',
            id=gmail_id,
            format='raw'
        ).execute()
        
        # Decode raw message
        raw_email = base64.urlsafe_b64decode(msg['raw'])
        parsed = email.message_from_bytes(raw_email)
        
        # Store message (similar to IMAP sync)
        await self.store_message(gmail_id, msg, parsed)
```

---

## 5. Message Storage & Database

### 5.1 Message Schema

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
    
    -- Server identifiers
    server_id VARCHAR(255) NOT NULL, -- IMAP UID or Gmail message ID
    message_id VARCHAR(255) NOT NULL, -- RFC822 Message-ID
    thread_id UUID REFERENCES threads(id),
    
    -- Folder/Labels
    folder VARCHAR(255) NOT NULL,
    labels JSONB DEFAULT '[]'::jsonb,
    
    -- Sender
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(500),
    reply_to_email VARCHAR(255),
    
    -- Recipients
    to_emails JSONB NOT NULL DEFAULT '[]'::jsonb,
    cc_emails JSONB DEFAULT '[]'::jsonb,
    bcc_emails JSONB DEFAULT '[]'::jsonb,
    
    -- Content
    subject TEXT,
    body_text TEXT,
    body_html TEXT,
    snippet TEXT, -- First 200 chars for previews
    
    -- Threading
    in_reply_to VARCHAR(255),
    references TEXT[], -- Array of Message-IDs
    
    -- Metadata
    date TIMESTAMP NOT NULL,
    received_date TIMESTAMP,
    size_bytes INTEGER,
    
    -- Flags
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    is_draft BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    is_trashed BOOLEAN DEFAULT false,
    is_spam BOOLEAN DEFAULT false,
    
    -- Attachments
    has_attachments BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]'::jsonb,
    -- [
    --   {
    --     "id": "uuid",
    --     "filename": "document.pdf",
    --     "content_type": "application/pdf",
    --     "size_bytes": 123456,
    --     "storage_url": "s3://bucket/..."
    --   }
    -- ]
    
    -- Tracking
    opened_at TIMESTAMP,
    opened_count INTEGER DEFAULT 0,
    link_clicks JSONB DEFAULT '[]'::jsonb,
    
    -- Full-text search vector
    search_vector tsvector,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(account_id, server_id, folder)
);

-- Indexes
CREATE INDEX idx_messages_account ON messages(account_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_folder ON messages(account_id, folder);
CREATE INDEX idx_messages_date ON messages(account_id, date DESC);
CREATE INDEX idx_messages_from ON messages(from_email);
CREATE INDEX idx_messages_message_id ON messages(message_id);
CREATE INDEX idx_messages_flags ON messages(account_id, is_read, is_starred);
CREATE INDEX idx_messages_search ON messages USING GIN(search_vector);
CREATE INDEX idx_messages_labels ON messages USING GIN(labels);
```

### 5.2 Thread Schema

```sql
CREATE TABLE threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
    
    -- Thread info
    subject TEXT NOT NULL,
    snippet TEXT, -- Preview from latest message
    
    -- Participants
    participants JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- [
    --   {"email": "user@example.com", "name": "User Name"},
    --   ...
    -- ]
    
    -- Counts
    message_count INTEGER DEFAULT 0,
    unread_count INTEGER DEFAULT 0,
    
    -- Dates
    first_message_date TIMESTAMP,
    last_message_date TIMESTAMP,
    
    -- Flags (aggregated from messages)
    has_starred BOOLEAN DEFAULT false,
    has_important BOOLEAN DEFAULT false,
    has_attachments BOOLEAN DEFAULT false,
    
    -- Status
    is_archived BOOLEAN DEFAULT false,
    is_trashed BOOLEAN DEFAULT false,
    
    -- Labels (aggregated)
    labels JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_threads_account ON threads(account_id);
CREATE INDEX idx_threads_last_message ON threads(account_id, last_message_date DESC);
CREATE INDEX idx_threads_labels ON threads USING GIN(labels);
```

### 5.3 Threading Algorithm

```python
class ThreadBuilder:
    """Build conversation threads from messages"""
    
    async def build_threads_for_account(self, account_id: UUID):
        """Build all threads for an account"""
        
        # Get all messages ordered by date
        messages = await db.messages.get_all(
            account_id,
            order_by='date ASC'
        )
        
        # Group by conversation
        threads = {}
        
        for message in messages:
            thread_key = self._get_thread_key(message)
            
            if thread_key not in threads:
                threads[thread_key] = []
            
            threads[thread_key].append(message)
        
        # Create thread records
        for thread_key, thread_messages in threads.items():
            await self._create_thread(account_id, thread_messages)
    
    def _get_thread_key(self, message: Message) -> str:
        """Determine thread key for a message"""
        
        # Priority 1: Use In-Reply-To
        if message.in_reply_to:
            return self._normalize_message_id(message.in_reply_to)
        
        # Priority 2: Use References (last one)
        if message.references:
            return self._normalize_message_id(message.references[-1])
        
        # Priority 3: Use normalized subject
        normalized_subject = self._normalize_subject(message.subject)
        
        # Build thread key from subject + participants
        participants = sorted([
            message.from_email,
            *message.to_emails,
            *message.cc_emails
        ])
        
        return f"{normalized_subject}:{':'.join(participants)}"
    
    def _normalize_subject(self, subject: str) -> str:
        """Normalize subject for threading"""
        if not subject:
            return ''
        
        # Remove Re:, Fwd:, etc.
        subject = re.sub(r'^(Re|Fwd|Fw):\s*', '', subject, flags=re.IGNORECASE)
        
        # Remove extra whitespace
        subject = ' '.join(subject.split())
        
        return subject.lower().strip()
    
    async def _create_thread(
        self,
        account_id: UUID,
        messages: List[Message]
    ):
        """Create a thread from messages"""
        
        # Sort by date
        messages.sort(key=lambda m: m.date)
        
        first_message = messages[0]
        last_message = messages[-1]
        
        # Get unique participants
        participants = set()
        for msg in messages:
            participants.add((msg.from_email, msg.from_name))
            for email in msg.to_emails + msg.cc_emails:
                participants.add((email, None))
        
        # Aggregate flags
        has_starred = any(m.is_starred for m in messages)
        has_important = any(m.is_important for m in messages)
        has_attachments = any(m.has_attachments for m in messages)
        unread_count = sum(1 for m in messages if not m.is_read)
        
        # Aggregate labels
        all_labels = set()
        for msg in messages:
            all_labels.update(msg.labels)
        
        # Create thread
        thread = await db.threads.create({
            'account_id': account_id,
            'subject': first_message.subject,
            'snippet': last_message.snippet,
            'participants': [
                {'email': email, 'name': name}
                for email, name in participants
            ],
            'message_count': len(messages),
            'unread_count': unread_count,
            'first_message_date': first_message.date,
            'last_message_date': last_message.date,
            'has_starred': has_starred,
            'has_important': has_important,
            'has_attachments': has_attachments,
            'labels': list(all_labels)
        })
        
        # Update messages with thread_id
        for msg in messages:
            msg.thread_id = thread.id
            await db.messages.update(msg)
        
        return thread
```

---

## 6. Email Composition & Sending

### 6.1 Compose UI

**Compose Window States:**
- New Email (blank)
- Reply (to single sender)
- Reply All (to all recipients)
- Forward (with original content)
- Draft (saved partially completed email)

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  New Message                                            [_][□][×]│
├─────────────────────────────────────────────────────────────────┤
│  From: john@example.com ▾                                        │
│  To: [recipient@example.com                                    ] │
│  Cc: [                                                         ] │
│  Bcc: [                                                        ] │
│  Subject: [                                                    ] │
│  ───────────────────────────────────────────────────────────────│
│  [B][I][U][🔗][📷][📎] Sans Serif ▾  12pt ▾  [Aa][⚙]         │
│  ───────────────────────────────────────────────────────────────│
│                                                                  │
│  [Email body editor]                                            │
│                                                                  │
│                                                                  │
│                                                                  │
│  ───────────────────────────────────────────────────────────────│
│  Attachments: [document.pdf (2.4 MB) ×] [image.png (156 KB) ×] │
│  ───────────────────────────────────────────────────────────────│
│  [Insert Snippet ▾]  [Schedule Send ▾]          [Send] [Discard]│
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Compose API

```typescript
interface ComposeMessage {
  id?: string; // For drafts
  accountId: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyText: string;
  bodyHtml: string;
  attachments?: Attachment[];
  inReplyTo?: string; // Message-ID of message being replied to
  references?: string[]; // Message-IDs for threading
  isPlainText?: boolean;
  scheduledSendAt?: Date;
}

interface Attachment {
  id?: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  data?: ArrayBuffer; // For new attachments
  url?: string; // For existing attachments
}
```

### 6.3 Send Email Service

```python
class EmailSendService:
    async def send(
        self,
        account_id: UUID,
        message: ComposeMessage
    ) -> str:
        """Send an email"""
        
        account = await get_account(account_id)
        
        if account.account_type == 'gmail':
            return await self.send_via_gmail_api(account, message)
        elif account.account_type == 'outlook':
            return await self.send_via_outlook_api(account, message)
        else:
            return await self.send_via_smtp(account, message)
    
    async def send_via_smtp(
        self,
        account: EmailAccount,
        message: ComposeMessage
    ) -> str:
        """Send email via SMTP"""
        
        # Build MIME message
        msg = MIMEMultipart('mixed')
        msg['From'] = message.from_
        msg['To'] = ', '.join(message.to)
        
        if message.cc:
            msg['Cc'] = ', '.join(message.cc)
        
        msg['Subject'] = message.subject
        msg['Date'] = formatdate(localtime=True)
        msg['Message-ID'] = make_msgid(domain=message.from_.split('@')[1])
        
        if message.in_reply_to:
            msg['In-Reply-To'] = message.in_reply_to
        
        if message.references:
            msg['References'] = ' '.join(message.references)
        
        # Add body
        body_part = MIMEMultipart('alternative')
        
        if message.body_text:
            body_part.attach(MIMEText(message.body_text, 'plain', 'utf-8'))
        
        if message.body_html:
            body_part.attach(MIMEText(message.body_html, 'html', 'utf-8'))
        
        msg.attach(body_part)
        
        # Add attachments
        for attachment in message.attachments:
            file_part = MIMEApplication(
                attachment.data,
                Name=attachment.filename
            )
            file_part['Content-Disposition'] = \
                f'attachment; filename="{attachment.filename}"'
            msg.attach(file_part)
        
        # Send via SMTP
        async with aiosmtplib.SMTP(
            hostname=account.smtp_server,
            port=account.smtp_port,
            use_tls=(account.smtp_security == 'SSL/TLS')
        ) as smtp:
            if account.smtp_security == 'STARTTLS':
                await smtp.starttls()
            
            await smtp.login(
                account.smtp_username,
                decrypt(account.smtp_password_encrypted)
            )
            
            await smtp.send_message(msg)
        
        # Store in Sent folder
        await self.save_to_sent(account, msg)
        
        return msg['Message-ID']
    
    async def send_via_gmail_api(
        self,
        account: EmailAccount,
        message: ComposeMessage
    ) -> str:
        """Send email via Gmail API"""
        
        service = build_gmail_service(account)
        
        # Build MIME message (same as SMTP)
        mime_message = self._build_mime_message(message)
        
        # Encode for Gmail API
        encoded = base64.urlsafe_b64encode(
            mime_message.as_bytes()
        ).decode('utf-8')
        
        # Send
        result = service.users().messages().send(
            userId='me',
            body={'raw': encoded}
        ).execute()
        
        return result['id']
    
    async def save_draft(
        self,
        account_id: UUID,
        message: ComposeMessage
    ) -> str:
        """Save message as draft"""
        
        # Store draft in database
        draft = await db.drafts.create({
            'account_id': account_id,
            'from_email': message.from_,
            'to_emails': message.to,
            'cc_emails': message.cc,
            'bcc_emails': message.bcc,
            'subject': message.subject,
            'body_html': message.body_html,
            'body_text': message.body_text,
            'attachments': message.attachments,
            'in_reply_to': message.in_reply_to,
            'references': message.references
        })
        
        # Sync to server (IMAP or API)
        account = await get_account(account_id)
        
        if account.account_type == 'gmail':
            await self.save_draft_to_gmail(account, draft)
        else:
            await self.save_draft_to_imap(account, draft)
        
        return draft.id
```

### 6.4 Auto-Save Drafts

```typescript
class DraftAutoSaver {
  private draftId?: string;
  private saveTimeout?: NodeJS.Timeout;
  private readonly SAVE_DELAY_MS = 2000; // 2 seconds
  
  onChange(message: ComposeMessage) {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    // Schedule save
    this.saveTimeout = setTimeout(() => {
      this.saveDraft(message);
    }, this.SAVE_DELAY_MS);
  }
  
  async saveDraft(message: ComposeMessage) {
    try {
      const response = await api.post('/drafts/save', {
        draftId: this.draftId,
        ...message
      });
      
      this.draftId = response.draftId;
      
      // Show saved indicator
      this.showSavedIndicator();
    } catch (error) {
      console.error('Failed to save draft:', error);
      this.showErrorIndicator();
    }
  }
  
  async discard() {
    if (this.draftId) {
      await api.post('/drafts/delete', { draftId: this.draftId });
    }
  }
}
```

### 6.5 Scheduled Sending

```python
class ScheduledSendService:
    async def schedule(
        self,
        account_id: UUID,
        message: ComposeMessage,
        send_at: datetime
    ) -> str:
        """Schedule an email to be sent later"""
        
        # Save as scheduled message
        scheduled = await db.scheduled_messages.create({
            'account_id': account_id,
            'message_data': message.dict(),
            'send_at': send_at,
            'status': 'scheduled'
        })
        
        # Schedule Celery task
        send_scheduled_email.apply_async(
            args=[scheduled.id],
            eta=send_at
        )
        
        return scheduled.id
    
    async def cancel_scheduled(self, scheduled_id: str):
        """Cancel a scheduled send"""
        scheduled = await db.scheduled_messages.get(scheduled_id)
        
        if scheduled.status == 'scheduled':
            # Revoke Celery task
            celery_app.control.revoke(scheduled.celery_task_id)
            
            # Update status
            scheduled.status = 'cancelled'
            await db.scheduled_messages.update(scheduled)

@celery_app.task
async def send_scheduled_email(scheduled_id: str):
    """Celery task to send scheduled email"""
    scheduled = await db.scheduled_messages.get(scheduled_id)
    
    if scheduled.status != 'scheduled':
        return  # Already sent or cancelled
    
    try:
        # Send email
        message = ComposeMessage(**scheduled.message_data)
        await EmailSendService().send(scheduled.account_id, message)
        
        # Update status
        scheduled.status = 'sent'
        scheduled.sent_at = datetime.now()
        await db.scheduled_messages.update(scheduled)
        
    except Exception as e:
        # Mark as failed
        scheduled.status = 'failed'
        scheduled.error_message = str(e)
        await db.scheduled_messages.update(scheduled)
```

---

*Due to length constraints, I'll continue with the remaining sections in a follow-up message. The PRD continues with:*

7. Threading & Conversation Management
8. Search & Filtering
9. Split Inbox & Views
10-24. [All other sections from the table of contents]

Would you like me to continue with the complete PRD, or would you like to focus on specific sections?
