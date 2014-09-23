#!/bin/bash

export NODE_ENV=developmentmodulus
../node_modules/mongodb-migrations/bin/mm --config=mm-config.js
export NODE_ENV=local