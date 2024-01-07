#!/bin/bash
# Change to the project directory
cd my-kasaba-nextjs

git stash
# Pull the latest changes from the GitHub repository
git pull

# Install any new dependencies
npm install
npm run build
# Restart the Next.js server (if it's running)
npm run bg