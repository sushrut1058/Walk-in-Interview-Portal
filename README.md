# Walk-in Interview Platform

This is a walk-in interview platform that facilitates real-time video interviews between candidates and interviewers. The application features an Express backend, a React frontend, and a PostgreSQL database. Websockets are used for signaling, and WebRTC is used for peer-to-peer calling.

## Features

- Real-time video interviews using WebRTC
- User authentication and authorization
- Websockets for signaling between clients
- PostgreSQL database for storing user and interview data
- Responsive and intuitive UI

## Technologies Used

- Frontend: React
- Backend: Express
- Database: PostgreSQL
- Real-time Communication: Websockets (Socket.io)
- Peer-to-Peer Communication: WebRTC

## Prerequisites

- Node.js (>= 14.x)
- PostgreSQL (>= 13.x)
- Docker (optional, for containerized setup)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/walk-in-interview-platform.git
cd walk-in-interview-platform
```
# Database Configuration
```bash
POSTGRES_USER=yourusername
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=yourdatabase
```

# Server Configuration
```bash
PORT=5000
JWT_SECRET=yourjwtsecret
```
# Work-Flow

- On signup, an onboarding page will ensure a role is assigned to a user - 1)Hunter 2)Recruiter.
- A recruiter can create a room while a hunter can join the room and will be redirected to the waiting arena where he can see all other job-seekers in the room.
- The recruiter can view the waiting-arena and view profiles of these candidates and their resumes.
- They can then select a suitable candidate and invite them to the meeting room where the video interview will begin.
- If the recruiter finds the candidate suitable after the interview, they can save the user to then view and contact later for hiring.

## Future tickets
- Drastic UI improvement - Priority: High
- Metrics to show to a recruiter during candidate appraisal - Priority: Medium
- Top Profile Recommendation - Priority: Medium
