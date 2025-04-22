# Simple Social Media App

A fullstack social media application built with React, Express, TypeScript, and Tailwind CSS.

## Features

- User authentication and authorization using JWT
- Post creation and liking
- User profile management
- Secure password hashing and data encryption
- Refresh token implementation

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express + TypeScript
- Authentication: JWT
- Security: Crypto-js for hashing and encryption

## Project Structure

```
social-media-app/
├── client/          # React frontend
└── server/          # Express backend
```

## Setup Instructions

### Backend Setup

1. Navigate to server directory
2. Run `npm install`
3. Create a `.env` file with required environment variables
4. Run `npm run dev` to start the development server

### Frontend Setup

1. Navigate to client directory
2. Run `npm install`
3. Run `npm run dev` to start the development server

## Environment Variables

Create a `.env` file in the server directory with:

```
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
MONGODB_URI=your_mongodb_uri
```
