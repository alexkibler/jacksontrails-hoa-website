#!/usr/bin/env python3
"""
Test script for spam prevention on contact and newsletter forms
Tests honeypot and time-based validation
"""

import requests
import time
from datetime import datetime

# Configuration
# For local testing:
# BASE_URL = "http://localhost:3000"
# For production testing:
BASE_URL = "https://hoa.alexkibler.com"

# Use test API endpoints (these accept standard HTTP POST without Server Action headers)
CONTACT_URL = f"{BASE_URL}/api/test-contact"
NEWSLETTER_URL = f"{BASE_URL}/api/test-newsletter"

def print_test_header(test_name):
    print(f"\n{'='*60}")
    print(f"TEST: {test_name}")
    print(f"{'='*60}")

def print_result(response, expected_to_fail=False):
    print(f"Status Code: {response.status_code}")

    try:
        data = response.json()
        print(f"Response: {data}")

        if expected_to_fail:
            if not data.get('success', True) and data.get('error'):
                print("✅ PASSED - Spam correctly detected and blocked")
            else:
                print("❌ FAILED - Spam should have been blocked")
        else:
            if data.get('success'):
                print("✅ PASSED - Legitimate submission accepted")
            elif data.get('error'):
                print(f"⚠️  Legitimate submission rejected: {data.get('error')}")
            else:
                print("⚠️  Unknown response")
    except Exception as e:
        print(f"Response: {response.text[:500]}")
        print(f"⚠️  Error parsing response: {e}")

# ==============================================================================
# Contact Form Tests
# ==============================================================================

def test_contact_honeypot():
    """Test that filling the honeypot field blocks submission"""
    print_test_header("Contact Form - Honeypot Detection")

    form_start_time = str(int(time.time() * 1000))
    time.sleep(2.5)  # Wait enough time to pass timing check

    # Submit with honeypot filled (BOT behavior)
    data = {
        "name": "Test Bot",
        "email": "bot@example.com",
        "subject": "Test Subject",
        "message": "This is a test message from a bot",
        "website": "https://spam-site.com",  # Honeypot field filled!
        "formStartTime": form_start_time,
    }

    response = requests.post(CONTACT_URL, data=data)
    print_result(response, expected_to_fail=True)

def test_contact_too_fast():
    """Test that submitting too quickly blocks submission"""
    print_test_header("Contact Form - Too Fast Submission")

    form_start_time = str(int(time.time() * 1000))
    # Submit immediately without waiting (BOT behavior)

    data = {
        "name": "Speed Demon",
        "email": "fast@example.com",
        "subject": "Quick Submit",
        "message": "Submitted in under 2 seconds",
        "website": "",  # Honeypot empty (good)
        "formStartTime": form_start_time,
    }

    response = requests.post(CONTACT_URL, data=data)
    print_result(response, expected_to_fail=True)

def test_contact_legitimate():
    """Test that a legitimate submission passes validation"""
    print_test_header("Contact Form - Legitimate Submission")

    form_start_time = str(int(time.time() * 1000))
    print(f"Waiting 3 seconds to simulate human form filling...")
    time.sleep(3)

    data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "subject": "Test Message",
        "message": "This is a legitimate test message from a human user.",
        "website": "",  # Honeypot empty (good)
        "formStartTime": form_start_time,
    }

    response = requests.post(CONTACT_URL, data=data)
    print_result(response, expected_to_fail=False)
    print("Note: This may still fail if email sending fails, but spam validation should pass")

# ==============================================================================
# Newsletter Form Tests
# ==============================================================================

def test_newsletter_honeypot():
    """Test that filling the honeypot field blocks newsletter signup"""
    print_test_header("Newsletter - Honeypot Detection")

    form_start_time = str(int(time.time() * 1000))
    time.sleep(2.5)

    data = {
        "email": "bot-newsletter@example.com",
        "consent": "on",
        "website": "https://spam-newsletter.com",  # Honeypot filled!
        "formStartTime": form_start_time,
    }

    response = requests.post(NEWSLETTER_URL, data=data)
    print_result(response, expected_to_fail=True)

def test_newsletter_too_fast():
    """Test that submitting newsletter too quickly blocks submission"""
    print_test_header("Newsletter - Too Fast Submission")

    form_start_time = str(int(time.time() * 1000))

    data = {
        "email": "fast-newsletter@example.com",
        "consent": "on",
        "website": "",
        "formStartTime": form_start_time,
    }

    response = requests.post(NEWSLETTER_URL, data=data)
    print_result(response, expected_to_fail=True)

def test_newsletter_legitimate():
    """Test that a legitimate newsletter signup passes validation"""
    print_test_header("Newsletter - Legitimate Submission")

    form_start_time = str(int(time.time() * 1000))
    print(f"Waiting 3 seconds to simulate human form filling...")
    time.sleep(3)

    data = {
        "email": "legitimate@example.com",
        "consent": "on",
        "website": "",
        "formStartTime": form_start_time,
    }

    response = requests.post(NEWSLETTER_URL, data=data)
    print_result(response, expected_to_fail=False)
    print("Note: This may still fail if MailerLite API fails, but spam validation should pass")

# ==============================================================================
# Main Test Runner
# ==============================================================================

def main():
    print(f"\n{'#'*60}")
    print(f"# Spam Prevention Test Suite")
    print(f"# Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"# Target: {BASE_URL}")
    print(f"{'#'*60}")

    try:
        # Test connection
        print("\nChecking if server is running...")
        response = requests.get(BASE_URL, timeout=5)
        print(f"✅ Server is accessible (status {response.status_code})")
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to {BASE_URL}")
        print(f"Error: {e}")
        print("\nMake sure the Next.js development server is running:")
        print("  cd frontend && npm run dev")
        return

    # Run all tests
    print("\n" + "="*60)
    print("Running Contact Form Tests")
    print("="*60)
    test_contact_honeypot()
    time.sleep(1)
    test_contact_too_fast()
    time.sleep(1)
    test_contact_legitimate()

    print("\n" + "="*60)
    print("Running Newsletter Form Tests")
    print("="*60)
    test_newsletter_honeypot()
    time.sleep(1)
    test_newsletter_too_fast()
    time.sleep(1)
    test_newsletter_legitimate()

    print(f"\n{'#'*60}")
    print(f"# Test Suite Complete")
    print(f"# Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'#'*60}\n")

if __name__ == "__main__":
    main()
