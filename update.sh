#!/bin/sh
cd $(dirname $0)
git fetch --all
git reset --hard origin/master
npm install
npm run build
systemctl --user restart food4