'use strict';

const express = require('express');
const routes  = require('./routes');
const app     = express();
const exphbs  = require('express-handlebars');

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/', express.static(__dirname + '/public/'));

app.get('/', routes.index);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});