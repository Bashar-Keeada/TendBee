#!/usr/bin/env python3
"""
Backend API Testing for Tendbee Job Platform
Testing Stripe Payment and Profile Image Upload features
"""

import requests
import json
import os
import tempfile
from pathlib import Path
import uuid
import time

# Get backend URL from environment
BACKEND_URL = "https://career-match-107.preview.emergentagent.com/api"

class TendbeeBackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test basic API health"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                self.log_test("Health Check", True, "API is responding")
                return True
            else:
                self.log_test("Health Check", False, f"API returned {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Connection failed: {str(e)}")
            return False
    
    def test_payment_packages(self):
        """Test GET /api/payments/packages"""
        try:
            response = self.session.get(f"{self.base_url}/payments/packages", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Payment Packages", False, f"HTTP {response.status_code}", 
                            {"response": response.text})
                return False
            
            data = response.json()
            
            # Verify structure
            if "packages" not in data:
                self.log_test("Payment Packages", False, "Missing 'packages' field")
                return False
            
            packages = data["packages"]
            if not isinstance(packages, list) or len(packages) == 0:
                self.log_test("Payment Packages", False, "No packages found")
                return False
            
            # Check for monthly and yearly packages
            package_ids = [pkg.get("id") for pkg in packages]
            required_packages = ["monthly", "yearly"]
            
            missing_packages = [pkg for pkg in required_packages if pkg not in package_ids]
            if missing_packages:
                self.log_test("Payment Packages", False, f"Missing packages: {missing_packages}")
                return False
            
            # Verify monthly package details
            monthly_pkg = next((pkg for pkg in packages if pkg.get("id") == "monthly"), None)
            if not monthly_pkg:
                self.log_test("Payment Packages", False, "Monthly package not found")
                return False
            
            if monthly_pkg.get("amount") != 49.0:
                self.log_test("Payment Packages", False, f"Monthly package wrong price: {monthly_pkg.get('amount')}")
                return False
            
            # Verify yearly package details
            yearly_pkg = next((pkg for pkg in packages if pkg.get("id") == "yearly"), None)
            if not yearly_pkg:
                self.log_test("Payment Packages", False, "Yearly package not found")
                return False
            
            if yearly_pkg.get("amount") != 490.0:
                self.log_test("Payment Packages", False, f"Yearly package wrong price: {yearly_pkg.get('amount')}")
                return False
            
            self.log_test("Payment Packages", True, "All packages correctly configured", 
                        {"packages": packages})
            return True
            
        except Exception as e:
            self.log_test("Payment Packages", False, f"Exception: {str(e)}")
            return False
    
    def test_create_checkout_session(self):
        """Test POST /api/payments/checkout"""
        try:
            # Test monthly package
            payload = {
                "package_id": "monthly",
                "origin_url": "https://example.com",
                "user_id": f"test-user-{uuid.uuid4().hex[:8]}"
            }
            
            response = self.session.post(
                f"{self.base_url}/payments/checkout",
                json=payload,
                timeout=15
            )
            
            if response.status_code != 200:
                self.log_test("Create Checkout Session", False, f"HTTP {response.status_code}", 
                            {"response": response.text, "payload": payload})
                return False
            
            data = response.json()
            
            # Verify response structure
            required_fields = ["url", "session_id"]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                self.log_test("Create Checkout Session", False, f"Missing fields: {missing_fields}")
                return False
            
            # Verify URL contains stripe.com
            checkout_url = data.get("url", "")
            if "stripe.com" not in checkout_url:
                self.log_test("Create Checkout Session", False, "Checkout URL doesn't contain stripe.com")
                return False
            
            # Store session_id for status test
            self.test_session_id = data.get("session_id")
            
            self.log_test("Create Checkout Session", True, "Checkout session created successfully", 
                        {"session_id": self.test_session_id, "url": checkout_url})
            return True
            
        except Exception as e:
            self.log_test("Create Checkout Session", False, f"Exception: {str(e)}")
            return False
    
    def test_payment_status(self):
        """Test GET /api/payments/status/{session_id}"""
        if not hasattr(self, 'test_session_id'):
            self.log_test("Payment Status", False, "No session_id from previous test")
            return False
        
        try:
            response = self.session.get(
                f"{self.base_url}/payments/status/{self.test_session_id}",
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Payment Status", False, f"HTTP {response.status_code}", 
                            {"response": response.text})
                return False
            
            data = response.json()
            
            # Verify response structure
            required_fields = ["status", "payment_status"]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                self.log_test("Payment Status", False, f"Missing fields: {missing_fields}")
                return False
            
            self.log_test("Payment Status", True, "Payment status retrieved successfully", 
                        {"status": data.get("status"), "payment_status": data.get("payment_status")})
            return True
            
        except Exception as e:
            self.log_test("Payment Status", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_package_checkout(self):
        """Test checkout with invalid package"""
        try:
            payload = {
                "package_id": "invalid_package",
                "origin_url": "https://example.com",
                "user_id": "test-user-123"
            }
            
            response = self.session.post(
                f"{self.base_url}/payments/checkout",
                json=payload,
                timeout=10
            )
            
            # Should return 400 for invalid package
            if response.status_code == 400:
                self.log_test("Invalid Package Checkout", True, "Correctly rejected invalid package")
                return True
            else:
                self.log_test("Invalid Package Checkout", False, f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Invalid Package Checkout", False, f"Exception: {str(e)}")
            return False
    
    def create_test_image(self):
        """Create a test image file"""
        # Create a simple test image (1x1 pixel PNG)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\x12IDATx\x9cc```bPPP\x00\x02\xac\xac\xac\x00\x05\x1e\x0e\x1e\x5c\xdd\x1b\x00\x00\x00\x00IEND\xaeB`\x82'
        
        temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        temp_file.write(png_data)
        temp_file.close()
        
        return temp_file.name
    
    def test_profile_image_upload(self):
        """Test POST /api/upload/profile-image"""
        try:
            # Create test image
            test_image_path = self.create_test_image()
            test_user_id = f"test-user-{uuid.uuid4().hex[:8]}"
            
            try:
                with open(test_image_path, 'rb') as f:
                    files = {'file': ('test_image.png', f, 'image/png')}
                    data = {'user_id': test_user_id}
                    
                    response = self.session.post(
                        f"{self.base_url}/upload/profile-image",
                        files=files,
                        data=data,
                        timeout=15
                    )
                
                if response.status_code != 200:
                    self.log_test("Profile Image Upload", False, f"HTTP {response.status_code}", 
                                {"response": response.text})
                    return False
                
                data = response.json()
                
                # Verify response structure
                required_fields = ["url", "filename", "size", "content_type"]
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_test("Profile Image Upload", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Store for later tests
                self.test_image_url = data.get("url")
                self.test_image_filename = data.get("filename")
                self.test_user_id = test_user_id
                
                self.log_test("Profile Image Upload", True, "Image uploaded successfully", 
                            {"url": self.test_image_url, "filename": self.test_image_filename})
                return True
                
            finally:
                # Clean up temp file
                os.unlink(test_image_path)
                
        except Exception as e:
            self.log_test("Profile Image Upload", False, f"Exception: {str(e)}")
            return False
    
    def test_serve_uploaded_file(self):
        """Test GET /api/uploads/{filename}"""
        if not hasattr(self, 'test_image_filename'):
            self.log_test("Serve Uploaded File", False, "No filename from previous test")
            return False
        
        try:
            response = self.session.get(
                f"{self.base_url}/uploads/{self.test_image_filename}",
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Serve Uploaded File", False, f"HTTP {response.status_code}", 
                            {"response": response.text})
                return False
            
            # Check content type
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                self.log_test("Serve Uploaded File", False, f"Wrong content type: {content_type}")
                return False
            
            # Check content length
            if len(response.content) == 0:
                self.log_test("Serve Uploaded File", False, "Empty file content")
                return False
            
            self.log_test("Serve Uploaded File", True, "File served successfully", 
                        {"content_type": content_type, "size": len(response.content)})
            return True
            
        except Exception as e:
            self.log_test("Serve Uploaded File", False, f"Exception: {str(e)}")
            return False
    
    def create_test_user(self):
        """Create a test user for image deletion test"""
        try:
            user_data = {
                "email": f"test-{uuid.uuid4().hex[:8]}@tendbee.se",
                "password": "testpassword123",
                "first_name": "Test",
                "last_name": "User",
                "user_type": "jobseeker"
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=user_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("user"):
                    return data["user"]["id"]
            
            return None
            
        except Exception as e:
            return None
    
    def test_delete_profile_image(self):
        """Test DELETE /api/upload/profile-image/{user_id}"""
        # First create a real user
        real_user_id = self.create_test_user()
        if not real_user_id:
            self.log_test("Delete Profile Image", False, "Could not create test user")
            return False
        
        try:
            response = self.session.delete(
                f"{self.base_url}/upload/profile-image/{real_user_id}",
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Delete Profile Image", False, f"HTTP {response.status_code}", 
                            {"response": response.text})
                return False
            
            data = response.json()
            
            # Verify success message
            if "message" not in data:
                self.log_test("Delete Profile Image", False, "Missing success message")
                return False
            
            self.log_test("Delete Profile Image", True, "Image deleted successfully", 
                        {"message": data.get("message")})
            return True
            
        except Exception as e:
            self.log_test("Delete Profile Image", False, f"Exception: {str(e)}")
            return False
    
    def test_upload_invalid_file_type(self):
        """Test upload with invalid file type"""
        try:
            # Create a text file instead of image
            temp_file = tempfile.NamedTemporaryFile(suffix='.txt', delete=False)
            temp_file.write(b'This is not an image')
            temp_file.close()
            
            try:
                with open(temp_file.name, 'rb') as f:
                    files = {'file': ('test.txt', f, 'text/plain')}
                    
                    response = self.session.post(
                        f"{self.base_url}/upload/profile-image",
                        files=files,
                        timeout=10
                    )
                
                # Should return 400 for invalid file type
                if response.status_code == 400:
                    self.log_test("Invalid File Type Upload", True, "Correctly rejected invalid file type")
                    return True
                else:
                    self.log_test("Invalid File Type Upload", False, f"Expected 400, got {response.status_code}")
                    return False
                    
            finally:
                os.unlink(temp_file.name)
                
        except Exception as e:
            self.log_test("Invalid File Type Upload", False, f"Exception: {str(e)}")
            return False
    
    def test_nonexistent_file_access(self):
        """Test accessing non-existent uploaded file"""
        try:
            fake_filename = f"nonexistent-{uuid.uuid4().hex}.png"
            response = self.session.get(
                f"{self.base_url}/uploads/{fake_filename}",
                timeout=10
            )
            
            # Should return 404 for non-existent file
            if response.status_code == 404:
                self.log_test("Non-existent File Access", True, "Correctly returned 404 for missing file")
                return True
            else:
                self.log_test("Non-existent File Access", False, f"Expected 404, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Non-existent File Access", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🧪 Starting Tendbee Backend API Tests")
        print(f"🔗 Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Health check first
        if not self.test_health_check():
            print("❌ Health check failed - aborting tests")
            return False
        
        print("\n📦 Testing Stripe Payment Integration...")
        self.test_payment_packages()
        self.test_create_checkout_session()
        self.test_payment_status()
        self.test_invalid_package_checkout()
        
        print("\n🖼️  Testing Profile Image Upload...")
        self.test_profile_image_upload()
        self.test_serve_uploaded_file()
        self.test_delete_profile_image()
        self.test_upload_invalid_file_type()
        self.test_nonexistent_file_access()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Show failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['message']}")
        
        return passed == total

if __name__ == "__main__":
    tester = TendbeeBackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        exit(0)
    else:
        print("\n💥 Some tests failed!")
        exit(1)