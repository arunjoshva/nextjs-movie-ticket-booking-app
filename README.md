# BookShows

A full-stack movie ticket booking application built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Prisma 8.

## Live Demo

https://nextjs-movie-ticket-booking-app.vercel.app/

## About the Project

BookShows is a movie ticket booking application that allows users to browse movies, explore available shows in theatres, select seats, and manage their bookings.

The project was built as a portfolio application to demonstrate full-stack development using Next.js, PostgreSQL, and Prisma 8.

## Features

- Browse available movies
- View movie details
- View available theatres and show times
- User registration and login
- Secure password hashing
- JWT-based authentication
- Protected booking functionality
- Select movie seats
- Real-time occupied-seat checking
- Prevent duplicate seat bookings
- Booking confirmation
- View all personal bookings
- View individual booking details
- Responsive design for desktop and mobile devices

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js App Router
- Next.js Route Handlers
- JWT authentication
- bcryptjs

### Database

- PostgreSQL
- Neon PostgreSQL
- Prisma 8

### Other Tools

- Git
- GitHub
- Vercel
- Cloudinary
- Axios

## Project Structure

```text
src/
├── app/
│   ├── movies/
│   ├── booking/
│   ├── bookings/
│   └── api/
│       ├── register/
│       ├── booking/
│       └── logout/
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MovieCard.tsx
│   ├── BookingShowSelector.tsx
│   ├── AvailableShows.tsx
│   └── SeatLayout.tsx
│
├── data/
│   ├── movies.ts
│   ├── theatres.ts
│   └── shows.ts
│
└── prisma/
    ├── db.ts
    ├── contract.d.ts
    └── contract.json
```
## Database

The application uses PostgreSQL with Prisma 8.

The database contains:

- User
- Booking
- BookingSeat

Movie, theatre, and show information is maintained as application data rather than stored in the database.

The BookingSeat table uses a unique constraint on:

```
showKey + seatNumber
```
to prevent the same seat from being booked more than once for the same show.

## Authentication

BookShows uses custom JWT-based authentication.

Passwords are securely hashed using bcryptjs, and authenticated users receive a session cookie used to access protected booking functionality.

## Booking Flow

```
Browse Movies
      ↓
Movie Details
      ↓
Select Theatre & Show
      ↓
Select Seats
      ↓
Login / Register
      ↓
Confirm Booking
      ↓
Booking Confirmation
      ↓
My Bookings
```
## Deployment

The application is deployed using Vercel.

Production deployment:

https://nextjs-movie-ticket-booking-app.vercel.app/

The project is connected to GitHub, and the main branch is used for production deployments.

## Responsive Design

The application is designed to work across:

- Desktop
- Tablet
- Mobile

The movie listing, show selection, and seat selection interfaces are optimized for smaller screens.

## Author

Arun Joshva

Full Stack Developer