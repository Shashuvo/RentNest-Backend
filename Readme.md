# 🏠 RentNest — Backend

**Find & List Rental Properties with Ease**

RentNest is a backend API for a rental property marketplace. Landlords can list properties, manage availability, and approve or reject rental requests. Tenants can browse listings, submit rental requests, make payments, and leave reviews. Admins oversee the entire platform, managing users and moderating content.

---

## 📖 Overview

RentNest connects three types of users on a single platform:

- **Tenants** browse listings, submit rental requests, pay rent online, and leave reviews after a completed stay.
- **Landlords** create and manage listings, control availability, and approve or reject incoming requests.
- **Admins** moderate the platform — managing users, listings, categories, and rental requests.

---

## ✨ Features

### Public
- Browse all available rental properties
- View detailed property listings
- Browse property categories

### Tenant
- Register / login / refresh session
- Submit rental requests
- Pay rent via **Stripe** or **SSLCommerz** once a request is approved
- View payment history and status
- Track rental request status (pending / approved / rejected)
- Leave reviews after a completed rental
- Manage profile, including profile image upload

### Landlord
- Register / login / refresh session
- Create, edit, and remove property listings, with image uploads
- Approve or reject rental requests
- View rental history for their properties

### Admin
- View and manage all users (ban / unban)
- Oversee all listings and rental requests
- Directly update a rental request's status
- Manage property categories (create / delete)

---

## 🛠️ Tech Stack

| Layer | Technology |
| ----------- | ------------------------------------ |
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs`, role-based access control |
| File Uploads | `multer` (in-memory, 5MB limit per image) |
| Payments | Stripe, SSLCommerz |
| Dev tooling | `tsx` (dev server), `tsup` (build) |
| Middleware | `cors`, `cookie-parser`, `dotenv` |

---

## 📁 Project Structure

```
RentNest-Backend/
├── prisma/              # Prisma schema, migrations, and seed script
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── landlord/
│   │   ├── property/
│   │   ├── rental/
│   │   ├── review/
│   │   ├── admin/
│   │   ├── payment/
│   │   └── upload/
│   ├── middlewares/      # auth, notFound, globalErrorHandler
│   └── app.ts             # Express app & route registration
├── .vscode/
├── prisma.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

```bash
git clone https://github.com/Shashuvo/RentNest-Backend.git
cd RentNest-Backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/rentnest
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
SSLCOMMERZ_STORE_ID=your_sslcommerz_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sslcommerz_store_password
CLIENT_URL=http://localhost:3000
PORT=5000
```

### Database Setup

```bash
npx prisma migrate dev
npm run seed
```

### Run the Project

```bash
npm run dev        # development
npm run build       # production build
npm start           # start built app
```

---

## 📡 API Endpoints

Roles noted below are enforced via middleware (`auth(Role.X)`); unmarked endpoints are public or open to any authenticated user.

### Authentication
| Method | Endpoint | Role | Description |
| ------ | -------------------------- | --------------- | ----------------------------------- |
| POST | `/api/auth/register` | Public | Register a new user (tenant/landlord) |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/me` | Authenticated | Get the current authenticated user |
| PATCH | `/api/auth/update-me` | Authenticated | Update the current user's profile |
| POST | `/api/auth/refresh-token` | Public | Refresh an expired access token |

### Categories
| Method | Endpoint | Role | Description |
| ------ | -------------------------- | ------ | ----------------------------- |
| GET | `/api/categories` | Public | Get all property categories |
| POST | `/api/categories` | Admin | Create a new category |
| DELETE | `/api/categories/:categoryId` | Admin | Delete a category |

### Properties (Public)
| Method | Endpoint | Role | Description |
| ------ | ----------------------- | ------ | ------------------------- |
| GET | `/api/properties` | Public | Get all properties |
| GET | `/api/properties/:propertyId` | Public | Get property details |

### Landlord
| Method | Endpoint | Role | Description |
| ------ | ------------------------------- | ----------------- | --------------------------------------------------- |
| POST | `/api/landlord/properties` | Landlord | Create a new property listing |
| GET | `/api/landlord/properties` | Landlord | Get the landlord's own properties |
| PUT | `/api/landlord/properties/:propertyId` | Landlord | Update a property listing |
| DELETE | `/api/landlord/properties/:propertyId` | Landlord, Admin | Remove a property listing |
| GET | `/api/landlord/requests` | Landlord | Get all rental requests for the landlord's listings |
| PATCH | `/api/landlord/requests/:requestId` | Landlord | Approve or reject a rental request |

### Rental Requests
| Method | Endpoint | Role | Description |
| ------ | ------------------------- | -------- | ------------------------------- |
| POST | `/api/rentals` | Tenant | Submit a rental request |
| GET | `/api/rentals` | Tenant | Get the tenant's own rental requests |
| GET | `/api/rentals/:requestId` | Tenant | Get rental request details |

### Payments
| Method | Endpoint | Role | Description |
| ------ | ------------------------ | ----------------- | -------------------------------------------------------- |
| POST | `/api/payments/create` | Tenant | Create a checkout session for an approved rental |
| POST | `/api/payments/confirm` | Webhook (no auth) | Stripe/SSLCommerz webhook — confirms payment via raw body |
| GET | `/api/payments` | Tenant, Admin | Get payment history |
| GET | `/api/payments/:paymentId` | Tenant, Admin | Get payment details |

### Reviews
| Method | Endpoint | Role | Description |
| ------ | ------------------------ | ------ | ------------------------------------------ |
| POST | `/api/reviews` | Tenant | Create a review (after a completed rental) |
| GET | `/api/reviews/:propertyId` | Public | Get all reviews for a property |

### Uploads
| Method | Endpoint | Role | Description |
| ------ | -------------------------- | ----------------------- | ---------------------------------------------- |
| POST | `/api/upload/images` | Landlord, Admin | Upload up to 10 property images (max 5MB each) |
| POST | `/api/upload/profile-image` | Tenant, Landlord, Admin | Upload a single profile image (max 5MB) |

### Admin
| Method | Endpoint | Role | Description |
| ------ | ------------------------ | ------ | ------------------------------- |
| GET | `/api/admin/users` | Admin | Get all users |
| PATCH | `/api/admin/users/:userId` | Admin | Update user status (ban/unban) |
| GET | `/api/admin/properties` | Admin | Get all properties |
| GET | `/api/admin/rentals` | Admin | Get all rental requests |
| PATCH | `/api/admin/rentals/:requestId` | Admin | Directly update a rental request's status |

---

## 🗄️ Database Schema (Overview)

- **Users** — authentication details and role (tenant / landlord / admin)
- **Properties** — rental listings, linked to a landlord
- **Categories** — property types (apartment, house, studio, etc.)
- **RentalRequests** — requests between tenants and landlords
- **Payments** — transactions (amount, method, provider, status)
- **Reviews** — tenant reviews for properties

---

## 🔄 Rental Request Flow

```
PENDING → (landlord/admin approves) → APPROVED → PAYMENT → ACTIVE → COMPLETED
        → (landlord/admin rejects)  → REJECTED
```

---

## 👤 Author

**MD. Shahariat Hossen**
GitHub: [@Shashuvo](https://github.com/Shashuvo)

---

## 📄 License

This project is licensed under the ISC License.