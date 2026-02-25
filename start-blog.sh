#!/bin/bash

echo "Starting Personal Blog Application..."
echo ""

echo "Starting Backend Server..."
npm run dev &

echo "Waiting for backend to initialize..."
sleep 3

echo "Starting Frontend Client..."
cd client && npm start &

echo ""
echo "Both servers are starting up..."
echo "Backend will run on: http://localhost:3002"
echo "Frontend will run on: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for user interrupt
wait