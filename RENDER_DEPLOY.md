# Deploying to Render.com (Free Tier)

Follow these steps to deploy this application on Render's free tier:

## Step 1: Create a Render Account

Sign up at [render.com](https://render.com) (no credit card required)

## Step 2: Set Up Your Project

### Option A: Deploy via Blueprint (Easiest)

1. Click the "New +" button in the Render dashboard
2. Select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and configure your web service and database

### Option B: Manual Setup

If the Blueprint method doesn't work:

1. Create a PostgreSQL database:
   - Click "New +" in the Render dashboard
   - Select "PostgreSQL"
   - Choose a name (e.g., "prizewave-db")
   - Select the free tier
   - Create the database and note the Internal Database URL

2. Create a web service:
   - Click "New +" in the dashboard
   - Select "Web Service"
   - Connect your GitHub repository
   - Configure as follows:
     - Name: streaming-giveaway-platform (or any name you prefer)
     - Build Command: `./render-build.sh`
     - Start Command: `npm start`
     - Add environment variables:
       - `DATABASE_URL`: (Internal Database URL from step 1)
       - `SESSION_SECRET`: (Random string, e.g., generate with `openssl rand -hex 16`)
       - `NODE_ENV`: production

## Step 3: Finalize Database Setup

1. After deployment, go to your web service in the Render dashboard
2. Click on "Shell"
3. Run: `npm run db:push` to initialize the database schema

## Troubleshooting

If you encounter the "ENOENT: Cannot find package.json" error:

1. Make sure you're using the custom build script (`./render-build.sh`)
2. Try forking the GitHub repository and ensuring it has a clean structure
3. Verify that the package.json file is at the root of your repository

## Free Tier Limitations

- Web services sleep after 15 minutes of inactivity
- Database expires after 90 days (you can create a new one)
- 512 MB RAM limit
- 1 GB database storage

For continued usage, simply create a new database before the 90-day period ends and update your web service's DATABASE_URL environment variable.