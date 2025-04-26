# Streaming Giveaway Platform

A modern web application for running streaming service giveaways (Netflix, Disney+, HBO Max, etc.) with referral functionality to increase engagement.

## Features

- User-friendly interface for browsing active giveaways
- Ability to enter giveaways with email/contact information
- Referral system where users earn additional entries by getting others to sign up
- Admin dashboard for creating giveaways and selecting winners
- Winner showcase with testimonials
- PostgreSQL database for reliable data storage

## Tech Stack

- **Frontend**: React with TypeScript, TailwindCSS, Shadcn/UI components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **API**: REST API for all operations
- **State Management**: TanStack Query for data fetching and caching

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/streaming-giveaway-platform.git
   cd streaming-giveaway-platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your database connection string:
   ```
   DATABASE_URL=postgres://username:password@hostname:port/database
   ```

4. Initialize the database:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open http://localhost:5000 in your browser

## Deployment

This application can be deployed to any hosting service that supports Node.js applications and PostgreSQL databases.

## License

[MIT](LICENSE)