User Management Dashboard
A modern, responsive User Management System built with React, TypeScript, and Tailwind CSS. This project features a robust modal-driven interface for creating and editing users, handling profile image uploads via multipart/form-data, and managing complex data like multi-select responsibilities and role-based access.

🚀 Features
Dynamic User CRUD: Add and update users with real-time UI synchronization.

Advanced Form Handling:

Image upload with live preview and removal.

Multi-checkbox selection for designations (responsibilities).

Validation for phone numbers, emails, and required fields.

Tech Stack Integration:

Zustand: For global authentication and state management.

Axios: Centralized API configuration with request/response interceptors.

Lucide React: For a clean, modern iconography.

Sonner: Toast notifications for user feedback.

Responsive Design: Built using Tailwind CSS for a seamless experience across mobile, tablet, and desktop.

🛠️ Installation
Clone the repository

Bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Install dependencies

Bash
npm install
Environment Setup
Create a .env file in the root directory and add your API URL:

Code snippet
VITE_API_URL=http://your-backend-api.com/api
Start the development server

Bash
npm run dev
📂 Project Structure
Plaintext
src/
├── components/       # Reusable UI components (Modal, Input, Button)
├── services/         # API service layers (userService.ts)
├── pages/            # Each page component (folder per page)
├── store/            # State management (useAuthStore.ts)
├── types/            # TypeScript interfaces/types
├── lib/              # Utility functions (cn for Tailwind merging)
└── api/              # Axios instance and interceptors
🔌 API Integration
The project uses a centralized Axios instance located in src/api/api.ts.

Interceptors
Request: Automatically attaches the Authorization Bearer token and company_id from the Zustand store. It dynamically handles multipart/form-data by ensuring headers are set correctly for FormData objects.

Response: Standardizes error handling and catches custom backend status flags.
