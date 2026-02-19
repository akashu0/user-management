# 👥 User Management Dashboard

A modern, responsive **User Management System** built with **React**, **TypeScript**, and **Tailwind CSS**. Features a clean modal-driven interface for creating and editing users, profile image uploads, multi-select responsibilities, and role-based access control.

---

## 🚀 Features

- **Full User CRUD** — Add, edit, and delete users with real-time UI sync
- **Smart Form Handling**
  - Profile image upload with live preview and deletion (with confirmation)
  - Multi-checkbox selection for designations / responsibilities
  - Validation for name, email, phone, and required fields
- **API Integration via Axios** — Centralized instance with request/response interceptors
- **Global State** — Zustand for auth and shared state management
- **Toast Notifications** — User feedback via Sonner
- **Fully Responsive** — Seamless experience across mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling & responsive design |
| **Axios** | HTTP client & API layer |
| **Zustand** | Global state management |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |
| **Vite** | Build tool & dev server |

---

## ⚙️ Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

**2. Install dependencies**

```bash
npm install
```

**3. Environment setup**

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://your-backend-api.com/api
```

**4. Start the development server**

```bash
npm run dev
```

---

## 📂 Project Structure

```
src/
├── api/              # Axios instance and interceptors
├── components/       # Reusable UI components (Modal, Input, Button, ConfirmModal)
├── pages/            # Page-level components (one folder per page)
├── services/         # API service layers (userService.ts)
├── store/            # Zustand state management (useAuthStore.ts)
├── types/            # TypeScript interfaces and types
└── lib/              # Utility functions (cn for Tailwind class merging)
```

---

## 🔌 API Integration

All requests go through a centralized Axios instance at `src/api/api.ts`.

### Interceptors

**Request interceptor** automatically:
- Attaches the `Authorization: Bearer <token>` header from Zustand store
- Injects the `company_id` into every request
- Handles `multipart/form-data` headers dynamically for `FormData` payloads

**Response interceptor** handles:
- Standardized error formatting
- Custom backend `status` flag detection

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/user` | Fetch all users |
| `GET` | `/user/:id` | Fetch single user |
| `POST` | `/user` | Create new user |
| `POST` | `/user/:id` *(+ `_method: PUT`)* | Update user |
| `DELETE` | `/user/:id` | Delete user |
| `DELETE` | `/user/:id/image` | Delete user profile image |

---

## 📋 Form Data Structure

When creating or updating a user, data is sent as `multipart/form-data`:

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Required |
| `email` | `string` | Required, validated |
| `role` | `string` | Role ID, required |
| `title` | `string` | Job title |
| `phone` | `string` | 10–15 digits |
| `initials` | `string` | e.g. `JD` |
| `responsibilities` | `JSON string` | e.g. `["id1", "id2"]` |
| `overwrite_data` | `0` or `1` | `0` for create, `1` for update |
| `user_picture` | `File` | Optional image upload |
| `_method` | `PUT` | Edit mode only (method spoofing) |

---

