#!/bin/bash

# INSTALL NODE
if ! type -P node
then
    echo "downloading node..."
    curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    echo "installing node..."
    sudo apt-get install -y nodejs
else
    echo "node already installed."
fi