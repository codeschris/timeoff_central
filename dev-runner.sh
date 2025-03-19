#!/bin/bash

# This script is used to run the development server
cd timeoff_frontend
npm run dev &

cd ../timeoff_backend
./manage.py runserver &

wait