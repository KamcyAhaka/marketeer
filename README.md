# Marketeer REST API

CSE 341: Web Services — Final Project Part 2 (W06)  
**All Four Collections with CRUD Operations, GitHub OAuth 2.0, Data Validation, & Automated Testing**  
**Author:** Ahaka Divine *(Solo developer per instructor approval)*

---

## 📌 Project Overview

**Marketeer** is a full-featured e-commerce and retail marketing REST API built with Node.js, Express, MongoDB Atlas, and Swagger UI. In this final milestone, the API supports full CRUD capabilities across all **four collections** (`products`, `categories`, `orders`, and `reviews`), protects modification endpoints with **GitHub OAuth 2.0** session authentication, validates request payloads with comprehensive error handling, and includes an automated **Jest/Supertest unit test suite** covering all GET endpoints.

Interactive Swagger API documentation is available at `/api-docs`.

---

## 🗄️ Database Collections & Schemas

### 1. `products` Collection (9 Fields)
Represents catalog inventory items in `marketeer_db`.

| Field | Type | Required | Description / Constraints |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `title` | String | Yes | Non-empty product title |
| `description` | String | Yes | Detailed product description |
| `price` | Number | Yes | Positive number (> 0) |
| `category` | String | Yes | Category classification name |
| `stockQuantity`| Number | Yes | Non-negative integer (>= 0) |
| `brand` | String | Yes | Manufacturer or brand name |
| `sku` | String | Yes | Unique stock keeping unit (e.g. `SONY-WH1000XM5-BLK`) |
| `rating` | Number | Yes | Product rating between 0 and 5 |
| `imageUrl` | String | Yes | Valid image URL |
| `createdAt` | Date | Auto | Document creation timestamp |
| `updatedAt` | Date | Auto | Document last modification timestamp |

### 2. `categories` Collection (4 Fields)
Represents departmental classifications for catalog items.

| Field | Type | Required | Description / Constraints |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `name` | String | Yes | Category display name |
| `description` | String | Yes | Brief description of the category |
| `slug` | String | Yes | Unique, URL-friendly slug (e.g. `electronics`) |
| `isActive` | Boolean| Yes | Boolean flag (`true` or `false`) |
| `createdAt` | Date | Auto | Document creation timestamp |
| `updatedAt` | Date | Auto | Document last modification timestamp |

### 3. `orders` Collection (6 Fields)
Represents customer sales orders and checkout transactions.

| Field | Type | Required | Description / Constraints |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `userId` | String | Yes | User or GitHub account identifier |
| `customerEmail`| String | Yes | Valid email format (e.g. `alex@example.com`) |
| `items` | Array | Yes | Non-empty array of items with `productId`, `quantity` (> 0), and `unitPrice` (> 0) |
| `totalAmount` | Number | Yes | Positive checkout total (> 0) |
| `shippingAddress`| Object/String | Yes | Shipping destination (`street`, `city`, `zipCode`, `country`) |
| `orderStatus` | String | Yes | One of: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled` |
| `createdAt` | Date | Auto | Document creation timestamp |
| `updatedAt` | Date | Auto | Document last modification timestamp |

### 4. `reviews` Collection (5 Fields)
Represents customer feedback and ratings on products.

| Field | Type | Required | Description / Constraints |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `productId` | ObjectId | Yes | Valid 24-character hexadecimal MongoDB ObjectId of the target product |
| `reviewerName` | String | Yes | Non-empty reviewer name |
| `rating` | Number | Yes | Integer rating between 1 and 5 |
| `comment` | String | Yes | Non-empty review text |
| `reviewDate` | Date/String | Yes | Valid date string / timestamp |
| `createdAt` | Date | Auto | Document creation timestamp |
| `updatedAt` | Date | Auto | Document last modification timestamp |

---

## 🔒 Authentication & OAuth 2.0 Security

The API implements **GitHub OAuth 2.0** using Passport.js and `express-session`:
- **Unauthenticated Users**: Can browse the public catalog via all `GET` endpoints (`/products`, `/categories`, `/orders`, `/reviews`).
- **Authenticated Users**: Access is granted to create, update, and delete catalog resources (`POST`, `PUT`, `DELETE` across all collections).
- **Authentication Flow**:
  1. `GET /login` — Redirects client to GitHub OAuth authorization.
  2. `GET /github/callback` — Handles authorization code exchange and sets session cookie (`connect.sid`).
  3. `GET /auth/status` — Returns `{ loggedIn: true/false, user: ... }`.
  4. `GET /auth/profile` — Protected endpoint returning logged-in GitHub profile.
  5. `GET /logout` — Terminates user session and clears cookie.

---

## 🚀 Complete API Endpoints Table

| Collection | Method | Endpoint | Description | Access | Success Code |
|---|---|---|---|---|---|
| **Root** | `GET` | `/` | API status, collections, and auth routes | Public | `200 OK` |
| **Docs** | `GET` | `/api-docs` | Interactive Swagger documentation | Public | `200 OK` |
| **Auth** | `GET` | `/login` | Initiate GitHub OAuth login | Public | `302 Found` |
| **Auth** | `GET` | `/github/callback` | OAuth redirect callback | Public | `302 Found` |
| **Auth** | `GET` | `/logout` | Log out and destroy session | Public | `200 OK` |
| **Auth** | `GET` | `/auth/status` | Check authentication status | Public | `200 OK` |
| **Auth** | `GET` | `/auth/profile` | View authenticated user profile | **Protected** | `200 OK` |
| **Products** | `GET` | `/products` | Retrieve all products | Public | `200 OK` |
| **Products** | `GET` | `/products/:id` | Retrieve single product by ID | Public | `200 OK` |
| **Products** | `POST` | `/products` | Create product (9 fields) | **Protected** | `201 Created` |
| **Products** | `PUT` | `/products/:id` | Update product by ID | **Protected** | `204 No Content` |
| **Products** | `DELETE` | `/products/:id` | Delete product by ID | **Protected** | `200 OK` |
| **Categories** | `GET` | `/categories` | Retrieve all categories | Public | `200 OK` |
| **Categories** | `GET` | `/categories/:id` | Retrieve single category by ID | Public | `200 OK` |
| **Categories** | `POST` | `/categories` | Create category (4 fields) | **Protected** | `201 Created` |
| **Categories** | `PUT` | `/categories/:id` | Update category by ID | **Protected** | `204 No Content` |
| **Categories** | `DELETE` | `/categories/:id` | Delete category by ID | **Protected** | `200 OK` |
| **Orders** | `GET` | `/orders` | Retrieve all orders | Public | `200 OK` |
| **Orders** | `GET` | `/orders/:id` | Retrieve single order by ID | Public | `200 OK` |
| **Orders** | `POST` | `/orders` | Create order (6 fields) | **Protected** | `201 Created` |
| **Orders** | `PUT` | `/orders/:id` | Update order by ID | **Protected** | `204 No Content` |
| **Orders** | `DELETE` | `/orders/:id` | Delete order by ID | **Protected** | `200 OK` |
| **Reviews** | `GET` | `/reviews` | Retrieve all reviews | Public | `200 OK` |
| **Reviews** | `GET` | `/reviews/:id` | Retrieve single review by ID | Public | `200 OK` |
| **Reviews** | `POST` | `/reviews` | Create review (5 fields) | **Protected** | `201 Created` |
| **Reviews** | `PUT` | `/reviews/:id` | Update review by ID | **Protected** | `204 No Content` |
| **Reviews** | `DELETE` | `/reviews/:id` | Delete review by ID | **Protected** | `200 OK` |

---

## 🛡️ Data Validation & Error Handling

All incoming requests are strictly validated before interacting with MongoDB:
1. **Invalid ID Format (`400 Bad Request`)**: When an `:id` or `productId` is not a valid 24-hex-character MongoDB `ObjectId`.
2. **Missing or Malformed Fields (`400 Bad Request`)**: Each controller evaluates required keys, non-empty strings, numeric ranges, and formats.
3. **Domain Uniqueness (`400 Bad Request`)**: SKU uniqueness is enforced across products, and slug uniqueness is enforced across categories.
4. **Unauthorized Access (`401 Unauthorized`)**: Protected routes reject requests lacking an active OAuth session.
5. **Not Found (`404 Not Found`)**: Returned when targeting an ID not present in the database.
6. **Server Errors (`500 Internal Server Error`)**: Unhandled database exceptions are safely caught by `try/catch` and returned as sanitized JSON errors.

---

## 🧪 Automated Unit Testing (Jest + Supertest)

The project includes an automated test suite verifying all 8 `Get` and `GetAll` routes across all collections:
- `tests/products.test.js` — Tests `GET /products` (200, 500) and `GET /products/:id` (200, 400, 404).
- `tests/categories.test.js` — Tests `GET /categories` (200, 500) and `GET /categories/:id` (200, 400, 404).
- `tests/orders.test.js` — Tests `GET /orders` (200, 500) and `GET /orders/:id` (200, 400, 404).
- `tests/reviews.test.js` — Tests `GET /reviews` (200, 500) and `GET /reviews/:id` (200, 400, 404).

Run tests locally:
```bash
npm test
```

---

## 🛠️ Local Setup & Configuration

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Create a `.env` file using `.env.example`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=marketeer_db
HOST=localhost:3000

# Session Configuration
SESSION_SECRET=your_super_secret_session_key_here

# GitHub OAuth 2.0 Credentials
GITHUB_CLIENT_ID=your_github_oauth_client_id_here
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret_here
CALLBACK_URL=http://localhost:3000/github/callback
```
> ⚠️ **Security Notice:** `.env` is strictly ignored by `.gitignore` and must never be committed to GitHub.

### 3. Generate Documentation
```bash
npm run swagger
```

### 4. Run Locally
- Development mode: `npm run dev`
- Production mode: `npm start`
- Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🌐 Render Deployment

1. Commit and push your code to your GitHub repository.
2. In the Render Dashboard, create/update your Web Service connected to your repository.
3. Add environment variables in the Render Dashboard:
   - `MONGODB_URI`: Atlas connection string
   - `DB_NAME`: `marketeer_db`
   - `HOST`: `marketeer-api.onrender.com` (your Render domain)
   - `SESSION_SECRET`: Random secure string
   - `GITHUB_CLIENT_ID`: OAuth Client ID registered in GitHub Developer Settings
   - `GITHUB_CLIENT_SECRET`: OAuth Client Secret
   - `CALLBACK_URL`: `https://<your-render-domain>/github/callback`
4. In GitHub Developer Settings, configure the Authorization callback URL to match Render (`https://<your-render-domain>/github/callback`).
5. Verify `/api-docs` works on your live Render URL.
