#!/bin/bash
set -e

echo "🔄 Jackson Trails HOA - Dev Environment Initialization"
echo "=================================================="

# Check if production data exists
if [ -d "/mnt/prod_data" ] && [ "$(ls -A /mnt/prod_data)" ]; then
    echo "📦 Found production data, hydrating dev environment..."

    # Clear existing dev data
    echo "🗑️  Clearing existing dev data..."
    rm -rf /pb/pb_data/*

    # Copy production data to dev
    echo "📋 Copying production data snapshot..."
    cp -r /mnt/prod_data/* /pb/pb_data/

    echo "✅ Dev environment hydrated successfully!"
else
    echo "ℹ️  No production data found. Starting with fresh database."
fi

echo "=================================================="
echo "🚀 Starting PocketBase in development mode..."
echo ""

# Start PocketBase
exec /usr/local/bin/pocketbase serve --http=0.0.0.0:8090
