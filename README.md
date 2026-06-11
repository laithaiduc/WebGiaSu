This repository is now split into a separated frontend and backend.

- `frontend/` - frontend Next.js application
- `backend/` - Express + MySQL backend service

## Getting Started

First, install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Start the backend in a separate terminal:

```bash
cd backend
npm install
npm run dev
```

Alternatively, from the repository root you can use the wrapper scripts:

```bash
npm run dev:frontend
npm run dev:backend
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx` inside the `frontend/` folder. The page auto-updates as you edit it.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Backend with MySQL

The backend service is now separated into `backend/` and uses Express with MySQL.

1. Copy `backend/.env.example` to `backend/.env`.
2. Set your MySQL connection values:

   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=webgiasu
   PORT=4000
   ```

3. Create the database and tables using `backend/db/schema.sql`.
4. Start the backend service:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

Start the frontend separately from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Backend API routes:

- `GET /users`
- `POST /users`
- `GET /tutors`
- `POST /tutors`

For production, hash passwords before saving them to the database.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
