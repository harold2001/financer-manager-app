# Personal Finance Manager 💰

A comprehensive personal finance management application built with React Router, TypeScript, and Firebase. Track your income, expenses, and gain valuable insights into your financial habits with detailed reporting and analytics.

## 🎯 Project Overview

This full-stack finance application provides users with a complete solution for managing their personal finances. Built with modern web technologies, it offers a responsive and intuitive interface for tracking transactions, categorizing expenses, and generating detailed financial reports.

### Key Features

- 💳 **Transaction Management**: Create, edit, and delete income and expense transactions
- 📊 **Financial Reports**: Comprehensive dashboard with spending analysis and category breakdowns
- 📅 **Date Range Filtering**: Custom date ranges for detailed period analysis
- 🎨 **Interactive Charts**: Visual representation of spending patterns and trends
- 🔐 **User Authentication**: Secure Firebase authentication system
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🏷️ **Smart Categorization**: Pre-defined categories for common transaction types
- 💡 **Financial Insights**: Savings rate calculation and daily spending averages

### Architecture

**Frontend (React Router + TypeScript)**

- Modern React with TypeScript for type safety
- React Router for client-side routing and navigation
- TanStack Query for efficient server state management
- React Hook Form with Zod validation for form handling
- Tailwind CSS + shadcn/ui for consistent styling
- Zustand for authentication state management

**Backend (FastAPI + Python)**

- FastAPI REST API for transaction and user management
- Firebase Authentication integration
- Pydantic models for data validation
- Comprehensive CRUD operations for transactions

**Database & Authentication**

- Firebase Authentication for secure user management
- Firestore for real-time data storage and synchronization

## Technical Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 🔥 Firebase integration
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Firebase project with Authentication and Firestore enabled
- Python 3.8+ (for the API backend)

### Installation

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd finance-app
```

2. **Install frontend dependencies:**

```bash
npm install
# or
pnpm install
```

3. **Set up Firebase:**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database
   - Copy your Firebase config to `app/lib/firebase.ts`

4. **Install and run the backend API:**

```bash
cd ../finance-api
pip install -r requirements.txt
uvicorn main:app --reload
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.
The API will be running at `http://localhost:8000`.

## Project Structure

```
finance-app/
├── app/
│   ├── api/                    # API integration layer
│   ├── components/             # Reusable UI components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and configurations
│   ├── routes/                # Page components
│   ├── store/                 # State management
│   └── transactions/          # Transaction-specific components
├── public/                    # Static assets
└── README.md

finance-api/
├── config/                    # Configuration files
├── middleware/               # Authentication middleware
├── models/                   # Data models
├── routers/                  # API route handlers
├── services/                 # Business logic layer
└── utils/                    # Utility functions
```

## Usage

### Managing Transactions

1. **Add Transaction**: Click "Add Transaction" to create income or expense entries
2. **Edit Transaction**: Click the edit icon on any transaction to modify it
3. **Delete Transaction**: Use the delete button with confirmation dialog
4. **View Reports**: Navigate to Reports page for financial insights

### Financial Reports

- **Summary Cards**: View total income, expenses, net balance, and transaction count
- **Category Analysis**: See spending breakdown by category with visual progress bars
- **Date Filtering**: Select custom date ranges for detailed analysis
- **Financial Insights**: Monitor savings rate and daily spending averages

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

## API Integration

The frontend integrates with a FastAPI backend that provides:

- User authentication endpoints
- CRUD operations for transactions
- Data validation and error handling
- Firebase integration for secure data storage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React Router, TypeScript, and Firebase.
