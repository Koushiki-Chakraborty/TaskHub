# TaskHub

A full-stack Task Management application featuring secure authentication, a dynamic analytics dashboard, and a full CRUD system for task organization. Built as part of the Primetrade AI Internship assignment.

---

## Features

### **Frontend**

- **Dashboard Overview:** Real-time task statistics and completion progress bars.
- **Task Management:** Full CRUD (Create, Read, Update, Delete) with a dedicated "Single Task View."
- **Search & Filter:** Instant task filtering by title and status (Pending, In-Progress, Completed).
- **Profile Settings:** Update user account information (Name/Email) with instant UI updates.
- **Protected Routes:** Unauthorized users are automatically redirected to the login page.
- **Responsive Design:** Mobile-first layout using Tailwind CSS.

### **Backend**

- **JWT Authentication:** Secure token-based auth system.
- **Password Security:** Multi-layer hashing using `bcryptjs`.
- **API Versioning:** Clean `/api/v1` structure.
- **CORS Enabled:** Secure cross-origin communication with specific frontend white-listing.

---

## System Architecture

![TaskHub Architecture](./assets/system-architecture-diagram.png)

---

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Lucide React, Axios, React Router.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (via Mongoose).
- **State Management:** React Context API (AuthContext).

---

## Installation & Setup

### **1. Clone the Repository**

```bash
git clone [https://github.com/Koushiki-Chakraborty/TaskHub.git](https://github.com/Koushiki-Chakraborty/TaskHub.git)
cd TaskHub
```

### **2. Backend Configuration**

- Navigate to the folder: cd backend

- Install dependencies: npm install

- Create a .env file from the example:

```bash
        cp .env.example .env
```

- Fill in your credentials:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:5173
```

- Run the server:

```bash
npm run dev
```

### **3. Frontend Configuration**

- Navigate to the folder: cd ../frontend

- Install dependencies: npm install

- Create a .env file (optional):

```bash
VITE_API_URL=http://localhost:5000/api/v1
```

- Run the app:

```bash
npm run dev
```

## API Reference

## Authentication

| Method | Endpoint     | Description                    | Auth Required |
| ------ | ------------ | ------------------------------ | ------------- |
| POST   | /auth/signup | Create a new user account      | No            |
| POST   | /auth/login  | Authenticate user & return JWT | No            |

---

## Profile

| Method | Endpoint | Description                     | Auth Required |
| ------ | -------- | ------------------------------- | ------------- |
| GET    | /auth/me | Retrieve current user's profile | Yes           |
| PUT    | /auth/me | Update user name and email      | Yes           |

---

## Tasks (CRUD)

| Method | Endpoint   | Description                          | Auth Required |
| ------ | ---------- | ------------------------------------ | ------------- |
| GET    | /tasks     | Fetch all tasks (with search/filter) | Yes           |
| GET    | /tasks/:id | Get details for a single task        | Yes           |
| POST   | /tasks     | Create a new task                    | Yes           |
| PUT    | /tasks/:id | Update an existing task              | Yes           |
| DELETE | /tasks/:id | Permanently remove a task            | Yes           |

---
