#!/usr/bin/env bash

hostname box

apt-get update -y -q
apt-get install build-essential git -y -q

# use fish shell
apt-get install fish -q -y
chsh -s /usr/bin/fish           # for root
chsh -s /usr/bin/fish vagrant   # for vagrant user
/usr/bin/fish /vagrant/fish.sh  # load default setting

# set fish_greeting

apt-get install nodejs npm -y -q
ln -s /usr/bin/nodejs /usr/bin/node

# update npm to current version
npm install -g npm -q


apt-get install mongodb -y -q

# install project dependencys
npm install grunt -g
npm install grunt-cli -g
npm install gulp -g
npm install npm-check-updates -g
npm install bower -g
npm install yo -g
npm install generator-webapp -g
npm install generator-angular -g
npm install modulus -g
npm install supervisor -g

# execute as vagrant user
sudo -u vagrant -H bash -c "\
/usr/bin/fish /vagrant/fish.sh;\
cd /vagrant;\
./install.sh\
"

echo ""
echo ":-) Done (-:"
echo "Login with:"
echo "$ vagrant ssh"
