# 💈 StyleSync - Modern Barber Shop Booking System

A modern, full-stack barber shop booking and management platform built with React, Node.js, and PostgreSQL. This system provides a complete solution for managing barber appointments, services, and customer interactions.

## ✨ Features

### For Customers

- 🔐 User authentication (register, login, password reset)
- 📅 Browse and book appointments with preferred barbers
- 🕒 View available time slots in real-time
- 📋 Manage booking history (upcoming & past appointments)
- ⭐ Leave reviews and ratings for services
- 👤 Profile management with avatar upload

### For Barbers

- 📊 Personal dashboard with appointment statistics
- 📅 Manage daily schedule and availability
- ✅ Update appointment statuses (pending, confirmed, completed, cancelled)
- 📈 View performance metrics and customer feedback

### For Administrators

- 🎯 Comprehensive admin dashboard with system statistics
- 👥 Manage barber accounts (add, edit, delete)
- ✂️ Manage services (add, edit, delete, pricing)

## 🛠️ Tech Stack

### Frontend

- **React 19.1.1** - UI library
- **Vite 6.3.1** - Build tool and dev server
- **React Router DOM 7.1.1** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with animations

### Backend

- **Node.js** - Runtime environment
- **Express.js 4.21.2** - Web framework
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## 📁 Project Structure

```
Haircut-Workshop/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components (routes)
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Helper functions and utilities
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files (database)
│   ├── controllers/      # Request handlers
│   ├── database/         # Database schema and scripts
│   ├── middleware/       # Express middleware (auth, upload)
│   ├── models/           # Database models
│   ├── routes/           # API route definitions
│   ├── uploads/          # User uploaded files
│   ├── package.json
│   └── server.js         # Entry point
│
├── package.json          # Root package for concurrently
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/haircut-workshop-team/Haircut-Workshop.git
   cd Haircut-Workshop
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Database Setup

1. **Create PostgreSQL database**

   ```bash
   psql -U postgres
   CREATE DATABASE haircut_workshop;
   \q
   ```

2. **Configure database connection**

   Create a `.env` file in the `server` directory:

   ```env
   DB_USER=your_postgres_username
   DB_HOST=localhost
   DB_DATABASE=haircut_workshop
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

3. **Run database schema**

   **Option 1: Using psql**

   ```bash
   cd server
   psql -d haircut_workshop -f database/schema.sql
   ```

   **Option 2: Using Node.js script**

   ```bash
   cd server/database
   node runSchema.js
   ```

   You should see: ✅ All tables created successfully!

### Running the Application

**Development Mode (Both servers concurrently)**

```bash
npm run dev
```

**Or run separately:**

**Frontend only:**

```bash
npm run client
```

**Backend only:**

```bash
npm run server
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🔑 Default Admin Account

After running the schema, you can create an admin account or use the registration system. The first user with role 'admin' will have full administrative access.

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload profile picture

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Appointments

- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/available-slots` - Get available time slots
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Barbers

- `GET /api/barbers` - Get all barbers
- `GET /api/barbers/:id` - Get barber by ID
- `GET /api/barbers/:id/schedule` - Get barber schedule
- `PUT /api/barbers/:id/schedule` - Update barber schedule

### Admin

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/barbers` - Get all barbers (Admin)
- `POST /api/admin/barbers` - Create barber (Admin)
- `PUT /api/admin/barbers/:id` - Update barber (Admin)
- `DELETE /api/admin/barbers/:id` - Delete barber (Admin)

### Reviews

- `GET /api/reviews/:appointmentId` - Get appointment reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🗄️ Database Schema

### Main Tables

- **users** - User accounts (customers, barbers, admins)
- **services** - Available barber services
- **barbers** - Barber profiles and information
- **appointments** - Booking records
- **schedules** - Barber availability schedules
- **reviews** - Customer reviews and ratings

## 🎨 Key Features Implementation

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (customer, barber, admin)
- Protected routes on both frontend and backend
- Password encryption with bcrypt

### Real-time Availability

- Dynamic time slot calculation
- Barber schedule management
- Appointment conflict prevention

### File Upload

- Profile picture upload with Multer
- Image storage in server/uploads directory
- Secure file handling

### Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Modern CSS animations and transitions

## 🧪 Testing

The application includes comprehensive error handling and validation:

- Input validation on forms
- API error handling with meaningful messages
- Database transaction management
- File upload validation

## 🐛 Known Issues & Fixes

Check `BUG_FIXES_SUMMARY.md` for documented issues and their resolutions.

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Team Members

- **Saif** - Full Stack Developer
- **Hamam** - Full Stack Developer
- **Naser** - Full Stack Developer

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎯 Future Enhancements

- [ ] Email notifications for appointment confirmations
- [ ] SMS reminders for upcoming appointments
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] More admin accessibility like: [ remove reviews , Delete users account]
- [ ] Toggle Dark mode

---

**Built with ❤️ by the StyleSync Team**
