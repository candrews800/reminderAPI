#!/bin/bash

# calc_remind_on_lib NPM INSTALL
cd $BASE_PATH/modules/calc_remind_on_lib
npm install

# Symbolic link /modules/calc_remind_on_lib to api/
# ln -s $BASE_PATH/seeder $BASE_PATH/api/seeds