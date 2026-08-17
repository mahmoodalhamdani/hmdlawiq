[gemini-code-1786986984209.sh](https://github.com/user-attachments/files/31148831/gemini-code-1786986984209.sh)
#!/bin/bash
# سكريبت بناء مشروع Luxury Royal Links الكامل

PROJECT_NAME="luxury-royal-links"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# 1. إنشاء package.json
cat << 'EOF' > package.json
{
  "name": "luxury-royal-links",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.19.1",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "jose": "^5.8.0",
    "lucide-react": "^0.436.0",
    "next": "14.2.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.16.1",
    "@types/react": "^18.3.4",
    "@types/react-dom": "^18.3.0",
    "postcss": "^8.4.41",
    "prisma": "^5.19.1",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4"
  }
}
EOF

# 2. إنشاء tsconfig.json
cat << 'EOF' > tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# 3. إنشاء .env.example
cat << 'EOF' > .env.example
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@host/neondb?sslmode=require"
ADMIN_JWT_SECRET="generate_a_random_32_characters_key_here"
ADMIN_PASSWORD_HASH="$2a$10$sampleHashHere"
EOF

# 4. بناء هيكل المجلدات
mkdir -p app/(public) app/admin/login actions components/public components/admin components/ui lib prisma

echo "تم تجهيز هيكل المشروع بنجاح في مجلد: $PROJECT_NAME"
