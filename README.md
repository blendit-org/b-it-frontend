# Blend:It - Distributed Computing Rendering Farm

https://github.com/user-attachments/assets/8e9602e7-9598-4052-95df-3d85d0c96deb

**Blend:It** is a powerful **Distributed Computing Rendering Platform** that enables users to upload `.blend` or `.zip` files, render images/videos, generate 3D models, and track rendering progress in real time.  
The platform also features **a Community Hub** for discussions, Q&A, and live chat to connect users and foster collaboration.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Rendering & File Upload](#rendering--file-upload)
- [Community Hub](#community-hub)
- [Downloads](#downloads)
- [License](#license)

---

## Features

- User registration, login, and email verification
- File upload: `.blend` or `.zip` with frame range specification
- 3D rendering with real-time progress tracking
- Projects dashboard with search and download functionality
- Animated UI components with Framer Motion
- Worker Tool for local contribution
- **Community Hub for collaboration**:
  - StackOverflow-style Q&A (questions, answers, voting, tags)
  - Accept answers as solutions
  - Real-time chat with persistent history
- Notifications for rendering updates and community activity

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **UI Components:** ShadCN/UI, Material UI, Sera UI
- **Animations:** Framer Motion
- **State Management:** Redux Toolkit Query
- **HTTP Requests:** Axios, Fetch API
- **Notifications:** Sonner
- **Form Validation:** React Hook Form, Zod

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/blendit-org/blendit-frontend.git
   cd blendit-frontend
   ```

````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (default Vite port).

> Ensure your backend APIs (rendering + community) are running and accessible.

---

## Available Pages

* **Home Page:** Dynamic typewriter section, project highlights, and chart overview.
* **Render Page:** Upload `.blend`/`.zip` files, specify frames, and view rendering progress.
* **Projects Dashboard:** Search, view, and download completed projects.
* **Worker Tool Page:** Download the worker application for local rendering tasks.
* **Authentication Pages:** Register, Login, Email OTP verification.
* **Community Hub:**

  * Q&A Forum (ask questions, answer, vote, tag, accept answers)
  * Real-time chat with persistent message history

---

## API Endpoints

### Auth

| Endpoint               | Method | Description       |
| ---------------------- | ------ | ----------------- |
| `/auth/signup`         | POST   | User registration |
| `/auth/login`          | POST   | User login        |
| `/auth/logout`         | POST   | Logout            |
| `/auth/verify`         | POST   | Send OTP to email |
| `/auth/verify/confirm` | POST   | Verify OTP        |
| `/users/me`            | GET    | Get current user  |

### Rendering

| Endpoint                          | Method | Description                    |
| --------------------------------- | ------ | ------------------------------ |
| `/api/files/all`                  | GET    | Get all uploaded projects      |
| `/api/files/upload`               | POST   | Get signed URL for file upload |
| `/project/status/frames-rendered` | POST   | Get rendering progress         |
| `/project/download`               | POST   | Download project zip file      |

### Community Hub (Q&A + Chat)

| Endpoint               | Method | Description                |
| ---------------------- | ------ | -------------------------- |
| `/questions`           | GET    | List all questions         |
| `/questions`           | POST   | Create a new question      |
| `/questions/{id}`      | GET    | Get a question + answers   |
| `/questions/{id}/vote` | POST   | Upvote/downvote a question |
| `/answers/{id}/vote`   | POST   | Upvote/downvote an answer  |
| `/answers/{id}/accept` | POST   | Accept an answer           |
| `/chat`                | GET    | Fetch chat history         |
| `/ws/chat` (WebSocket) | –      | Real-time chat messages    |

---

## Authentication Flow

1. **Register** → provide email/password → receive OTP
2. **Verify OTP** → confirm email → account activated
3. **Login** → access protected routes
4. **Token Storage** → JWT stored in `localStorage`
5. **Logout** → clears token and invalidates session

> All protected routes redirect to login if the user is not authenticated.

---

## Rendering & File Upload

* Upload `.blend` or `.zip` files only.
* Set `startFrame` and `endFrame` for selective rendering.
* Drag & drop or browse files for upload.
* Real-time rendering progress displayed in UI cards.
* Completed projects downloadable from dashboard.

---

## Community Hub

* **Q&A Forum:**

  * Ask and answer questions.
  * Vote on questions/answers.
  * Tag and categorize discussions.
  * Mark answers as accepted solutions.

* **Real-Time Chat:**

  * Persistent chat history.
  * Broadcast messages instantly to connected users.
  * Status updates for user join/leave events.

---

## Downloads

* **Worker Tool:** `.exe` available on Worker Page for Windows users.
* **Completed Projects:** Secure download links with multiple concurrent downloads support.

---

Made with ❤️ using React, TypeScript, and Tailwind CSS.

````
