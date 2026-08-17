# API Documentation
## Community Program & Volunteer Impact Tracking System
### Version: 1.0.0 | Base URL: `/api/v1`

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer <supabase_access_token>
```

---

## Response Format (contract Section 12-13)

**Success (single object):**
```json
{ "success": true, "data": {} }
```

**Success (list):**
```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

**Error:**
```json
{ "success": false, "message": "...", "code": "ERROR_CODE" }
```

---

## Auth Endpoints

### POST /api/v1/auth/login
**Auth:** Public

**Request:**
```json
{ "email": "admin@ngo.org", "password": "Admin@12345" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresAt": 1234567890,
    "user": { "id": "uuid", "email": "admin@ngo.org", "name": "NGO Administrator", "role": "ADMIN" }
  }
}
```

### POST /api/v1/auth/logout
**Auth:** Bearer token

### GET /api/v1/auth/me
**Auth:** Bearer token

---

## Program Endpoints

### GET /api/v1/programs
**Auth:** Bearer token
**Query:** `?page=1&limit=20&search=stem&status=ACTIVE&location=Pune`

### POST /api/v1/programs
**Auth:** ADMIN or STAFF

**Request:**
```json
{
  "name": "Community STEM Workshop",
  "category": "Education",
  "location": "Pune",
  "address": "Model Colony, Pune",
  "startDate": "2026-09-01T09:00:00Z",
  "endDate": "2026-09-01T17:00:00Z",
  "maxParticipants": 50,
  "maxVolunteers": 10,
  "description": "..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "programCode": "EDU-PUN-2026-01",
    "name": "Community STEM Workshop",
    "status": "DRAFT",
    ...
  }
}
```

### PATCH /api/v1/programs/:id
**Auth:** ADMIN, STAFF, or COORDINATOR

### PATCH /api/v1/programs/:id/status
**Auth:** ADMIN or STAFF

**Request:** `{ "status": "ACTIVE" }`

### DELETE /api/v1/programs/:id
**Auth:** ADMIN only

---

## Registration Endpoints (Public)

### POST /api/v1/programs/:programId/register/participant
**Auth:** None (public) — use-case J, K

**Request:**
```json
{
  "name": "Priya Patel",
  "email": "priya@example.com",
  "phone": "9876543210",
  "location": "Pune",
  "college": "VIT University",
  "ageOrYear": "2nd Year",
  "areaOfInterest": "Technology"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trackingId": "CPR-PAR-A3B2C1D4",
    "registrationId": "uuid",
    "participant": { "id": "uuid", "name": "Priya Patel", "trackingId": "CPR-PAR-A3B2C1D4" },
    "program": { "id": "uuid", "name": "Community STEM Workshop", "programCode": "EDU-PUN-2026-01" },
    "status": "REGISTERED",
    "registeredAt": "2026-08-17T10:00:00Z"
  }
}
```

### POST /api/v1/programs/:programId/register/volunteer
**Auth:** None (public) — same fields as participant

---

## Participant & Volunteer Endpoints

### GET /api/v1/participants
**Auth:** Bearer token
**Query:** `?page=1&limit=20&search=priya&programId=uuid&status=COMPLETED`

### GET /api/v1/participants/:id
**Auth:** Bearer token

### GET /api/v1/participants/track/:trackingId
**Auth:** None (public) — use-case L — returns ONLY that person's data

### GET /api/v1/volunteers
### GET /api/v1/volunteers/:id
### GET /api/v1/volunteers/track/:trackingId

---

## Registration Management Endpoints

### GET /api/v1/registrations/:id
**Auth:** Bearer token

### PATCH /api/v1/registrations/:id
**Auth:** Bearer token — updates participation funnel (use-case D)

**Request:**
```json
{
  "status": "ATTENDED",
  "volunteerStatus": "ACTIVE",
  "hoursContributed": 4,
  "notes": "Attended morning session"
}
```

### GET /api/v1/programs/:programId/registrations
**Auth:** Bearer token
**Query:** `?page=1&limit=20&status=ATTENDED&type=PARTICIPANT&search=priya`

---

## Analytics Endpoints

### GET /api/v1/analytics/dashboard
**Auth:** ADMIN, STAFF, or COORDINATOR — use-case F

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPrograms": 5,
    "activePrograms": 1,
    "totalParticipants": 20,
    "totalVolunteers": 10,
    "totalRegistrations": 30,
    "attendanceRate": 75,
    "completionRate": 25,
    "volunteerHoursContributed": 64,
    "registrationFunnel": {
      "registered": 10,
      "attended": 8,
      "participated": 7,
      "completed": 5
    }
  }
}
```

### GET /api/v1/analytics/programs
**Auth:** ADMIN, STAFF, or COORDINATOR — program-wise breakdown

### GET /api/v1/analytics/location
**Auth:** ADMIN, STAFF, or COORDINATOR — location-wise impact

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `UNAUTHORIZED` | 401 | No token or wrong credentials |
| `INVALID_TOKEN` | 401 | Token expired or invalid |
| `FORBIDDEN` | 403 | Insufficient role |
| `NOT_FOUND` | 404 | Generic not found |
| `PROGRAM_NOT_FOUND` | 404 | Program doesn't exist |
| `PARTICIPANT_NOT_FOUND` | 404 | Participant/tracking ID not found |
| `VOLUNTEER_NOT_FOUND` | 404 | Volunteer/tracking ID not found |
| `REGISTRATION_NOT_FOUND` | 404 | Registration doesn't exist |
| `ALREADY_REGISTERED` | 409 | Duplicate registration for program |
| `PROGRAM_NOT_ACTIVE` | 400 | Program not accepting registrations |
| `EMAIL_ALREADY_EXISTS` | 409 | Email already in use |
| `SERVER_ERROR` | 500 | Internal server error |
