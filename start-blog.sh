#!/bin/bash

echo "Starting Personal Blog Application..."
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing Backend Dependencies..."
    npm i --force
else
    echo "Backend dependencies already installed."
fi

echo "Starting Backend Server..."
npm run dev &

echo "Waiting for backend to initialize..."
sleep 3

cd client
if [ ! -d "node_modules" ]; then
    echo "Installing Frontend Dependencies..."
    npm i --force
else
    echo "Frontend dependencies already installed."
fi

echo "Starting Frontend Client..."
npm start &

echo ""
echo "Both servers are starting up..."
echo "Backend will run on: http://localhost:3002"
echo "Frontend will run on: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for user interrupt
wait