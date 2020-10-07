const express = require('express');
const config = require('config');

const app = express();

const PORT = config.get('port');

app.listen(5000, () => console.log('App has been started...'));