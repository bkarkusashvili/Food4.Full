#!/bin/sh
cd $(dirname $0)
git fetch --all
git reset --hard origin/master
npm install
systemctl --user stop food4
npm run build
systemctl --user reload-or-restart food4
