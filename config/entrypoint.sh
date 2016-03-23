#!/bin/bash

bundle install
npm install
make build

bundle exec puma -C ./app/config/puma.rb
