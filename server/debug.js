#!/usr/bin/env node

console.log('My Debugger with models');
var context = {}  // the available context in the debugger prompt

/////////////////////////
/// Your Code

var server = require('./server');
context.models = require('./models/models.js');


////////////////////////

var repl = require('repl').start('> ');
for (var i in context) {  // copy context to the repl
  repl.context[i] = context[i];
}
require('repl.history')(repl, process.env.HOME + '/.node_history');
