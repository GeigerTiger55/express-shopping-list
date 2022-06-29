"use strict";
/** Simple shopping cart app
*/

const express = require("express");
const app = express();

//Array?
const { items } = require("./fakeDb");

// useful error class to throw
const { NotFoundError, BadRequestError } = require("./expressError");

/** Returns list of shopping items */
app.get('/items', function (req, res){
  return res.json({"items": items});
});

/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});



module.exports = app;