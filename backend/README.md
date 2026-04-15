# 🚀 TaskWise Backend

A RESTful API for **TaskWise** — a smart web-based student task management system with priority scoring and deadline analytics.

---

## ⚙️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt
- **Security Middlware:** helmet,cors
- **Environment Management:** dotenv
- **Dev Tools:** nodemon

---

## 📁 Folder Structure

```
/backend
├── /src
│   └── /config
│   │   └── db.js
│   └── /modules
│   │   └── /controllers
│   │   │   └── group.controller.js
│   │   │   └── student.controller.js
│   │   │   └── task.assignment.controller.js
│   │   │   └── task.controller.js
│   │   └── /middlewares
│   │   │   └── auth.middleware.js
│   │   └── /models
│   │   │   └── group.member.model.js
│   │   │   └── group.model.js
│   │   │   └── student.model.js
│   │   │   └── task.assigment.model.js
│   │   │   └── task.model.js
│   │   │   └── task.priority.model.js
│   │   └── /repositories
│   │   │   └── group.member.repo.js
│   │   │   └── group.repo.js
│   │   │   └── student.repo.js
│   │   │   └── task.assignment.repo.js
│   │   │   └── task.repo.js
│   │   └── /routes
│   │   │   └── group.router.js
│   │   │   └── student.router.js
│   │   │   └── task.router.js
│   │   └── /services
│   │       └── group.service.js
│   │       └── student.service.js
│   │       └── task.assignment.service.js
│   │       └── task.service.js
│   └── server.js
├── .env
├── package.json
```

---

## 🗄️ Data Models

| Model          | Description                        |
| -------------- | ---------------------------------- |
| Student        | Stores user credentials            |
| Group          | Represents a student-created group |
| GroupMember    | Tracks group membership            |
| Task           | Core task entity                   |
| TaskAssignment | Assigns tasks to students          |
| TaskPriority   | Stores task priority levels        |

---

## 🔌 Connection Setup

1. Create a `.env` file inside `/backend`:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

---

## 📡 API Routes

### Group `/api/group`

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/group`            | Get all groups       |
| POST   | `/api/group/create`     | Create a group       |
| POST   | `/api/group/join`       | Join via invite code |
| DELETE | `/api/group/delete/:id` | Delete group         |

### Student `/api/student`

| Method | Endpoint                | Description      |
| ------ | ----------------------- | ---------------- |
| POST   | `/api/student/register` | Register account |
| POST   | `/api/student/login`    | Login account    |

### Task `/api/task`

| Method | Endpoint               | Description   |
| ------ | ---------------------- | ------------- |
| GET    | `/api/task`            | Get all tasks |
| POST   | `/api/task/create`     | Create a task |
| PATCH  | `/api/task/update/:id` | Update a task |
| DELETE | `/api/task/delete/:id` | Delete a task |

---

## 🧠 Features

- JWT Authentication
- Group collaboration
- Task prioritization
- Deadline tracking
- Modular architecture

---

## 🛠️ Future Improvements

- Input validation (Joi/Zod)
- Global error handler
- Role-based access control
- API documentation (Swagger)

---

## 👥 Group

**TechNet** — BSIT-2A | Bicol University Polangui
