"use strict";
/** Simple shopping cart app
*/

const express = require("express");
const app = express();

//Array?
const { items } = require("./fakeDb");

// useful error class to throw
const { NotFoundError, BadRequestError } = require("./expressError");

app.use(express.json())

/** Returns list of shopping items */
app.get('/items', function (req, res){
  return res.json({"items": items});
});


/** Adds an item to the shopping cart
 * returns a confirmation that item was added. 
 */
app.post('/items', function (req, res){
  items.push(req.body);
  return res.json({"added": req.body});
});


/** Returns an individual item 
 * Throws a Not Found Error if item is not in list. 
*/
app.get('/items/:name', function (req, res){
  const item = items.find(i => i.name === req.params.name);

  if (!item) {
    throw new NotFoundError("Item not found");
  }
  return res.json(item);

});


/** Updates information about an item in the list
 * Throws a Not Found Error if item is not in the list.
 */
app.patch('/items/:name', function (req, res){
  const itemIdx = items.findIndex(idx => idx.name === req.params.name);

  if (itemIdx === -1) {
    throw new NotFoundError("Item not found");
  }

  if (req.body.name){
    items[itemIdx].name = req.body.name;
  }

  if (req.body.price){
    items[itemIdx].price = req.body.price;
  }

  return res.json({"updated": items[itemIdx]});
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