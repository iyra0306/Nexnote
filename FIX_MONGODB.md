# Fix MongoDB Connection

The error `querySrv ECONNREFUSED _mongodb._tcp.cluster0.z9v4qbz.mongodb.net` means the app cannot reach MongoDB Atlas (DNS or network).

---

## Option A: Use MongoDB Atlas (keep cloud DB)

### 1. Allow access from anywhere (for development)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → your project → **Network Access**.
2. Click **Add IP Address**.
3. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`).
4. Save. Wait 1–2 minutes.

### 2. Check your connection string

1. In Atlas: **Database** → **Connect** → **Connect your application**.
2. Copy the connection string.
3. Replace `<password>` with your real DB user password (special chars URL-encoded, e.g. `@` → `%40`).
4. Put it in `server/.env` as `MONGODB_URI=...`.

### 3. If it still fails (DNS/network)

- Try another network (e.g. mobile hotspot) or VPN.
- On Windows, try: `ipconfig /flushdns` then restart the server.
- Or use **Option B** (local MongoDB) below.

---

## Option B: Use local MongoDB (no Atlas needed)

### 1. Install MongoDB locally

- **Windows:** [MongoDB Community Server](https://www.mongodb.com/try/download/community) — install and start the service.
- **Mac:** `brew install mongodb-community` then `brew services start mongodb-community`.
- **Or use Docker:** `docker run -d -p 27017:27017 --name mongo mongo:latest`

### 2. Point the app to local MongoDB

Edit `server/.env` and set:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/nexnote
```

Keep other lines (PORT, JWT_SECRET, CLIENT_URL) as they are.

### 3. Restart the server

```bash
cd server
npm start
```

You should see: `✅ MongoDB Connected: 127.0.0.1` (or similar).

---

## After fixing

- Restart the Node server (`npm start` in `server/`).
- Try **Sign up** and **Login** in the app at http://localhost:5000/login.

If you use **Option B**, you can copy the exact `MONGODB_URI` from `server/.env.example`.
