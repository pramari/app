import requests
import webbrowser
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
from threading import Thread
import time

# OAuth configuration
CLIENT_ID="IU5PtJJ4AD0oPuWU3P81ANudH4EZHbGPcEEcJ73J"
CLIENT_SECRET="rEQlVpy3SK6YZODAQZAFvgLvfa0mC2nGnTToBV4lBlNNfIWzQQ8OBcMLsdDvc6c7Cy69WZooHibq9ZxfZ2lqznCufvuTCvCioFoLNXhJIItNANmQtWiofSeX2EerYhn9"
REDIRECT_URI = "http://localhost:8000/callback"
AUTH_URL = "https://pramari.de/o/authorize/"
TOKEN_URL = "https://pramari.de/o/token/"
USERINFO_URL = "https://pramari.de/o/userinfo/"

# Store auth code from callback
auth_code = None

class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code

        # Parse the query parameters
        query = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(query)

        # Get the authorization code
        if 'code' in params:
            auth_code = params['code'][0]

            # Send success response to browser
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<html><body><h1>Authentication successful!</h1><p>You can close this window now.</p></body></html>")
        else:
            # Send error response
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<html><body><h1>Authentication failed!</h1><p>No authorization code received.</p></body></html>")

def start_server():
    server = HTTPServer(('localhost', 8000), CallbackHandler)
    server.handle_request()  # Handle only one request and then stop

def get_user_info():
    # Start local server to receive callback
    server_thread = Thread(target=start_server)
    server_thread.start()

    # Construct authorization URL with proper parameters
    auth_params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URI,
        'scope': 'openid email userinfo',  # Adjust scopes as needed
        'state': '1234'  # Use a random state for security
    }

    auth_request_url = f"{AUTH_URL}?{urllib.parse.urlencode(auth_params)}"

    # Open browser for user to authenticate
    print("Opening browser for authentication...")
    webbrowser.open(auth_request_url)

    # Wait for callback to receive auth code
    server_thread.join()

    if not auth_code:
        print("Authentication failed - no code received")
        return None

    print("Authentication code received, exchanging for token...")

    # Exchange auth code for token
    token_data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': auth_code,
        'redirect_uri': REDIRECT_URI
    }

    token_response = requests.post(TOKEN_URL, data=token_data)

    if token_response.status_code != 200:
        print(f"Token request failed: {token_response.status_code}")
        print(token_response.text)
        return None

    token_info = token_response.json()
    access_token = token_info.get('access_token')

    if not access_token:
        print("No access token received")
        return None

    print("Access token received, fetching user info...")

    # Use token to get user info
    headers = {
        'Authorization': f"Bearer {access_token}"
    }

    userinfo_response = requests.get(USERINFO_URL, headers=headers)

    if userinfo_response.status_code != 200:
        print(f"User info request failed: {userinfo_response.status_code}")
        print(userinfo_response.text)
        return None

    # Return user details
    return userinfo_response.json()

if __name__ == "__main__":
    # Run the program
    user_info = get_user_info()

    if user_info:
        print("\nUser Information:")
        print(json.dumps(user_info, indent=2))

        # Print specific fields example
        print("\nKey User Details:")
        print(f"ID: {user_info.get('sub', 'N/A')}")
        print(f"Name: {user_info.get('name', 'N/A')}")
        print(f"Email: {user_info.get('email', 'N/A')}")
        print(f"Role: {user_info.get('role', 'N/A')}")
    else:
        print("Failed to retrieve user information")
