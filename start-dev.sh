#!/bin/bash
PORT=8080
PID=$(lsof -ti tcp:$PORT)
if [ ! -z "$PID" ]; then
  echo "Port $PORT is busy. Killing process $PID..."
  kill -9 $PID
  sleep 1
fi
pnpm dev 