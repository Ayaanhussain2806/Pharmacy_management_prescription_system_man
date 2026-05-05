# 💊 PharmaCare — Pharmacy Order & Prescription Management System

A secure, end-to-end digital pharmacy platform connecting **patients**, **pharmacists**, and **delivery agents** to streamline prescription uploads, medicine ordering, inventory management, and last-mile delivery.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Security & Compliance](#security--compliance)
- [Hackathon Deliverables](#hackathon-deliverables)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Managing chronic prescriptions and ordering medicines is often a fragmented process involving physical visits to doctors, paper prescriptions, and waiting in pharmacy queues. **PharmaCare** solves this by providing a HIPAA/GDPR-compliant digital platform where:

- **Patients** upload prescriptions, order medicines, and track deliveries in real time.
- **Pharmacists** validate prescriptions, manage inventory, and dispatch orders efficiently.
- **Delivery Agents** receive assignments, update delivery status, and collect secure OTP-based handover confirmations.

---

## Features

### Patient (Customer)
- 📤 Upload prescription images/PDFs for verification
- 🛒 Browse OTC medicine catalog with smart search (brand, generic, symptom)
- 🛍️ Place orders for home delivery or store pickup
- 📦 Real-time order tracking (Verification Pending → Processing → Out for Delivery → Delivered)
- 🔔 Automated refill reminders for chronic medications
- 💡 Generic substitute suggestions when brand is out of stock

### Pharmacist (Admin)
- 📊 Centralized order dashboard
- ✅ Prescription verification workflow (approve / reject with reason)
- 🧾 Automated billing and invoice generation
- 📦 Real-time inventory management with low-stock alerts
- 🚚 Delivery agent assignment

### Delivery Agent
- 📋 View assigned orders with delivery location
- 🔄 Update delivery status (Picked Up → Out for Delivery → Delivered)
- 🔐 Secure OTP-based handover confirmation

### System
- 🤖 OCR-powered prescription text extraction (Google Vision API / Tesseract)
- 🔒 Role-Based Access Control (RBAC)
- ☁️ Secure cloud storage for prescription files (AWS S3 / GCS)
- 📱 SMS/Push notifications via Twilio / Firebase

---

## User Roles

| Role | Permissions |
|------|-------------|
| `PATIENT` | Upload prescriptions, browse catalog, place/track orders, set refill reminders |
| `PHARMACIST` | Verify scripts, manage inventory, generate bills, assign agents |
| `DELIVERY_AGENT` | View assignments, update delivery status, collect OTP handover |
| `ADMIN` | Full system access, user management, analytics |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js / Next.js (Web) · Flutter (Mobile) |
| Backend | Java 17 + Spring Boot 3.x |
| Authentication | Spring Security + JWT + OAuth2 |
| Database (Transactional) | PostgreSQL 15 (orders, users, prescriptions) |
| Database (Catalog) | MongoDB 7 (products, categories) |
| File Storage | AWS S3 / Google Cloud Storage |
| Cache | Redis |
| Notifications | Twilio (SMS) · Firebase Cloud Messaging (Push) |
| OCR | Google Vision API / Tesseract |
| Scheduler | Spring Scheduler (refill reminders) |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| API Documentation | Swagger / OpenAPI 3.0 |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│         React/Next.js (Web)  ·  Flutter (Mobile)            │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTPS / REST
┌─────────────────────────▼────────────────────────────────────┐
│                      API GATEWAY                             │
│              (Spring Boot REST API · JWT Auth)               │
└──────┬──────────────┬───────────────┬────────────────────────┘
       │              │               │
┌──────▼─────┐ ┌──────▼──────┐ ┌─────▼──────────────┐
│   Patient  │ │ Pharmacist  │ │  Delivery Agent    │
│   Service  │ │   Service   │ │     Service        │
└──────┬─────┘ └──────┬──────┘ └─────┬──────────────┘
       │              │               │
┌──────▼──────────────▼───────────────▼──────────────────────┐
│                  CORE SERVICES LAYER                        │
│  Prescription Svc · Order Svc · Inventory Svc · Notif Svc  │
└──────┬────────────────┬───────────────────┬────────────────┘
       │                │                   │
┌──────▼──────┐  ┌──────▼──────┐  ┌────────▼────────┐
│  PostgreSQL │  │  MongoDB    │  │   AWS S3 / GCS  │
│  (Orders,  │  │  (Catalog,  │  │  (Prescriptions)│
│   Users)   │  │  Products)  │  └─────────────────┘
└────────────┘  └─────────────┘
```

> **Security Note:** Prescription files are stored in an isolated, access-controlled S3 bucket separate from public product catalog data. Only authenticated pharmacists with the `PHARMACIST` role can retrieve prescription URLs via time-limited signed URLs.

---

## Folder Structure

```
pharmacare/
│
├── 📁 backend/                          # Spring Boot Application
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/com/pharmacare/
│   │   │   │   │
│   │   │   │   ├── 📁 config/           # App-wide configuration
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   ├── RedisConfig.java
│   │   │   │   │   └── S3Config.java
│   │   │   │   │
│   │   │   │   ├── 📁 controller/       # REST Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── PatientController.java
│   │   │   │   │   ├── PrescriptionController.java
│   │   │   │   │   ├── OrderController.java
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   ├── PharmacistController.java
│   │   │   │   │   ├── InventoryController.java
│   │   │   │   │   └── DeliveryController.java
│   │   │   │   │
│   │   │   │   ├── 📁 service/          # Business Logic
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── PrescriptionService.java
│   │   │   │   │   ├── OrderService.java
│   │   │   │   │   ├── ProductService.java
│   │   │   │   │   ├── InventoryService.java
│   │   │   │   │   ├── NotificationService.java
│   │   │   │   │   ├── RefillReminderService.java
│   │   │   │   │   ├── OcrService.java
│   │   │   │   │   ├── BillingService.java
│   │   │   │   │   └── DeliveryService.java
│   │   │   │   │
│   │   │   │   ├── 📁 repository/       # Data Access Layer
│   │   │   │   │   ├── 📁 jpa/          # PostgreSQL Repositories
│   │   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   │   ├── OrderRepository.java
│   │   │   │   │   │   ├── PrescriptionRepository.java
│   │   │   │   │   │   └── DeliveryRepository.java
│   │   │   │   │   └── 📁 mongo/        # MongoDB Repositories
│   │   │   │   │       ├── ProductRepository.java
│   │   │   │   │       └── CategoryRepository.java
│   │   │   │   │
│   │   │   │   ├── 📁 model/            # Entity & Document Models
│   │   │   │   │   ├── 📁 entity/       # JPA Entities (PostgreSQL)
│   │   │   │   │   │   ├── User.java
│   │   │   │   │   │   ├── Patient.java
│   │   │   │   │   │   ├── Pharmacist.java
│   │   │   │   │   │   ├── DeliveryAgent.java
│   │   │   │   │   │   ├── Order.java
│   │   │   │   │   │   ├── OrderItem.java
│   │   │   │   │   │   ├── Prescription.java
│   │   │   │   │   │   └── Invoice.java
│   │   │   │   │   └── 📁 document/     # MongoDB Documents
│   │   │   │   │       ├── Product.java
│   │   │   │   │       └── Category.java
│   │   │   │   │
│   │   │   │   ├── 📁 dto/              # Data Transfer Objects
│   │   │   │   │   ├── 📁 request/
│   │   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   │   ├── OrderRequest.java
│   │   │   │   │   │   └── PrescriptionUploadRequest.java
│   │   │   │   │   └── 📁 response/
│   │   │   │   │       ├── OrderResponse.java
│   │   │   │   │       ├── ProductResponse.java
│   │   │   │   │       └── PrescriptionResponse.java
│   │   │   │   │
│   │   │   │   ├── 📁 security/         # Auth & RBAC
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   │   ├── UserDetailsServiceImpl.java
│   │   │   │   │   └── RoleConstants.java
│   │   │   │   │
│   │   │   │   ├── 📁 scheduler/        # Spring Schedulers
│   │   │   │   │   └── RefillReminderScheduler.java
│   │   │   │   │
│   │   │   │   ├── 📁 exception/        # Global Error Handling
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   └── PrescriptionVerificationException.java
│   │   │   │   │
│   │   │   │   └── PharmaCareApplication.java
│   │   │   │
│   │   │   └── 📁 resources/
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       └── application-prod.yml
│   │   │
│   │   └── 📁 test/
│   │       └── 📁 java/com/pharmacare/
│   │           ├── 📁 controller/
│   │           ├── 📁 service/
│   │           └── 📁 repository/
│   │
│   ├── Dockerfile
│   └── pom.xml
│
├── 📁 frontend-web/                     # React / Next.js Web App
│   ├── 📁 public/
│   │   └── assets/
│   ├── 📁 src/
│   │   ├── 📁 app/                      # Next.js App Router
│   │   │   ├── 📁 (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── 📁 patient/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── upload-prescription/page.tsx
│   │   │   │   ├── catalog/page.tsx
│   │   │   │   ├── cart/page.tsx
│   │   │   │   ├── checkout/page.tsx
│   │   │   │   └── orders/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [orderId]/page.tsx
│   │   │   ├── 📁 pharmacist/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── prescriptions/page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   └── inventory/page.tsx
│   │   │   └── 📁 delivery/
│   │   │       ├── dashboard/page.tsx
│   │   │       └── orders/[orderId]/page.tsx
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── StatusBadge.tsx
│   │   │   ├── 📁 patient/
│   │   │   │   ├── PrescriptionUploader.tsx
│   │   │   │   ├── MedicineCard.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   └── OrderTracker.tsx
│   │   │   ├── 📁 pharmacist/
│   │   │   │   ├── PrescriptionViewer.tsx
│   │   │   │   ├── VerificationForm.tsx
│   │   │   │   └── InventoryTable.tsx
│   │   │   └── 📁 delivery/
│   │   │       └── DeliveryCard.tsx
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   └── useOrders.ts
│   │   │
│   │   ├── 📁 services/                 # API Service Layer
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── prescriptionService.ts
│   │   │   └── productService.ts
│   │   │
│   │   ├── 📁 store/                    # Zustand / Redux State
│   │   │   ├── authStore.ts
│   │   │   └── cartStore.ts
│   │   │
│   │   └── 📁 types/
│   │       ├── order.types.ts
│   │       ├── product.types.ts
│   │       └── user.types.ts
│   │
│   ├── .env.local
│   ├── Dockerfile
│   ├── next.config.js
│   └── package.json
│
├── 📁 mobile/                           # Flutter Mobile App
│   ├── 📁 lib/
│   │   ├── 📁 screens/
│   │   │   ├── 📁 patient/
│   │   │   ├── 📁 pharmacist/
│   │   │   └── 📁 delivery/
│   │   ├── 📁 widgets/
│   │   ├── 📁 services/
│   │   ├── 📁 models/
│   │   └── main.dart
│   └── pubspec.yaml
│
├── 📁 infra/                            # Infrastructure & DevOps
│   ├── 📁 docker/
│   │   ├── docker-compose.yml           # Full local stack
│   │   └── docker-compose.dev.yml       # Dev with hot-reload
│   ├── 📁 k8s/                          # Kubernetes manifests
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── postgres-statefulset.yaml
│   │   └── ingress.yaml
│   └── 📁 terraform/                    # Cloud provisioning (optional)
│       ├── main.tf
│       └── variables.tf
│
├── 📁 docs/                             # Project Documentation
│   ├── architecture-diagram.png
│   ├── api-spec.yaml                    # OpenAPI 3.0 spec
│   ├── db-schema.dbml                   # Database schema
│   └── user-flows.md
│
├── 📁 scripts/                          # Utility Scripts
│   ├── seed-database.sh
│   └── run-local.sh
│
├── .github/
│   └── 📁 workflows/
│       ├── backend-ci.yml
│       └── frontend-ci.yml
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15
- MongoDB 7

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/your-org/pharmacare.git
cd pharmacare

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up --build
```

Services will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- PostgreSQL: `localhost:5432`
- MongoDB: `localhost:27017`

### Running Backend Locally

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Running Frontend Locally

```bash
cd frontend-web
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory using `.env.example` as a template:

```env
# Database
POSTGRES_URL=jdbc:postgresql://localhost:5432/pharmacare
POSTGRES_USER=pharma_user
POSTGRES_PASSWORD=your_password

MONGODB_URI=mongodb://localhost:27017/pharmacare_catalog

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRATION_MS=86400000

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_PRESCRIPTIONS=pharmacare-prescriptions
AWS_REGION=ap-south-1

# Twilio (Notifications)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890

# Firebase (Push Notifications)
FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json

# Google Vision OCR (Optional)
GOOGLE_APPLICATION_CREDENTIALS=gcp-credentials.json

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/refresh` | Refresh access token |

### Prescriptions
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/prescriptions/upload` | PATIENT | Upload prescription file |
| GET | `/api/prescriptions/{id}` | PHARMACIST | View prescription details |
| PUT | `/api/prescriptions/{id}/verify` | PHARMACIST | Approve or reject |

### Orders
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | PATIENT | Place a new order |
| GET | `/api/orders/{id}` | ALL | Get order status |
| GET | `/api/orders/my` | PATIENT | Get patient's orders |
| PUT | `/api/orders/{id}/assign` | PHARMACIST | Assign delivery agent |
| PUT | `/api/orders/{id}/status` | DELIVERY_AGENT | Update delivery status |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List catalog with search/filter |
| GET | `/api/products/{id}` | Get product details + stock |
| GET | `/api/products/substitutes/{id}` | Get generic substitutes |

### Inventory
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/inventory` | PHARMACIST | View stock levels |
| PUT | `/api/inventory/{productId}` | PHARMACIST | Update stock |

---

## Database Schema

### PostgreSQL (Transactional)

```
users            → id, name, email, password, role, phone, created_at
patients         → id, user_id, address, date_of_birth, medical_history
pharmacists      → id, user_id, store_id, license_number
delivery_agents  → id, user_id, vehicle_number, is_available
prescriptions    → id, patient_id, file_url, status, pharmacist_id, verified_at
orders           → id, patient_id, prescription_id, status, total, delivery_address
order_items      → id, order_id, product_id, quantity, unit_price
invoices         → id, order_id, generated_at, file_url
refill_reminders → id, patient_id, medicine_name, remind_at, frequency_days
```

### MongoDB (Catalog)

```
products   → _id, name, genericName, brand, category, price, stock, requiresPrescription, description
categories → _id, name, slug, imageUrl
```

---

## Security & Compliance

- **RBAC**: All endpoints are secured with role-based access using Spring Security.
- **JWT Authentication**: Stateless auth with short-lived tokens (24h) and refresh tokens.
- **Prescription Privacy**: Files stored in private S3 bucket; served via time-limited signed URLs (15 minutes).
- **Data Encryption**: Sensitive fields encrypted at rest using AES-256.
- **HIPAA/GDPR**: No PII logged; audit trails maintained for all prescription access events.
- **HTTPS Only**: Enforced in production via SSL/TLS termination at load balancer.

---

## Hackathon Deliverables

- [x] **Customer Flow**: Upload Script → Browse Catalog → Add to Cart → Checkout → Track Order
- [x] **Pharmacist Flow**: Dashboard → View Prescription → Approve/Reject → Generate Invoice → Assign Delivery
- [x] **Delivery Flow**: View Assignment → Update Status → OTP Handover
- [x] **System Architecture Diagram**: Located at `docs/architecture-diagram.png`
- [x] **API Documentation**: Swagger UI at `/swagger-ui.html`
- [x] **Demo Script**: Happy Path + Error Path in `docs/user-flows.md`

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ for the Hackathon &nbsp;|&nbsp; Digitizing pharmacy, one prescription at a time
</div>
