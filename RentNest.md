# RentNest 🏠
**"Find & List Rental Properties with Ease"**

---

## Project Overview

RentNest is a backend API for a rental property marketplace. Landlords can list properties, manage availability, and approve or reject rental requests. Tenants can browse listings, submit rental requests, and leave reviews. Admins oversee the entire platform, managing users and moderating content.

---

## Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Tenant** | Users looking for rental properties | Browse listings, submit rental requests, leave reviews, manage profile |
| **Landlord** | Property owners who list rentals | Create/manage listings, approve/reject requests, view tenant history |
| **Admin** | Platform moderators | Manage all users, oversee all listings & requests, manage categories, update rental status |

> 💡 **Note**: Users select their role during registration.

---

## Tech Stack

🛠️ **See [README.md](./README.md#-tech-stack) for complete technology specifications.**

---

## Features

### Public Features
- Browse all available rental properties
- View detailed property listings
- Browse property categories

### Tenant Features
- Register, login, and refresh session as tenant
- Submit rental requests for properties
- **Make payments via Stripe or SSLCommerz after rental request is approved**
- **View payment history and payment status**
- View rental request history (pending, approved, rejected)
- Leave reviews after a completed rental
- Manage profile, including profile image upload

### Landlord Features
- Register, login, and refresh session as landlord
- Create, edit, and remove property listings, with image uploads
- Approve or reject rental requests
- View rental history for their properties

### Admin Features
- View all users (tenants and landlords)
- Manage user status (ban/unban)
- View all listings and rental requests
- Directly update a rental request's status
- Manage property categories (create/delete)

---

## API Endpoints

> ⚠️ **Note**: These endpoints reflect the current implementation. Roles noted below are enforced server-side; unmarked endpoints are public or open to any authenticated user.

### Authentication
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user (tenant/landlord) |
| POST | `/api/auth/login` | Public | Login user, return JWT |
| GET | `/api/auth/me` | Authenticated | Get current authenticated user |
| PATCH | `/api/auth/update-me` | Authenticated | Update the current user's profile |
| POST | `/api/auth/refresh-token` | Public | Refresh an expired access token |

### Categories
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Public | Get all property categories |
| POST | `/api/categories` | Admin | Create a new category |
| DELETE | `/api/categories/:categoryId` | Admin | Delete a category |

### Properties (Public)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | Public | Get all properties |
| GET | `/api/properties/:propertyId` | Public | Get property details |

### Landlord Management
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/landlord/properties` | Landlord | Create new property listing |
| GET | `/api/landlord/properties` | Landlord | Get the landlord's own properties |
| PUT | `/api/landlord/properties/:propertyId` | Landlord | Update property listing |
| DELETE | `/api/landlord/properties/:propertyId` | Landlord, Admin | Remove property listing |
| GET | `/api/landlord/requests` | Landlord | Get all rental requests for landlord's properties |
| PATCH | `/api/landlord/requests/:requestId` | Landlord | Approve or reject a rental request |

### Rental Requests
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/rentals` | Tenant | Submit a rental request |
| GET | `/api/rentals` | Tenant | Get tenant's own rental requests |
| GET | `/api/rentals/:requestId` | Tenant | Get rental request details |

### Payments (Stripe / SSLCommerz)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create` | Tenant | Create a payment session for an approved rental |
| POST | `/api/payments/confirm` | Webhook (no auth) | Stripe/SSLCommerz webhook — confirms payment via raw body |
| GET | `/api/payments` | Tenant, Admin | Get payment history |
| GET | `/api/payments/:paymentId` | Tenant, Admin | Get payment details |

### Reviews
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | Tenant | Create review (after completed rental) |
| GET | `/api/reviews/:propertyId` | Public | Get all reviews for a property |

### Uploads
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/images` | Landlord, Admin | Upload up to 10 property images (max 5MB each) |
| POST | `/api/upload/profile-image` | Tenant, Landlord, Admin | Upload a single profile image (max 5MB) |

### Admin
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | Get all users |
| PATCH | `/api/admin/users/:userId` | Admin | Update user status (ban/unban) |
| GET | `/api/admin/properties` | Admin | Get all properties |
| GET | `/api/admin/rentals` | Admin | Get all rental requests |
| PATCH | `/api/admin/rentals/:requestId` | Admin | Directly update a rental request's status |

---

## Database Tables

Design your own schema for the following tables:

- **Users** - Store user information, authentication details, and role
- **Properties** - Rental property listings (linked to landlord)
- **Categories** - Property type categories (apartment, house, studio, etc.)
- **RentalRequests** - Rental requests between tenants and landlords
- **Payments** - Payment transactions (transactionId, rentalRequestId, amount, method, provider [Stripe/SSLCommerz], status [pending/completed/failed], paidAt, etc.)
- **Reviews** - Tenant reviews for properties

> 💡 *Think about what fields each table needs based on the features above.*

---

## Flow Diagrams

### 🏠 Tenant Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Browse     │
                              │  Properties  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │View Property │
                              │   Details    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Submit     │
                              │   Request    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Wait for    │
                              │  Approval    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Make Payment│
                              │(Stripe/SSLC) │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Leave Review │
                              └──────────────┘
```

### 🏘️ Landlord Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Create     │
                              │  Listings    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │    View      │
                              │  Requests    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Approve/   │
                              │   Reject     │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Manage     │
                              │  Properties  │
                              └──────────────┘
```

### 📊 Rental Request Status

```
                              ┌──────────────┐
                              │   PENDING    │
                              └──────────────┘
                               /            \
                              /              \
                    (landlord/admin)   (landlord/admin)
                        approves            rejects
                            /                \
                           ▼                  ▼
                   ┌──────────────┐   ┌──────────────┐
                   │   APPROVED   │   │   REJECTED   │
                   └──────────────┘   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   PAYMENT    │
                   │  (Stripe/    │
                   │  SSLCommerz) │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │    ACTIVE    │
                   │  (move-in)   │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │  COMPLETED   │
                   └──────────────┘
```

---

## Submission

📋 **See [README.md](./README.md) for submission guidelines, timeline, and marks.**