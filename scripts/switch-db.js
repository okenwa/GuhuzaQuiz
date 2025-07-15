#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const mysqlSchemaPath = path.join(process.cwd(), 'prisma', 'schema.mysql.prisma');

function switchToMySQL() {
  console.log('🔄 Switching to MySQL schema...');
  
  if (!fs.existsSync(mysqlSchemaPath)) {
    console.error('❌ MySQL schema file not found at prisma/schema.mysql.prisma');
    return false;
  }
  
  const mysqlSchema = fs.readFileSync(mysqlSchemaPath, 'utf8');
  fs.writeFileSync(schemaPath, mysqlSchema);
  
  console.log('✅ Switched to MySQL schema');
  console.log('📋 Next steps:');
  console.log('1. Update DATABASE_URL in .env.local to use MySQL');
  console.log('2. Run: npx prisma generate');
  console.log('3. Run: npx prisma db push');
  return true;
}

function switchToPostgreSQL() {
  console.log('🔄 Switching to PostgreSQL schema...');
  
  // Read current schema and change provider to postgresql
  const currentSchema = fs.readFileSync(schemaPath, 'utf8');
  const postgresSchema = currentSchema.replace(
    /provider = "mysql"/g,
    'provider = "postgresql"'
  );
  
  fs.writeFileSync(schemaPath, postgresSchema);
  
  console.log('✅ Switched to PostgreSQL schema');
  console.log('📋 Next steps:');
  console.log('1. Update DATABASE_URL to use PostgreSQL');
  console.log('2. Run: npx prisma generate');
  console.log('3. Run: npx prisma db push');
  return true;
}

function showCurrentProvider() {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  // Look specifically for datasource provider, not generator provider
  const lines = schema.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'datasource db {') {
      // Look for provider in the next few lines
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const providerMatch = lines[j].match(/provider = "([^"]+)"/);
        if (providerMatch) {
          console.log(`📊 Current database provider: ${providerMatch[1]}`);
          return;
        }
      }
    }
  }
  console.log('❓ Could not determine current provider');
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'mysql':
    switchToMySQL();
    break;
  case 'postgresql':
  case 'postgres':
    switchToPostgreSQL();
    break;
  case 'status':
    showCurrentProvider();
    break;
  default:
    console.log('🚀 Database Schema Switcher');
    console.log('============================\n');
    console.log('Usage:');
    console.log('  node scripts/switch-db.js mysql     - Switch to MySQL schema');
    console.log('  node scripts/switch-db.js postgresql - Switch to PostgreSQL schema');
    console.log('  node scripts/switch-db.js status    - Show current provider\n');
    console.log('Examples:');
    console.log('  node scripts/switch-db.js mysql');
    console.log('  node scripts/switch-db.js postgresql');
} 