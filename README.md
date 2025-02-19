# Gisty Chat Backend

## Overview

The backend of Gisty Chat is built using **Node.js** and **Express** with a **MongoDB** database for storing user data and chat messages. This backend provides RESTful APIs for user authentication, chat functionalities, and more.

## Features

- JWT-based authentication (Login & Register endpoints)
- Password hashing with **bcrypt**
- MongoDB integration using **Mongoose**
- Error handling with appropriate status codes and messages
- Secure API routes

## Technologies

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password encryption
- **TypeScript** for typing

## Folder Structure

```bash
src/
│
├── controllers/    # Route controllers
├── models/         # Mongoose models (User, Chat)
├── routes/         # API routes (users, chat)
├── middlewares/    # Authentication, validation
├── utils/          # Utility functions (token generation, etc.)
├── config/         # MongoDB and environment configurations
├── app.ts          # Express app setup
├── server.ts       # Server entry point
```
