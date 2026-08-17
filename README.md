[gemini-code-1786987675421.js](https://github.com/user-attachments/files/31149000/gemini-code-1786987675421.js)
const fs = require('fs');
const path = require('path');

const files = {
  // 1. package.json
  'package.json': JSON.stringify({
    "name": "luxury-royal-links",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "prisma generate && next build",
      "start": "next start",
      "lint": "next lint",
      "postinstall": "prisma generate"
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
  }, null, 2),

  // 2. tsconfig.json
  'tsconfig.json': JSON.stringify({
    "compilerOptions": {
      "target": "es5",
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
  }, null, 2),

  // 3. next.config.mjs
  'next.config.mjs': `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};
export default nextConfig;`,

  // 4. tailwind.config.ts
  'tailwind.config.ts': `import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: { 950: "#050506", 900: "#0A0A0C", 850: "#101014", 800: "#16161B", 700: "#22222A" },
        gold: { champagne: "#F7E7CE", light: "#EAD096", DEFAULT: "#D4AF37", metallic: "#C59B27", dark: "#8C6A15", bronze: "#5C4308" },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F7E7CE 0%, #D4AF37 50%, #8C6A15 100%)",
        "gold-glow-radial": "radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "gold-sm": "0 0 15px -3px rgba(212, 175, 55, 0.15)",
        "gold-md": "0 0 25px -2px rgba(212, 175, 55, 0.25)",
        "gold-glow": "0 0 40px -5px rgba(212, 175, 55, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;`,

  // 5. postcss.config.mjs
  'postcss.config.mjs': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  // 6. .gitignore
  '.gitignore': `node_modules
.next
.env
.env.local
.env.production
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.pem`,

  // 7. prisma/schema.prisma
  'prisma/schema.prisma': `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model SiteSettings {
  id              String   @id @default("singleton_root")
  displayName     String   @default("Mahmoud")
  username        String   @default("mahmoud")
  bio             String   @default("Senior Legal Counselor & Private Law Researcher")
  avatarUrl       String?
  pageTitle       String   @default("Mahmoud | Official Links")
  metaDescription String   @default("Official personal link portal.")
  socialLinks     Json     @default("[]")
  updatedAt       DateTime @updatedAt
}

model Link {
  id          String   @id @default(cuid())
  title       String
  url         String
  description String?
  icon        String?
  platform    String   @default("generic")
  position    Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([position])
  @@index([isActive])
}`,

  // 8. lib/db.ts
  'lib/db.ts': `import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;`,

  // 9. lib/auth.ts
  'lib/auth.ts': `import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "fallback_default_secret_key_at_least_32_characters"
);
const COOKIE_NAME = "luxury_admin_session";

export async function createAdminToken(payload: { role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isUserAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = await verifyAdminToken(token);
  return !!payload && payload.role === "admin";
}`,

  // 10. app/globals.css
  'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #050506;
  color: #E6E6E6;
  overflow-x: hidden;
  min-height: 100vh;
}

.gold-text-gradient {
  background: linear-gradient(135deg, #FFF1D0 0%, #D4AF37 50%, #AA820A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`,

  // 11. app/layout.tsx
  'app/layout.tsx': `import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "Official Links Portal",
  description: "Exclusive Luxury Personal Links",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans antialiased bg-obsidian-950 text-gray-100">{children}</body>
    </html>
  );
}`,

  // 12. app/page.tsx
  'app/page.tsx': `import { db } from "@/lib/db";
import { ExternalLink, Copy, Send, PhoneCall, Linkedin, Twitter, Globe, Link as LinkIcon } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  let settings = null;
  let links: any[] = [];

  try {
    settings = await db.siteSettings.findUnique({ where: { id: "singleton_root" } });
    links = await db.link.findMany({ where: { isActive: true }, orderBy: { position: "asc" } });
  } catch (e) {
    // Fallback if DB is not connected yet during build
  }

  const name = settings?.displayName || "محمود";
  const bio = settings?.bio || "مستشار قانوني وباحث في القانون الخاص";
  const username = settings?.username || "mahmoud";

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-12 relative selection:bg-gold/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-gold-glow-radial blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-5">
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-b from-gold-champagne via-gold to-gold-dark shadow-gold-md">
            <div className="w-full h-full rounded-full bg-obsidian-950 flex items-center justify-center text-3xl font-bold gold-text-gradient">
              {name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-gold-dark/40">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-mono text-gold-light">@{username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold gold-text-gradient">{name}</h1>
          <p className="text-sm text-gray-300 font-light max-w-sm">{bio}</p>
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-3.5 mt-4">
          {links.length > 0 ? (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-obsidian-900/90 border border-gold-dark/30 hover:border-gold/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-obsidian-850 border border-gold/20 flex items-center justify-center text-gold">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div className="text-right truncate">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-100 group-hover:text-gold-champagne truncate">{link.title}</h3>
                    {link.description && <p className="text-xs text-gray-400 truncate">{link.description}</p>}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gold flex-shrink-0" />
              </a>
            ))
          ) : (
            <div className="p-6 rounded-2xl bg-obsidian-900 border border-gold-dark/20 text-xs text-gray-400">
              لا توجد روابط مضافة حتى الآن. يمكنك إدارتها عبر مسار /admin.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}`,

  // 13. README.md
  'README.md': `# Luxury Black & Gold Link Portal

منظومة روابط شخصية فاخرة مخصصة لمالك واحد (Single-Owner) متوافقة بالكامل مع **Vercel** و **Neon/Supabase PostgreSQL**.

## المتغيرات البيئية المطلوبة (.env)
\`\`\`env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
DIRECT_URL="postgresql://user:password@host/db?sslmode=require"
ADMIN_JWT_SECRET="YOUR_RANDOM_32_CHARACTERS_SECRET"
ADMIN_PASSWORD_HASH="YOUR_BCRYPT_HASHED_PASSWORD"
\`\`\`

## التثبيت والتشغيل المحلي
\`\`\`bash
npm install
npx prisma db push
npm run dev
\`\`\`
`
};

// تنفيذ إنشاء الملفات والمجلدات
console.log("⚡ جاري إنشاء ملفات المستودع...");
Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  if (dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`✔️ تم إنشاء: ${filePath}`);
});

console.log("\n🚀 تم تجهيز ملفات المشروع بنجاح! المشروع جاهز للرفع على GitHub.");
