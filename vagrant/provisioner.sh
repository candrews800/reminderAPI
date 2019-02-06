#!/bin/bash

# APT-GET UPDATE
sudo apt-get update

cd /opt/important_date_reminders/vagrant

source ../app.conf

/bin/bash ./provisioners/node.sh

/bin/bash ./provisioners/api.sh

/bin/bash ./provisioners/postgres.sh

/bin/bash ./provisioners/migrations.sh

/bin/bash ./provisioners/start-services.sh