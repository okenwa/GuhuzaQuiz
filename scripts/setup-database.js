#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Guhuza Quiz App Database Setup');
console.log('=====================================\n');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Creating .env.local file...');
  
  // Read the example file
  const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Write to .env.local
  fs.writeFileSync(envLocalPath, exampleContent);
  
  console.log('✅ .env.local created successfully!');
  console.log('⚠️  Please update the database credentials in .env.local');
} else {
  console.log('✅ .env.local already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Update DATABASE_URL in .env.local with your local MySQL credentials');
console.log('2. Run: npm run db:generate');
console.log('3. Run: npm run db:push');
console.log('4. Run: npm run dev');

console.log('\n🔧 For production deployment:');
console.log('- Set DATABASE_PROVIDER="postgresql"');
console.log('- Set DATABASE_URL to your PostgreSQL connection string');
console.log('- Ensure the URL starts with "postgresql://" or "postgres://"'); 