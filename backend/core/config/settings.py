from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables from a .env file at the repo root (if present), so
# secrets like the Gemini API key can be configured without exporting vars.
try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR.parent / '.env')
except ImportError:
    pass
# backend/core/config/settings.py -> backend/core/config -> backend/core -> backend -> BASE_DIR should be 'backend' usually project root.
# Actually standard is BASE_DIR is where manage.py is.
# My manage.py is in backend/core.
# So BASE_DIR = backend/core.
# But I moved apps to backend/apps.
# So I need to add backend/apps to sys.path or configure apps with full path.
# I used 'backend.apps.users' in INSTALLED_APPS so it should be fine if 'backend' is in python path.
# backend is the parent of core.
# If manage.py is in core, sys.path[0] is core.
# I need to add parent directory to sys.path.

import sys
import os

# core is at backend/core. We want to be able to import backend.apps...
# So we need 'd:/Easy Grow Plants' in sys.path?
# Or 'd:/Easy Grow Plants/backend'?
# if we do 'backend.apps.users', we need 'd:/Easy Grow Plants' in sys.path.
sys.path.append(str(BASE_DIR.parent)) 

SECRET_KEY = 'django-insecure-change-me-in-production'

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # Local
    'backend.apps.users',
    'backend.apps.marketplace',
    'backend.apps.iot',
    'backend.apps.plant_care',
    'backend.apps.support',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # CORS first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

LANGUAGES = [
    ('en', 'English'),
    ('bn', 'Bengali'),
]

USE_TZ = True

# Static files configuration
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR.parent / 'staticfiles'

STATICFILES_DIRS = [
    BASE_DIR.parent / 'frontend' / 'dist',
]

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR.parent / 'media'

AUTH_USER_MODEL = 'users.CustomUser'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True  # Enable for development ease
CORS_ALLOW_CREDENTIALS = True

# CSRF settings for same-origin requests
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "capacitor://localhost",
    "http://localhost",
]

# Allow large image uploads for AI processing (50 MB limit)
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50 MB

# Gemini API — used server-side for plant detection + chatbot + care guides.
# Configure the key in the repo-root .env (GEMINI_API_KEY=...); never hard-code it.
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-2.5-flash-lite')

# Force reload at 04/08/2026 11:21:28
# Reload
# Emergency Reload
