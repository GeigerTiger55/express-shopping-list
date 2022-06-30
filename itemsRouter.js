"use strict";
const express = require('express');
const { items } = require("./fakeDb");
const router = new express.Router();

const { NotFoundError, BadRequestError } = require("./expressError");

const ERROR_MESSAGE = "Item not found."


/** Returns list of shopping items:
 *    { items: [
 *       { name: "popsicle", price: 1.45 },
 *       { name: "cheerios", price: 3.40 }
 *    ]}
 */
router.get('/', function (req, res){
  if(items.length <= 0){
    throw new NotFoundError('Not items in your shopping cart!');
  }
  return res.json({"items": items});
});


/** Adds an item to the shopping cart.
 *  Returns a confirmation that item was added: 
 *    {name: "popsicle", price: 1.45} =>
 *        {added: {name: "popsicle", price: 1.45}}
 */
router.post('/', function (req, res){
  if (!req.body.name || !req.body.price){
    throw new BadRequestError("Missing data");
  }
  items.push(req.body);
  return res.json({"added": req.body});
});


/** Returns an individual item 
 * Throws a Not Found Error if item is not in list. 
 * 
 * Returns json:
 *    {name: "popsicle", "price": 1.45}
*/
router.get('/:name', function (req, res){
  const item = items.find(i => i.name === req.params.name);

  if (!item) {
    throw new NotFoundError(ERROR_MESSAGE);
  }
  return res.json(item);

});


/** Updates information about an item in the list
 * Throws a Not Found Error if item is not in the list.
 * 
 * Returns json of updated item:
 * {name: "new popsicle", price: 2.45} =>
 *       {updated: {name: "new popsicle", price: 2.45}}
 */
router.patch('/:name', function (req, res){
  const itemIdx = items.findIndex(idx => idx.name === req.params.name);

  if (itemIdx === -1) {
    throw new NotFoundError(ERROR_MESSAGE);
  }

  if (req.body.name){
    items[itemIdx].name = req.body.name;
  }

  if (req.body.price){
    items[itemIdx].price = req.body.price;
  }

  return res.json({"updated": items[itemIdx]});
});

/** Removes item from list.
 * Throws a Not Found Error if item is not in the list.
 * 
 * Returns:
 *  {message: "Deleted"}
*/
router.delete('/:name', function (req, res){
  const itemIdx = items.findIndex(idx => idx.name === req.params.name);
  
  if (itemIdx === -1) {
    throw new NotFoundError(ERROR_MESSAGE);
  }

  items.splice(itemIdx,1);

  return res.json({"message": "Deleted"});
});

module.exports = router;
