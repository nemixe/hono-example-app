# API Curl Commands

## Authentication Endpoints

### 1. User Registration
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## Equipment (Alat) Endpoints

### 3. Get All Equipment (Public)
```bash
curl http://localhost:8000/api/alat
```

### 4. Get Equipment by ID (Public)
```bash
curl http://localhost:8000/api/alat/1
```

### 5. Create Equipment (Requires Auth)
```bash
# First, get token from login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}' \
  | jq -r '.data.token')

# Then create equipment
curl -X POST http://localhost:8000/api/alat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "alat_kategori_id": 1,
    "alat_nama": "iPhone 15 Pro Max",
    "alat_deskripsi": "Latest iPhone with better camera",
    "alat_harga_sewa_perhari": 75000,
    "alat_stok": 3
  }'
```

### 6. Update Equipment (Requires Auth)
```bash
curl -X PATCH http://localhost:8000/api/alat/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "alat_nama": "iPhone 15 Pro Updated",
    "alat_harga_sewa_perhari": 60000,
    "alat_stok": 10
  }'
```

### 7. Delete Equipment (Requires Auth)
```bash
curl -X DELETE http://localhost:8000/api/alat/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Other Endpoints

### 8. Root Endpoint
```bash
curl http://localhost:8000/
```

## Example Responses

### Successful Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "errors": null
}
```

### Error Response
```json
{
  "success": false,
  "message": "Operation failed",
  "data": null,
  "errors": "Error details or validation errors"
}
```

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "alat_nama": "Required",
    "alat_harga_sewa_perhari": "Must be a positive number"
  }
}
```

## Testing with jq for Pretty Output

Add `| jq` to any command for formatted JSON:
```bash
curl http://localhost:8000/api/alat | jq
```

## Equipment Categories

The system has 3 predefined categories:
- ID 1: Smartphone
- ID 2: Laptop
- ID 3: Camera