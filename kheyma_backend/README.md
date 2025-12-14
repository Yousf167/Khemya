# Kheyma — Backend (Full API Reference)

This document explains how to start services and lists the backend HTTP APIs with usage examples.

Base
- Service base (when running locally): http://localhost:8081/api
- Gateway (if using api-gateway): http://localhost:8085 -> forward to /api
- Auth header: `Authorization: Bearer <token>`
- JSON Content-Type: `application/json`

Quick start
- With Docker Compose (from repository root):
  - docker-compose up --build
- With Maven (run each service):
  - cd kheyma_backend/eureka-server && mvn spring-boot:run
  - cd kheyma_backend/api-gateway && mvn spring-boot:run
  - cd kheyma_backend/kheyma-service && mvn spring-boot:run

Authentication (AuthController)
- POST /api/auth/register
  - Purpose: create new user
  - Body (example):
    { "email":"user@example.com", "password":"secret123", "name":"User Name" }
  - Response: 201 Created, body may include user info or message

- POST /api/auth/login
  - Purpose: authenticate, receive JWT
  - Body:
    { "email":"user@example.com", "password":"secret123" }
  - Response: 200 OK
    { "token":"<jwt>", "expiresIn":<seconds>, "user":{...} }

- POST /api/auth/refresh
  - Purpose: refresh JWT (if implemented)
  - Auth: existing token or refresh token
  - Response: new token

- GET /api/auth/me
  - Purpose: get current user profile
  - Auth: Bearer token
  - Response: user DTO

- PUT /api/auth/me
  - Purpose: update own profile
  - Auth: Bearer token
  - Body: fields to update (name, phone, etc.)

Locations (LocationController)
- GET /api/locations/public/all
  - Purpose: list all public locations
  - Query: page, size, sort, filters (if implemented)
  - Auth: none

- GET /api/locations/{id}
  - Purpose: get location details by id
  - Auth: none or optional

- GET /api/locations/search
  - Purpose: search by query, lat/lng, radius, tags, price, rating
  - Query examples: ?q=camp&lat=..&lng=..&radius=10&page=0&size=20

- POST /api/locations
  - Purpose: create a new location (campsite)
  - Auth: ROLE_USER (Bearer token)
  - Body (example):
    { "title":"My Camp", "description":"...", "latitude":12.34, "longitude":56.78, "price":40.0, "tags":["mountain","lake"] }
  - Response: 201 Created with location DTO

- PUT /api/locations/{id}
  - Purpose: update location (owner or admin)
  - Auth: owner or ROLE_ADMIN

- DELETE /api/locations/{id}
  - Purpose: remove location (owner or admin)
  - Auth: owner or ROLE_ADMIN

- POST /api/locations/{id}/images
  - Purpose: upload images for a location (multipart/form-data)
  - Auth: owner or ROLE_ADMIN
  - Note: check file upload size/config in application.yml

Reviews (ReviewController)
- POST /api/reviews
  - Purpose: create a review for a location
  - Auth: ROLE_USER
  - Body:
    { "locationId":"<id>", "rating":5, "comment":"Great spot!" }
  - Response: 201 Created, review DTO

- GET /api/reviews/location/{locationId}
  - Purpose: list reviews for a location
  - Auth: none (usually public)

- GET /api/reviews/user/{userId}
  - Purpose: list reviews by user
  - Auth: user or admin (may be public)

- PUT /api/reviews/{id}
  - Purpose: update own review
  - Auth: review owner

- DELETE /api/reviews/{id}
  - Purpose: delete review
  - Auth: owner or admin

Transactions / Bookings (TransactionController)
- POST /api/transactions
  - Purpose: create a booking/payment/transaction
  - Auth: ROLE_USER
  - Body (example):
    { "locationId":"<id>", "packageType":"BASIC", "amount":100.0, "startDate":"2025-07-01", "endDate":"2025-07-03", "paymentMethod":"CARD" }
  - Response: 201 Created with transaction DTO (id, status, payment info)

- GET /api/transactions/user
  - Purpose: list transactions for current user
  - Auth: ROLE_USER

- GET /api/transactions/{id}
  - Purpose: get transaction details
  - Auth: owner or admin

- PUT /api/transactions/{id}/cancel
  - Purpose: cancel a transaction (if supported)
  - Auth: owner

Admin endpoints (AdminController) — require ROLE_ADMIN
- GET /api/admin/users
  - Purpose: list all users
  - Query: page,size,filter

- GET /api/admin/users/{id}
  - Purpose: get user by id

- PUT /api/admin/users/{id}/role
  - Purpose: change user role (body: { "role":"ROLE_ADMIN" })

- DELETE /api/admin/users/{id}
  - Purpose: delete or deactivate user

- GET /api/admin/stats
  - Purpose: aggregated statistics (users, transactions, revenue) — if implemented

User management (additional endpoints often present)
- POST /api/auth/forgot-password
  - Purpose: start password reset
- POST /api/auth/reset-password
  - Purpose: complete reset with token

Files, media, and static
- Endpoints for uploading / downloading media usually under:
  - POST /api/files/upload or /api/media
  - GET /api/files/{id} or /media/{filename}
- Check storage config in application.yml (local vs cloud)

Error responses & common codes
- 200 OK — successful GET/PUT
- 201 Created — creation
- 204 No Content — successful delete
- 400 Bad Request — validation errors
- 401 Unauthorized — missing/invalid token
- 403 Forbidden — insufficient role/ownership
- 404 Not Found — resource not found
- 500 Server Error — check logs

Headers & security
- Authorization: Bearer <jwt>
- Content-Type: application/json for JSON bodies
- For file uploads: Content-Type: multipart/form-data
- JWT secret and expiry: configured in kheyma-service/src/main/resources/application.yml

Example curl flows
- Register
  curl -X POST http://localhost:8081/api/auth/register -H "Content-Type: application/json" -d '{"email":"u@ex.com","password":"pass","name":"U"}'

- Login -> extract token (jq required)
  TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login -H "Content-Type: application/json" -d '{"email":"u@ex.com","password":"pass"}' | jq -r .token)

- Create location (authenticated)
  curl -X POST http://localhost:8081/api/locations -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"Camp","latitude":1,"longitude":2,"price":20}'

- Create review
  curl -X POST http://localhost:8081/api/reviews -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"locationId":"<id>","rating":5,"comment":"Nice"}'

- Create transaction
  curl -X POST http://localhost:8081/api/transactions -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"locationId":"<id>","amount":100,"packageType":"BASIC"}'

Where to verify actual routes
- Inspect controller classes:
  - kheyma-backend/kheyma-service/src/main/java/com/kheyma/controller/*.java
  - DTOs in kheyma-service/src/main/java/com/kheyma/dto/
  - Security and roles: kheyma-service/src/main/java/com/kheyma/config/SecurityConfig.java

Notes
- This README enumerates typical endpoints implemented by the controllers in the project. Confirm request/response fields by opening the DTO classes and controller methods listed above.
- If an endpoint is missing or uses different paths/parameters, adjust requests accordingly.