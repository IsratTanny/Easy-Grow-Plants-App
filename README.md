# Easy Grow Plants - Django Application

A comprehensive web platform for plant e-commerce, IoT device management, and AI integration.

## Project Structure

```
Easy Grow Plants/
├── backend/
│   ├── core/
│   │   ├── config/          # Django settings and URLs
│   │   └── manage.py        # Django management (legacy location)
│   ├── apps/
│   │   ├── users/           # Custom User model and authentication
│   │   ├── marketplace/     # Plant listings and orders
│   │   └── iot/             # IoT devices and readings
│   ├── microservice/        # FastAPI for IoT/AI endpoints
│   └── db.sqlite3           # SQLite database
├── frontend/                # React + Vite frontend (optional)
├── .venv/                   # Python virtual environment
├── manage.py                # Root-level Django management script
├── requirements.txt         # Python dependencies
└── run.bat                  # One-click startup script
```

## Quick Start

### Option 1: One-Click Launch (Windows)
Simply double-click `run.bat` or run:
```bash
.\run.bat
```

This will automatically:
1. Check Python installation
2. Activate virtual environment
3. Install dependencies
4. Run database migrations
5. Start the Django server at http://localhost:8000

### Option 2: Manual Setup

1. **Create and activate virtual environment:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Start the server:**
```bash
python manage.py runserver 8000
```

## Features

### Backend (Django + DRF)
- **User Management**: Custom user model with roles (Admin, Seller, Buyer)
- **Authentication**: JWT-based authentication
- **Marketplace**: Plant listings, orders, and inventory management
- **IoT Integration**: Device management and sensor readings
- **RESTful API**: Complete API for frontend integration

### Microservice (FastAPI)
- **IoT Endpoints**: Sensor data ingestion and pump control
- **AI Mock**: Plant health diagnosis and expert chat

### Frontend (React)
- Landing page with features showcase
- User authentication (login/register)
- Marketplace with plant browsing
- Buyer dashboard with IoT monitoring
- Seller dashboard with inventory management

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - Login (returns JWT tokens)
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info

### Marketplace
- `GET /api/plants/` - List all plants
- `POST /api/plants/` - Create plant (sellers only)
- `GET /api/orders/` - List user orders
- `POST /api/orders/checkout/` - Create order

### IoT
- `GET /api/devices/` - List user devices
- `POST /api/devices/` - Register new device

### Microservice (Port 8001)
- `POST /api/sensor-data` - Submit sensor readings
- `GET /api/control-pump/{device_id}` - Toggle water pump
- `POST /api/chat` - Chat with AI plant expert
- `POST /api/diagnose` - Diagnose plant health

## Admin Panel

Access the Django admin at http://localhost:8000/admin

Create a superuser:
```bash
python manage.py createsuperuser
```

## Technology Stack

- **Backend**: Django 6.0, Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT (SimpleJWT)
- **Microservice**: FastAPI, Uvicorn
- **Frontend**: React 18, Vite, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Development

### Running Backend Only
```bash
python manage.py runserver 8000
```

### Running Microservice
```bash
uvicorn backend.microservice.main:app --reload --port 8001
```

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```

## Notes

- The `run.bat` script focuses on the Django backend only
- For full-stack development, run backend, microservice, and frontend separately
- Frontend requires Node.js to be installed
- Database migrations are automatically applied on startup via `run.bat`
