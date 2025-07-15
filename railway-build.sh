#!/bin/bash

# Railway Build Script for Guhuza Quiz App
echo "🚂 Starting Railway build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build process complete!" 