# QUICK START GUIDE

## Running the Application (3 Simple Steps)

### Step 1: Launch the Server
Double-click `run.bat` or open terminal and run:
```
.\run.bat
```

This will automatically:
- ✓ Check Python installation
- ✓ Create/activate virtual environment
- ✓ Install all dependencies
- ✓ Run database migrations
- ✓ Start Django server at http://localhost:8000

### Step 2: Create Admin Account (First Time Only)
Double-click `create_superuser.bat` or run:
```
.\create_superuser.bat
```

Follow the prompts to create your admin username and password.

### Step 3: Access the Application
- **Main Site**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Root**: http://localhost:8000/api/

## What's Available?

### API Endpoints
- `/api/auth/register/` - Register new user
- `/api/auth/login/` - Login (get JWT token)
- `/api/plants/` - Browse plants
- `/api/orders/` - View/create orders
- `/api/devices/` - Manage IoT devices

### User Roles
1. **Buyer** - Can purchase plants, manage IoT devices
2. **Seller** - Can list plants, manage inventory
3. **Admin** - Full system access

## Troubleshooting

**Problem**: "Python is not installed"
- **Solution**: Install Python 3.10+ from python.org

**Problem**: Server won't start
- **Solution**: Check if port 8000 is already in use
- Run: `netstat -ano | findstr :8000` to check

**Problem**: Import errors
- **Solution**: Delete `.venv` folder and run `run.bat` again

## Next Steps

1. Run `run.bat` to start the server
2. Run `create_superuser.bat` to create admin account
3. Visit http://localhost:8000/admin to manage data
4. Use the API endpoints to build your frontend

## Need Help?

Check `README.md` for detailed documentation.
