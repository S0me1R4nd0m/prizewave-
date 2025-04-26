#!/bin/bash

# Exit on error
set -e

# Install dependencies
npm install

# Build the application
npm run build

# Run database migrations
npm run db:push