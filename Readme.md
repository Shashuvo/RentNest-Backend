# 🏠 RentNest — Backend

**Find & List Rental Properties with Ease**

RentNest is a backend API for a rental property marketplace. Landlords can list properties, manage availability, and approve or reject rental requests. Tenants can browse listings, submit rental requests, make payments, and leave reviews. Admins oversee the entire platform, managing users and moderating content.

---

## 📖 Overview

RentNest connects three types of users on a single platform:

- **Tenants** browse listings, submit rental requests, pay rent online, and leave reviews after a completed stay.
- **Landlords** create and manage listings, control availability, and approve or reject incoming requests.
- **Admins** moderate the platform — managing users, listings, and categories.

---

## ✨ Features

### Public
- Browse all available rental properties
- Search and filter by location, price range, property type, and amenities
- View detailed property listings

### Tenant
- Register / login
- Submit rental requests
- Pay rent via **Stripe** or **SSLCommerz** once a request is approved
- View payment history and status
- Track rental request status (pending / approved / rejected)
- Leave reviews after a completed rental
- Manage profile

### Landlord
- Register / login
- Create, edit, and remove property listings
- Set property availability
- Approve or reject rental requests
- View rental history and tenant reviews

### Admin
- View and manage all users (ban / unban)
- Oversee all listings and rental requests
- Manage property categories

---

## 🛠️ Tech Stack

| Layer | Technology |
| ----------- | ------------------------------------ |
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Payments | Stripe, SSLCommerz |
| Dev tooling | `tsx` (dev server), `tsup` (build) |
| Middleware | `cors`, `cookie-parser`, `dotenv` |

---

## 📁 Project Structure

```
RentNest-Backend/
├── prisma/              # Prisma schema, migrations, and seed script
├── src/                 # Application source code
│   └── server.ts        # App entry point
├── .vscode/              # Editor settings
├── prisma.config.ts      # Prisma configuration
├── tsconfig.json         # TypeScript configuration
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

### Authentication
| Method | Endpoint | Description |
| ------ | --------------------- | ----------------------------------- |
| POST | `/api/auth/register` | Register a new user (tenant/landlord) |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/auth/me` | Get the current authenticated user |

### Properties (Public)
| Method | Endpoint | Description |
| ------ | ----------------------- | ------------------------------------ |
| GET | `/api/properties` | Get all properties (with filters) |
| GET | `/api/properties/:id` | Get property details |
| GET | `/api/categories` | Get all property categories |

### Landlord
| Method | Endpoint | Description |
| ------ | ------------------------------- | ------------------------------------------------- |
| POST | `/api/landlord/properties` | Create a new property listing |
| PUT | `/api/landlord/properties/:id` | Update a property listing |
| DELETE | `/api/landlord/properties/:id` | Remove a property listing |
| GET | `/api/landlord/requests` | Get all rental requests for landlord's listings |
| PATCH | `/api/landlord/requests/:id` | Approve or reject a rental request |

### Rental Requests
| Method | Endpoint | Description |
| ------ | ------------------- | ------------------------------- |
| POST | `/api/rentals` | Submit a rental request (tenant) |
| GET | `/api/rentals` | Get the user's rental requests |
| GET | `/api/rentals/:id` | Get rental request details |

### Payments
| Method | Endpoint | Description |
| ------ | ------------------------ | -------------------------------------------------------- |
| POST | `/api/payments/create` | Create a payment intent/session for an approved rental |
| POST | `/api/payments/confirm` | Confirm/verify a payment (webhook or callback) |
| GET | `/api/payments` | Get the user's payment history |
| GET | `/api/payments/:id` | Get payment details |

### Reviews
| Method | Endpoint | Description |
| ------ | -------------- | ------------------------------------------ |
| POST | `/api/reviews` | Create a review (after a completed rental) |

### Admin
| Method | Endpoint | Description |
| ------ | ------------------------ | ------------------------------- |
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status (ban/unban) |
| GET | `/api/admin/properties` | Get all properties |
| GET | `/api/admin/rentals` | Get all rental requests |

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
PENDING → (landlord approves) → APPROVED → PAYMENT → ACTIVE → COMPLETED
        → (landlord rejects)  → REJECTED
```

---

## 👤 Author

**MD. Shahariat Hossen**
GitHub: [@Shashuvo](https://github.com/Shashuvo)

---

## 📄 License

This project is licensed under the ISC License.