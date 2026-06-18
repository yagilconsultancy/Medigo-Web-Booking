# MediGo Booking

MediGo Booking is the web client for the MediGo healthcare transportation platform.

It lets patients and guests:

- book medical rides
- manage bookings and ride history
- track rides in real time
- view and update profile details
- manage security, notifications, and account settings
- request support through the in-app help widget

The app is built with Next.js, React, TypeScript, MUI, Formik, React Query, and Axios.

## Project Structure

- `src/app` - Next.js routes and layouts
- `src/ui/pages` - page-level UI and feature flows
- `src/ui/modules` - shared UI components and partials
- `src/common` - API clients, hooks, constants, utilities, and types

## Requirements

- Node.js 18 or newer
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file at the project root:

```bash
.env.local
```

Use these variables:

```env
NEXT_PUBLIC_BASE_API_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_TAWK_CHAT_ID=
NEXT_PUBLIC_SOCKET_URL=
NEXT_PUBLIC_SOCKET_PATH=
NEXT_PUBLIC_CLOUD_FRONT_URL=
```

Optional local-driver simulation variables:

```env
NEXT_PUBLIC_RIDE_ID=
NEXT_PUBLIC_DRIVER_TOKEN=
NEXT_PUBLIC_DRIVER_ID=
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Common Scripts

- `npm run dev` - start the app in development mode
- `npm run dev:secure` - start Next.js with experimental HTTPS
- `npm run build` - create a production build
- `npm run lint` - run Next.js linting
- `npm run type-check` - run TypeScript checks
- `npm run format` - format the codebase with Prettier
- `npm run format:check` - check formatting without writing
- `npm run simulate:driver` - run the driver-location simulation script

## Main Flows

- authentication and OTP login
- guest booking flow
- authenticated booking flow
- scheduled rides and live tracking
- checkout and payment flows
- profile management, including deletion requests
- support/help pages

## Notes

- The home route redirects to `/booking`.
- API requests use `NEXT_PUBLIC_BASE_API_URL`.
- Real-time features use the socket URL and socket path environment variables.
- Payments require the Stripe publishable key.
- Support chat uses the Tawk ID.
