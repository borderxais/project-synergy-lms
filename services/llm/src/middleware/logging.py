import json
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger('main')



class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log request details
        logger.info(f"[MIDDLEWARE] Received request: {request.method} {request.url.path}")
        logger.info(f"[MIDDLEWARE] Full URL: {request.url}")
        logger.info(f"[MIDDLEWARE] Headers: {dict(request.headers)}")
        
        # Log available routes
        routes = []
        for route in request.app.routes:
            routes.append({
                "path": route.path,
                "name": route.name,
                "methods": list(route.methods) if route.methods else []
            })
        logger.info(f"[MIDDLEWARE] Available routes: {json.dumps(routes, indent=2)}")
        
        try:
            body = await request.body()
            if body:
                try:
                    # Try to parse and pretty print JSON
                    json_body = json.loads(body)
                    logger.info(f"[MIDDLEWARE] Request body: {json.dumps(json_body, indent=2)}")
                except json.JSONDecodeError:
                    logger.info(f"[MIDDLEWARE] Request body (raw): {body.decode()}")
            else:
                logger.info("[MIDDLEWARE] Request body: None")
        except Exception as e:
            logger.error(f"[MIDDLEWARE] Error reading body: {str(e)}")
        
        # Log if route is not found
        if request.url.path not in [route.path for route in request.app.routes]:
            logger.warning(f"[DEBUG] Unhandled request to path: {request.url.path}")
            logger.warning(f"[DEBUG] Full URL: {request.url}")
            logger.warning(f"[DEBUG] Method: {request.method}")
            logger.warning(f"[DEBUG] Headers: {dict(request.headers)}")
            if body:
                try:
                    json_body = json.loads(body)
                    logger.warning(f"[DEBUG] Body: {json.dumps(json_body, indent=2)}")
                except:
                    logger.warning(f"[DEBUG] Body (raw): {body.decode()}")
        
        response = await call_next(request)
        logger.info(f"[MIDDLEWARE] Response status: {response.status_code}")
        if response.status_code >= 400:
            logger.error(f"[MIDDLEWARE] Error response: {response.status_code}")
            try:
                response_body = [chunk async for chunk in response.body_iterator]
                logger.error(f"[MIDDLEWARE] Response body: {response_body}")
            except:
                logger.error("[MIDDLEWARE] Could not read response body")
        
        return response