# Client — Run & Postman

Quick commands to run the client locally (PowerShell):

```powershell
# go to client folder
Set-Location -Path "c:\Users\Abdul\OneDrive\Desktop\Project2-Ecom\client"

# install dependencies
npm install

# optional: create .env for Vite to point to your backend
@'
VITE_BACKEND_URL="http://localhost:4000"
VITE_CURRENCY="USD"
'@ | Out-File -FilePath .\.env -Encoding UTF8

# start dev server
npm run dev
```

Open the app at http://localhost:5173 (Vite default).

Import the Postman collection at `.postman/Project2-Ecom.postman_collection.json` into Postman.

Postman usage:
- Send `Login` (POST `/api/user/login`) with JSON body { email, password }.
- The collection test stores the returned `token` into a Postman environment variable named `token`.
- Send `GET /api/user/is-auth` which uses `Authorization: Bearer {{token}}`.

Notes:
- The server also sets an httpOnly cookie named `token`. Postman stores cookies in its cookie jar. If the cookie is present you can use cookie auth or the Authorization header (the collection uses the header).
- If you change `.env`, restart the dev server.
