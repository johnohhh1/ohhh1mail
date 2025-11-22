"""Run clean sync"""
import asyncio
from clean_sync import sync_account_emails

if __name__ == "__main__":
    result = asyncio.run(sync_account_emails(account_id=3, user_id=2, limit=20))
    print(f"\n✅ FINAL RESULT: {result}")
