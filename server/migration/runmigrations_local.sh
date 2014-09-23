#!/bin/bash

export NODE_ENV=local
../node_modules/mongodb-migrations/bin/mm --config=mm-config.js
export NODE_ENV=local