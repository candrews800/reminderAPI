#!/bin/bash

cd /opt/important_date_reminders/api

npm install forever -g
NODE_PATH=. forever start server.js