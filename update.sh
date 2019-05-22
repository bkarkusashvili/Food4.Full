#!/bin/sh
cd $(dirname $0)
git reset --hard
git pull
npm install
npm run build
pm2 restart all