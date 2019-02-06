#!/bin/bash

cd $BASE_PATH/api

npm install knex -g

NODE_PATH=. knex migrate:latest