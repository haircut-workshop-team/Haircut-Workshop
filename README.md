# Barber Shop Booking System 💈

A full-stack barber shop booking and management platform.

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: PostgreSQL

## Getting Started

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd server && npm install
```

### Run Development Servers

```bash
npm run dev
```

### Execute the Schema (Create All Tables)

```bash
cd server
### Now run this command in UBUNTU:
psql -d haircut_workshop -f database/schema.sql
```

### Another way of creating tables

```bash
### In VS CODE Terminal:
cd server/database
node runSchema.js

### You Should see:
✅ All tables created successfully!
```

---

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Team Members

- Saif
- Hamam
- Naser
