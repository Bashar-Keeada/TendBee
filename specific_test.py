#!/usr/bin/env python3
"""
Specific API Tests for Review Request Requirements
"""

import requests
import json
import tempfile
import os

BACKEND_URL = "https://career-match-107.preview.emergentagent.com/api"

def test_specific_requirements():
    """Test the specific requirements from the review request"""
    session = requests.Session()
    
    print("🔍 Testing Specific Review Requirements")
    print("=" * 50)
    
    # 1. Test GET /api/payments/packages
    print("1. Testing GET /api/payments/packages")
    response = session.get(f"{BACKEND_URL}/payments/packages")
    if response.status_code == 200:
        data = response.json()
        packages = data.get("packages", [])
        
        monthly = next((p for p in packages if p.get("id") == "monthly"), None)
        yearly = next((p for p in packages if p.get("id") == "yearly"), None)
        
        if monthly and monthly.get("amount") == 49.0:
            print("   ✅ Monthly package: 49 SEK")
        else:
            print("   ❌ Monthly package incorrect")
            
        if yearly and yearly.get("amount") == 490.0:
            print("   ✅ Yearly package: 490 SEK")
        else:
            print("   ❌ Yearly package incorrect")
    else:
        print(f"   ❌ Failed: HTTP {response.status_code}")
    
    # 2. Test POST /api/payments/checkout
    print("\n2. Testing POST /api/payments/checkout")
    checkout_data = {
        "package_id": "monthly",
        "origin_url": "https://example.com",
        "user_id": "test-user-123"
    }
    response = session.post(f"{BACKEND_URL}/payments/checkout", json=checkout_data)
    if response.status_code == 200:
        data = response.json()
        if "url" in data and "session_id" in data:
            print("   ✅ Returns checkout URL and session_id")
            if "stripe.com" in data.get("url", ""):
                print("   ✅ URL contains stripe.com")
            else:
                print("   ❌ URL doesn't contain stripe.com")
        else:
            print("   ❌ Missing required fields")
    else:
        print(f"   ❌ Failed: HTTP {response.status_code}")
    
    # 3. Test POST /api/upload/profile-image
    print("\n3. Testing POST /api/upload/profile-image")
    
    # Create test image
    png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\x12IDATx\x9cc```bPPP\x00\x02\xac\xac\xac\x00\x05\x1e\x0e\x1e\x5c\xdd\x1b\x00\x00\x00\x00IEND\xaeB`\x82'
    
    temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    temp_file.write(png_data)
    temp_file.close()
    
    try:
        with open(temp_file.name, 'rb') as f:
            files = {'file': ('test.png', f, 'image/png')}
            data = {'user_id': 'optional-user-123'}
            
            response = session.post(f"{BACKEND_URL}/upload/profile-image", files=files, data=data)
            
        if response.status_code == 200:
            data = response.json()
            required_fields = ["url", "filename", "size", "content_type"]
            if all(field in data for field in required_fields):
                print("   ✅ Returns url, filename, size, content_type")
                
                # Test serving the file
                filename = data.get("filename")
                if filename:
                    serve_response = session.get(f"{BACKEND_URL}/uploads/{filename}")
                    if serve_response.status_code == 200:
                        print("   ✅ File can be served via GET /api/uploads/{filename}")
                    else:
                        print("   ❌ File serving failed")
            else:
                print("   ❌ Missing required response fields")
        else:
            print(f"   ❌ Failed: HTTP {response.status_code}")
    finally:
        os.unlink(temp_file.name)
    
    print("\n✅ All specific requirements tested!")

if __name__ == "__main__":
    test_specific_requirements()