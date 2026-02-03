# TaskHub

A full-stack Task Management application featuring secure authentication, a dynamic analytics dashboard, and a full CRUD system for task organization. Built as part of the Primetrade AI Internship assignment.

---

## Live Links

- **Frontend:** [https://taskhub-frontend-eight.vercel.app/](https://taskhub-frontend-eight.vercel.app/)
- **Backend API:** [https://taskhub-backend-myms.onrender.com/](https://taskhub-backend-myms.onrender.com/)

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

![TaskHub Architecture](./docs/system-architecture-diagram.png)

The diagram above illustrates the full-stack lifecycle of the application:

- **Client Tier:** A React SPA that manages state via the Context API and communicates with the server using Axios.
- **Security Tier:** A custom JWT Middleware that validates tokens and protects sensitive routes.
- **Logic Tier:** Express controllers that handle specialized business logic for Authentication, Profile management, and Task CRUD.
- **Data Tier:** MongoDB used as the primary data store with specialized collections for Users and Tasks.

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
git clone https://github.com/Koushiki-Chakraborty/TaskHub.git
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

### Authentication

| Method | Endpoint              | Description                    | Auth Required |
| :----- | :-------------------- | :----------------------------- | :------------ |
| `POST` | `/api/v1/auth/signup` | Create a new user account      | No            |
| `POST` | `/api/v1/auth/login`  | Authenticate user & return JWT | No            |

### Profile

| Method | Endpoint          | Description                     | Auth Required |
| :----- | :---------------- | :------------------------------ | :------------ |
| `GET`  | `/api/v1/auth/me` | Retrieve current user's profile | Yes           |
| `PUT`  | `/api/v1/auth/me` | Update user name and email      | Yes           |

### Tasks (CRUD)

| Method   | Endpoint            | Description                          | Auth Required |
| :------- | :------------------ | :----------------------------------- | :------------ |
| `GET`    | `/api/v1/tasks`     | Fetch all tasks (with search/filter) | Yes           |
| `GET`    | `/api/v1/tasks/:id` | Get details for a single task        | Yes           |
| `POST`   | `/api/v1/tasks`     | Create a new task                    | Yes           |
| `PUT`    | `/api/v1/tasks/:id` | Update an existing task              | Yes           |
| `DELETE` | `/api/v1/tasks/:id` | Permanently remove a task            | Yes           |

---

## Scalability & Production Roadmap

To transition this application from a local MVP to a production-ready system, I would implement:

- **Infrastructure:** Containerize the app using **Docker** and deploy to **AWS/GCP** with a Load Balancer for horizontal scaling.
- **Database Optimization:** Implement MongoDB **indexing** on `userId` and `status` fields to maintain query performance as the data grows.
- **Caching:** Integrate a **Redis** layer to cache user profiles and frequently accessed task lists, reducing database load.
- **Enhanced Security:** Implement **Rate Limiting** to prevent Brute Force attacks and transition to **httpOnly cookies** for safer JWT storage.
- **Global State & Performance:** Add **Pagination** for task fetching and implement **Redux Toolkit** if the state complexity increases.

---

## Demo & Testing

**Test Credentials:**

- **Email:** `test@gmail.com`
- **Password:** `Password123`

**API Testing:**
A complete **Postman Collection** is included in the `docs/` folder.

1. Import `docs/TaskHub.postman_collection.json` into Postman.
2. Set the `base_url` variable if your port differs from `5000`.
3. Use the **Login** request to get a token and paste it into the `jwt_token` variable to access protected routes.
