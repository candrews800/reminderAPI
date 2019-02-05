#!/bin/bash

cd /opt/important_date_reminders/api

npm install knex -g

NODE_PATH=. knex migrate:latest