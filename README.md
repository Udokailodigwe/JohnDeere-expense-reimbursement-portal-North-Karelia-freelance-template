# John Deere Expense Reimbursement Portal - Backend API

A robust REST API backend for John Deere's expense management system, providing secure endpoints for contractors and drivers to submit, track, and manage expense reimbursements.

## 🚜 Overview

This backend service provides a comprehensive REST API for expense management within the John Deere ecosystem, handling user authentication, expense submissions, approval workflows, and data management.

## ✨ API Features

- **User Authentication**: JWT-based authentication system
- **Employee Registration**: Secure registration for John Deere contractors and drivers
- **Expense Management**: CRUD operations for expense submissions
- **Role-based Authorization**: Different access levels for contractors and managers
- **Approval Workflow**: Manager approval/rejection system
- **Email Notifications**: Automated email notifications using Nodemailer
- **Data Validation**: Comprehensive input validation using Joi schemas
- **Error Handling**: Custom error classes and middleware
- **Security**: Password hashing, JWT tokens, and protected routes

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Data validation
- **Nodemailer** - Email notification service

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Internal-Expense-Reimbursement-Portal/app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `app` directory:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@johndeere.com
   ```

4. **Start the server**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

## 📡 API Endpoints

### Authentication Routes (`/api/v1/auth`)

- `POST /register` - Employee registration
- `POST /register/manager` - Manager registration (requires authentication)
- `POST /bootstrap` - Bootstrap route to create first manager
- `POST /login` - User login
- `POST /reset-password` - Password reset

### Expense Routes (`/api/v1/expenses`)

- `GET /` - Get user expenses (authenticated)
- `POST /` - Create new expense (authenticated)
- `GET /:id` - Get specific expense (authenticated)
- `PUT /:id` - Update expense (authenticated)
- `DELETE /:id` - Delete expense (authenticated)

### Approval Routes (`/api/v1/approvals`)

- `GET /` - Get pending approvals (managers only)
- `PUT /:id` - Approve/reject expense (managers only)

## 🔐 Authentication & Authorization

### JWT Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **Employee**: Can manage their own expenses
- **Manager**: Can approve/reject expenses and access all submissions

### Protected Routes

- Most expense routes require authentication
- Manager-specific routes require manager role
- Bootstrap route allows initial manager creation

## 📧 Email Notifications

The API includes automated email notifications using Nodemailer for various system events:

### Email Triggers

- **User Registration**: Welcome email with temporary password
- **Expense Submission**: Notification to managers about new expense
- **Expense Approval**: Confirmation email to employee
- **Expense Rejection**: Notification with rejection reason
- **Password Reset**: Reset instructions and new temporary password

### Email Templates

- **Welcome Email**: Contains temporary password and login instructions
- **Expense Notifications**: Includes expense details and approval/rejection status
- **System Notifications**: Important updates and announcements

### Configuration

Email settings are configured via environment variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@johndeere.com
```

### Supported Email Providers

- Gmail (SMTP)
- Outlook (SMTP)
- Custom SMTP servers
- SendGrid
- Mailgun

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['employee', 'manager']),
  active: Boolean (default: false)
}
```

### Expense Model

```javascript
{
  description: String (required),
  amount: Number (required),
  category: String (required),
  receipt: String,
  status: String (enum: ['pending', 'approved', 'rejected']),
  submittedBy: ObjectId (ref: 'User'),
  reviewedBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (if configured)
```

### Project Structure

```
app/
├── controllers/   # Route handlers
│   ├── auth.js    # Authentication logic
│   ├── expense.js # Expense management
│   └── approval.js # Approval workflows
├── middleware/    # Custom middleware
│   ├── auth.js    # Authentication middleware
│   ├── error-handler.js # Error handling
│   └── validate-request.js # Request validation
├── models/        # Database models
│   ├── user.js    # User schema
│   ├── expense.js # Expense schema
│   └── approval.js # Approval schema
├── routes/        # API routes
│   ├── auth.js    # Authentication routes
│   ├── expense.js # Expense routes
│   └── approval.js # Approval routes
├── utils/         # Utility functions
├── errors/        # Custom error classes
├── data/          # Validation schemas
└── db/           # Database connection
```

## 🛡️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Joi schemas for request validation
- **CORS Protection**: Configurable cross-origin policies
- **Environment Variables**: Sensitive data protection
- **Error Handling**: Secure error responses without data leaks

## 📝 API Response Format

### Success Response

```json
{
  "message": "Operation successful",
  "data": { ... },
  "status": 200
}
```

### Error Response

```json
{
  "message": "Error description",
  "error": "Detailed error information",
  "status": 400
}
```

## 🚀 Deployment

1. **Environment Setup**: Configure all required environment variables
2. **Database**: Set up MongoDB Atlas or local MongoDB instance
3. **Dependencies**: Run `npm install --production`
4. **Server**: Deploy to your hosting platform (Heroku, AWS, etc.)
5. **Process Manager**: Use PM2 or similar for production

### Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-portal
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@johndeere.com
```

## 📊 API Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for John Deere. All rights reserved.

## 📞 Support

For API support and questions, please contact the backend development team.

---

**© 2024 John Deere. All rights reserved.**
