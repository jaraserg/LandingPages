import json
import asyncio
from datetime import datetime
from twisted.web import server, resource
from twisted.internet import reactor, endpoints
from twisted.internet.protocol import Protocol, Factory
from twisted.web.server import Request
import sqlite3
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ICQProtocol(Protocol):
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.ICQProtocol")

    def connectionMade(self):
        self.logger.info(f"Client connected: {self.transport.getPeer()}")

    def dataReceived(self, data):
        self.logger.info(f"Received data: {data.decode('utf-8', errors='ignore')}")

    def connectionLost(self, reason):
        self.logger.info(f"Client disconnected: {reason}")

class ICQServer(resource.Resource):
    isLeaf = True
    
    def __init__(self):
        resource.Resource.__init__(self)
        self.logger = logging.getLogger(f"{__name__}.ICQServer")
        self.sessions = {}
        
    def log_message(self, message):
        """Helper method for logging messages"""
        self.logger.info(message)
        
    def log_error(self, message):
        """Helper method for logging errors"""
        self.logger.error(message)

    def send_json_response(self, request, status_code, data):
        """Send JSON response"""
        request.setResponseCode(status_code)
        request.setHeader(b'content-type', b'application/json')
        return json.dumps(data).encode('utf-8')

    async def process_session_auth(self, request, session_id):
        """Shared authentication logic for both flows"""
        try:
            self.log_message(f"Processing authentication for session_id: {session_id}")
            
            # Validate session_id format (basic validation)
            if not isinstance(session_id, str) or len(session_id) < 10:
                self.log_message(f"Invalid session_id format: {session_id}")
                self.send_json_response(request, 400, {"error": "Invalid session_id format"})
                return
            
            # For now, accept any valid-looking session_id
            # In production, you would validate against a database or external service
            auth_token = f"token_{session_id[:8]}"
            expires_at = (datetime.now().timestamp() + 3600) * 1000  # 1 hour from now in milliseconds
            
            # Store session
            self.sessions[session_id] = {
                'auth_token': auth_token,
                'expires_at': expires_at,
                'created_at': datetime.now().isoformat()
            }
            
            response_data = {
                'session_id': session_id,
                'auth_token': auth_token,
                'expires_at': expires_at
            }
            
            self.log_message(f"Authentication successful for session_id: {session_id}")
            self.send_json_response(request, 200, response_data)
            
        except Exception as e:
            self.log_error(f"Error processing session authentication: {e}")
            self.send_json_response(request, 500, {"error": "Authentication processing failed"})

    async def handle_auth(self, request):
        """Handle authentication request with session_id in JSON body (for REST clients like Postman)"""
        try:
            self.log_message("Authentication request received")
            
            # Get JSON body from request
            content_type = request.getHeader('content-type')
            self.log_message(f"Content-Type: {content_type}")
            
            if content_type and 'application/json' in content_type:
                # Parse JSON body
                try:
                    content_length = int(request.getHeader('content-length') or '0')
                    if content_length > 0:
                        body = request.content.read()
                        json_data = json.loads(body.decode('utf-8'))
                        session_id = json_data.get('session_id')
                        self.log_message(f"JSON session_id: {session_id}")
                    else:
                        self.log_message("Empty request body")
                        self.send_json_response(request, 400, {"error": "Empty request body"})
                        return
                except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as e:
                    self.log_message(f"Invalid JSON in request body: {e}")
                    self.send_json_response(request, 400, {"error": "Invalid JSON in request body"})
                    return
                except Exception as e:
                    self.log_message(f"Error reading request body: {e}")
                    self.send_json_response(request, 500, {"error": "Error reading request body"})
                    return
            else:
                self.log_message(f"Unsupported content type: {content_type}")
                self.send_json_response(request, 400, {"error": "Content-Type must be application/json"})
                return
            
            # Validate session_id
            if not session_id:
                self.log_message("Missing session_id in request body")
                self.send_json_response(request, 400, {"error": "session_id is required in request body"})
                return
            
            # Use shared authentication logic
            await self.process_session_auth(request, session_id)
            
        except Exception as e:
            self.log_error(f"Error in authentication: {e}")
            self.send_json_response(request, 500, {"error": f"Authentication error: {str(e)}"})

    async def handle_auth_db(self, request):
        """Handle authentication request with session_id in query params (for UI redirect)"""
        try:
            self.log_message("Database authentication request received")
            
            # Get session_id from query parameters
            args = request.args
            session_id = args.get(b'session_id', [None])[0]
            
            if session_id:
                session_id = session_id.decode('utf-8')
                self.log_message(f"Query param session_id: {session_id}")
            else:
                self.log_message("Missing session_id in query parameters")
                self.send_json_response(request, 400, {"error": "session_id is required in query parameters"})
                return
            
            # Use shared authentication logic
            await self.process_session_auth(request, session_id)
            
        except Exception as e:
            self.log_error(f"Error in database authentication: {e}")
            self.send_json_response(request, 500, {"error": f"Database authentication error: {str(e)}"})

    def render_GET(self, request):
        """Handle GET requests"""
        try:
            path = request.path.decode('utf-8')
            self.log_message(f"GET request for: {path}")
            
            if path == '/auth/db':
                # Handle the database authentication flow
                asyncio.create_task(self.handle_auth_db(request))
                return server.NOT_DONE_YET
            else:
                self.log_message(f"Unknown GET path: {path}")
                return self.send_json_response(request, 404, {"error": "Not found"})
                
        except Exception as e:
            self.log_error(f"Error in GET handler: {e}")
            return self.send_json_response(request, 500, {"error": "Server error"})

    def render_POST(self, request):
        """Handle POST requests"""
        try:
            path = request.path.decode('utf-8')
            self.log_message(f"POST request for: {path}")
            
            if path == '/auth':
                # Handle the REST authentication flow
                asyncio.create_task(self.handle_auth(request))
                return server.NOT_DONE_YET
            else:
                self.log_message(f"Unknown POST path: {path}")
                return self.send_json_response(request, 404, {"error": "Not found"})
                
        except Exception as e:
            self.log_error(f"Error in POST handler: {e}")
            return self.send_json_response(request, 500, {"error": "Server error"})

class ICQFactory(Factory):
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.ICQFactory")

    def buildProtocol(self, addr):
        return ICQProtocol()

def main():
    # Setup HTTP server
    root = ICQServer()
    site = server.Site(root)
    
    # Setup ICQ protocol server
    icq_factory = ICQFactory()
    
    # Start HTTP server on port 8080
    http_endpoint = endpoints.TCP4ServerEndpoint(reactor, 8080)
    http_endpoint.listen(site)
    
    # Start ICQ server on port 8081
    icq_endpoint = endpoints.TCP4ServerEndpoint(reactor, 8081)
    icq_endpoint.listen(icq_factory)
    
    logger.info("Starting servers...")
    logger.info("HTTP server on port 8080")
    logger.info("ICQ server on port 8081")
    
    reactor.run()

if __name__ == '__main__':
    main()