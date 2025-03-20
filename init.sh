#!/bin/bash

# Install dependencies (backend)
cd timeoff_backend
virtualenv .
source bin/activate
pip install -r requirements.txt
./manage.py makemigrations
./manage.py migrate

# Install dependencies (frontend)
cd ../timeoff_frontend
npm install --legacy-peer-deps
