# blend:it Frontend

https://github.com/user-attachments/assets/8e9602e7-9598-4052-95df-3d85d0c96deb

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

````markdown
# Blend:It - AI Rendering Platform

**Blend:It** is a powerful Distributed Computing Rendering rendering platform that allows users to upload `.blend` or `.zip` files, render images and videos, generate 3D models, and track rendering progress. The platform features user authentication, email verification, project management, and a Worker Tool for local contributions.

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
- [Downloads](#downloads)
- [License](#license)

---

## Features

- User registration, login, and email verification
- File upload: `.blend` or `.zip` with frame range specification
- 3D rendering with progress tracking
- Projects dashboard with search and download functionality
- Animated UI components with Framer Motion
- Worker Tool for local contribution
- Real-time project rendering progress display
- Community hub for project discussions (future integration)

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

> Ensure your backend APIs are running and accessible.

---

## Available Pages

- **Home Page:** Dynamic typewriter section, project highlights, and chart overview.
- **Render Page:** Upload `.blend` or `.zip` files with frame selection; view real-time rendering progress.
- **Projects Dashboard:** Search, view, and download completed projects.
- **Worker Tool Page:** Download the worker application for local rendering tasks.
- **Authentication Pages:** Register, Login, Email OTP verification.

---

## API Endpoints

| Endpoint                          | Method | Description                    |
| --------------------------------- | ------ | ------------------------------ |
| `/auth/signup`                    | POST   | User registration              |
| `/auth/login`                     | POST   | User login                     |
| `/auth/logout`                    | POST   | Logout                         |
| `/auth/verify`                    | POST   | Send OTP to email              |
| `/auth/verify/confirm`            | POST   | Verify OTP                     |
| `/users/me`                       | GET    | Get current user info          |
| `/api/files/all`                  | GET    | Get all uploaded projects      |
| `/api/files/upload`               | POST   | Get signed URL for file upload |
| `/project/status/frames-rendered` | POST   | Get rendering progress         |
| `/project/download`               | POST   | Download project zip file      |

---

## Authentication Flow

1. **Register** → provide email/password → receive OTP
2. **Verify OTP** → confirm email → account activated
3. **Login** → access protected routes
4. **Token Storage** → JWT stored in `localStorage` for authenticated API requests
5. **Logout** → clears token and invalidates session

> All protected routes redirect to login if the user is not authenticated.

---

## Rendering & File Upload

- Supports `.blend` and `.zip` files only.
- Specify `startFrame` and `endFrame` to render specific frame ranges.
- Drag & drop or browse file for upload.
- Progress cards display real-time rendering progress.
- Completed projects can be downloaded directly from the Projects Dashboard.

---

## Downloads

- Worker Tool: `.exe` for Windows users available via Worker Page.
- Completed project downloads are handled with secure links and local storage tracking for multiple concurrent downloads.

---

Made with ❤️ using React, TypeScript, and Tailwind CSS.
