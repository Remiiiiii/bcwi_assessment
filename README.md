# BCWI TellerView: Client Account Management Dashboard

BCWI TellerView is a web application designed for bank tellers or administrators to manage client bank accounts. It provides a dashboard interface to view client details, including checking and savings account information, and perform basic operations.

## Features

- **Client Directory:** View a list of all active clients.
- **Search & Filter:** Search for clients by name or birthday, and filter by account type.
- **Client Details:** View detailed information for a selected client, including personal data and account balances.
- **Fund Transfers:** Perform fund transfers between a client's checking and savings accounts.
- **Account Closure:** Mark client accounts as inactive (soft delete).
- **User Authentication:** Secure login for administrators/tellers (e.g., via Google/GitHub).

## Tech Stack / Tools & Libraries

- **Framework:** [Next.js](https://nextjs.org/) (^14.x)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database ORM:** [Prisma](https://www.prisma.io/) (^6.7.x)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (v5 beta)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4.x)
- **UI Components:**
  - [Shadcn/UI](https://ui.shadcn.com/) (built on Radix UI)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Sonner](https://sonner.emilkowal.ski/) (Toast Notifications)
- **State Management:** React Context API (implied by Next.js app structure) & `useState`/`useEffect` hooks.
- **Forms & Validation:** Handled with standard React state and custom logic.
- **Linting & Formatting:** ESLint (likely with Next.js default config).
- **Testing:** Jest, React Testing Library (setup identified in `package.json`).
- **API Development:** Next.js API Routes.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/downloads/) database server running locally or accessible.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Remiiiiii/bcwi_assessment.git
    cd bcwi_assessment
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project by copying the example file (if an `.env.example` is provided - if not, create `.env.local` manually).

    ```bash
    # If .env.example exists:
    # cp .env.example .env.local
    ```

    Update/create `.env.local` with your specific configurations:

    - `DATABASE_URL`: Your PostgreSQL connection string.
      Example: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public`
    - `AUTH_SECRET`: A secret key for NextAuth.js. Generate one using `openssl rand -hex 32` or similar.
    - `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: Google OAuth credentials (if you want to use Google login).
    - `AUTH_GITHUB_ID` & `AUTH_GITHUB_SECRET`: GitHub OAuth credentials (if you want to use GitHub login).
    - (Add any other environment variables your application might need for NextAuth.js providers or other services)

4.  **Database Setup (Prisma):**
    Apply schema changes to your database and seed it:

    ```bash
    npx prisma db push --force-reset
    npx prisma db seed
    ```

    _Note: `--force-reset` will drop and recreate your local database tables. This is suitable for initial setup or if you don't mind losing local data. For schema changes after initial setup, consider using `prisma migrate dev`._

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Running Tests

To run the automated tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Building for Production

To create an optimized production build:

```bash
npm run build
```

## Deployment

This application is configured for deployment on [Vercel](https://vercel.com/). The `build` script in `package.json` (`prisma generate && prisma db push --force-reset && prisma db seed && next build`) is used by Vercel during the deployment process. Ensure all necessary environment variables (as listed in the setup section) are configured in your Vercel project settings.

**Important Note on Production Database:** The current build script includes `prisma db push --force-reset && prisma db seed`. This will reset and re-seed your database on every deployment. For a production environment with persistent data, you should adapt this to use `prisma migrate deploy` and manage seeding more carefully to avoid data loss.
