#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Guhuza Quiz App Database Setup');
console.log('=====================================\n');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Local Development Environment (MySQL)
DATABASE_PROVIDER="mysql"
DATABASE_URL="mysql://root:password@localhost:3306/guhuza_quiz"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret-key-change-this"

# Google OAuth (for local development)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Analytics (optional for local)
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
`;
  
  fs.writeFileSync(envLocalPath, envContent);
  
  console.log('✅ .env.local created successfully!');
  console.log('⚠️  Please update the database credentials in .env.local');
} else {
  console.log('✅ .env.local already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Update DATABASE_URL in .env.local with your local MySQL credentials');
console.log('2. Run: npx prisma generate');
console.log('3. Run: npx prisma db push');
console.log('4. Run: npm run dev');

console.log('\n🔧 For production deployment:');
console.log('- Set DATABASE_PROVIDER="postgresql"');
console.log('- Set DATABASE_URL to your PostgreSQL connection string');
console.log('- Ensure the URL starts with "postgresql://" or "postgres://"'); 