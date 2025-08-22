# AutoAudit

AutoAudit is an AI-powered financial operations platform that automates expense management and policy enforcement. 
It uses AI to categorize expenses, flag policy violations, and provide real-time financial insights. 
This project serves as a Minimum Viable Product (MVP) to demonstrate key features of a modern FinTech platform, but has plans for continued improvements

## Features
- User authentication and profile management
- Multi-user roles (Admin, Manager, Employee) with role-based access control
- Automated expense categorization using the OpenAI API
- Customizable policy creation and real-time enforcement to flag out-of-policy expenses
- Bulk expense upload via CSV file processing
- Interactive dashboard with expense analytics and visualizations
- Detailed expense and policy management pages

## Tech Stack
- **Frontend**: React, JavaScript, Tailwind CSS
- **Backend**: FastAPI, Python, PostgreSQL, SQLAlchemy
- **Database**: Neon (for easy setup and development)
- **Authentication**: Firebase
- **AI**: OpenAI API

## Prerequisites
- Python 3.8 or higher
- Node.js 18.x
- npm or Yarn (package manager for Node.js)
- Git (used to clone the repository)
- PostgreSQL (you can use any cloud provider like Neon or run it locally via Docker)

## API Keys
You will need API keys for:
- [Firebase](https://console.firebase.google.com/u/0/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [OpenAI API](https://platform.openai.com/api-keys)

Create a `.env` file in the root of the backend directory with the following content:

```bash
FIREBASE_CREDENTIALS=path/to/your/firebase-adminsdk.json
OPENAI_KEY=your_openai_api_key
DATABASE_URL=your_postgress_connection_string
```

Create a .env file in the root of the frontend directory with the following content:

```bash
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_BACKEND_URL=your_backend_url
```

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/JaylenBradley/AutoAudit.git](https://github.com/JaylenBradley/AutoAudit.git)
cd AutoAudit
```
### 2.Backend Setup
```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

The backend requires a PostgreSQL database. 
You can use Neon, AWS RDS, or any compatible PostgreSQL provider. 
Set your connection string in `DATABASE_URL` in the `.env` file.

### 3. Database Migrations
Once your database is set up, run the migrations from the backend directory to create the tables.
```bash
# Generate a migration (only needed after making model changes)
alembic revision --autogenerate -m "Initial migration"

# Apply the migration
alembic upgrade head
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Running the Application
- Backend (from `backend/`):
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Frontend (from `frontend/`)
```bash
npm run dev
```

## Usage
- Sign up and log in via the web interface
- Register or join a company in your user profile
- Upload expenses individually or in bulk via a CSV file
- Define company policies and view expense analytics in the dashboard
