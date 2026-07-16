#!/bin/bash

# Script to start Travel Planner application

echo "Starting Travel Planner..."

# Start backend in background
echo "Starting backend on port 8000..."
cd /Users/venu/Documents/GitHub/farmapp/backend
python3 main.py &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend
echo "Starting frontend on port 5173..."
cd /Users/venu/Documents/GitHub/farmapp/frontend
npm run dev &
FRONTEND_PID=$!

# Store PIDs
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Wait for processes to complete
wait $BACKEND_PID $FRONTEND_PID
