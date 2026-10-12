# Marketeer REST API

CSE 341: Web Services — Final Project Part 1 (W05)  
**First Two Collections with CRUD Operations & API Documentation**  
**Author:** Ahaka Divine *(Solo developer per instructor approval)*

---

## 📌 Project Overview

**Marketeer** is an e-commerce and retail marketing management REST API built with Node.js, Express, MongoDB, and Swagger UI. This project delivers full CRUD functionality for the first two collections: **Products** and **Categories**, adhering to strict input validation, consistent error handling, and interactive Swagger API documentation accessible at `/api-docs`.

---

## 🗄️ Database Collections & Schemas

### 1. `products` Collection (9 Fields)
Represents digital storefront inventory items in `marketeer_db`.

| Field | Type | Required | Description / Constraints |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `title` | String | Yes | Non-empty product title |
| `description` | String | Yes | Non-empty detailed product description |
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
Represents departmental classifications for products in `marketeer_db`.

| Field | Type | Required | Description / Constraints |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `name` | String | Yes | Category display name |
| `description` | String | Yes | Brief description of the category |
| `slug` | String | Yes | URL-friendly slug (e.g. `electronics`) |
| `isActive` | Boolean| Yes | Boolean flag (`true` or `false`) |
| `createdAt` | Date | Auto | Document creation timestamp |
| `updatedAt` | Date | Auto | Document last modification timestamp |

---

## 🚀 API Endpoints

### Products (`/products`)
| Method | Endpoint | Description | Success Code | Error Codes |
|---|---|---|---|---|
| `GET` | `/products` | Retrieve all products in the catalog | `200 OK` | `500` |
| `GET` | `/products/:id` | Retrieve a single product by MongoDB ObjectId | `200 OK` | `400`, `404`, `500` |
| `POST` | `/products` | Create a new product with validated 9-field payload | `201 Created` | `400`, `500` |
| `PUT` | `/products/:id` | Replace / update product by MongoDB ObjectId | `204 No Content` | `400`, `404`, `500` |
| `DELETE` | `/products/:id` | Delete product by MongoDB ObjectId | `200 OK` | `400`, `404`, `500` |

### Categories (`/categories`)
| Method | Endpoint | Description | Success Code | Error Codes |
|---|---|---|---|---|
| `GET` | `/categories` | Retrieve all categories | `200 OK` | `500` |
| `GET` | `/categories/:id` | Retrieve a single category by MongoDB ObjectId | `200 OK` | `400`, `404`, `500` |
| `POST` | `/categories` | Create a new category with validated 4-field payload | `201 Created` | `400`, `500` |
| `PUT` | `/categories/:id` | Replace / update category by MongoDB ObjectId | `204 No Content` | `400`, `404`, `500` |
| `DELETE` | `/categories/:id` | Delete category by MongoDB ObjectId | `200 OK` | `400`, `404`, `500` |

### Documentation & Home
- `GET /` — API greeting, status, and navigation links
- `GET /api-docs` — Interactive Swagger UI documentation (works on localhost and Render)

---

## 🛡️ Error Handling & Validation

Every route is protected with `try / catch` blocks and strict parameter validation:
1. **Invalid ID Format (`400 Bad Request`)**: When an `:id` parameter does not match a valid 24-hex-character MongoDB `ObjectId`, an error is returned:
   ```json
   { "error": "Invalid product ID format" }
   ```
2. **Missing or Invalid Fields (`400 Bad Request`)**: When payload fields are missing or have invalid data types:
   ```json
   {
     "error": "Validation failed",
     "details": [
       "price is required and must be a positive number",
       "rating is required and must be a number between 0 and 5"
     ]
   }
   ```
3. **Not Found (`404 Not Found`)**: When a requested ID does not match any record in the database:
   ```json
   { "error": "Product not found" }
   ```
4. **Server / Database Exceptions (`500 Internal Server Error`)**: Unhandled or database connection exceptions return a standard 500 status code with sanitized error messages.

---

## 🛠️ Local Installation & Development

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd marketeer
npm install
```

### 2. Configure Environment Variables
Create a local `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Populate `.env` with your MongoDB connection string:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=marketeer_db
HOST=localhost:3000
```
> ⚠️ **Security Notice:** The `.env` file contains sensitive database credentials and is strictly excluded via `.gitignore`. Never commit `.env` to GitHub.

### 3. Generate Swagger Documentation
```bash
npm run swagger
```

### 4. Run Server
- Production mode:
  ```bash
  npm start
  ```
- Development mode (with live reload):
  ```bash
  npm run dev
  ```
- Access interactive documentation:
  [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🌐 Render Deployment Guide

1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), create a new **Web Service**.
3. Connect your GitHub repository.
4. Set configurations:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. In the **Environment Variables** tab, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `DB_NAME`: `marketeer_db`
   - `HOST`: Your Render domain (e.g. `marketeer-api.onrender.com`)
6. Ensure MongoDB Atlas Network Access permits connections from any IP (`0.0.0.0/0`) for Render.
7. Deploy the service and verify `/api-docs` renders and executes requests against MongoDB.

