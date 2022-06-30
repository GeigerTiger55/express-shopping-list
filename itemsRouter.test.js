"use strict";

const app = require("./app");
const request = require("supertest");

const { items } = require("./fakeDb");



console.log('*********items', items);

describe("GET /items", function() {

  test("Gets list of items", async function() {
    items.push({ name: "cheerios", price: 6.70},
      { name: "popsicles", price: 1.62});

    const itemsList = [
      { name: "cheerios", price: 6.70},
      { name: "popsicles", price: 1.62}
    ];

    const resp = await request(app).get('/items');
    expect(resp.body).toEqual({"items" :itemsList});
  });

  test("Returns error if no items", async function() {
    items.splice(0,items.length);
    const resp = await request(app).get('/items');

    expect(resp.statusCode).toEqual(404);
  });

});

describe ("POST /items", function(){

  test ("Adds an item to the shopping cart", async function(){
    const resp = await request(app).post('/items').send({
      name : "milk",
      price: "12.00"
    });

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      "added": {
        "name" : "milk",
        "price": "12.00"
      }});
    
    expect(items).toEqual([{"name": "milk", "price": "12.00"}]);
  });

  test("Returns error if missing item name information", async function(){
    const resp = await request(app).post('/items').send({
      "blah" : "blah",
      "price" : "1200.00"
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("Returns error if missing item price information", async function(){
    const resp = await request(app).post('/items').send({
      "blah" : "blah",
      "name" : "Beaver"
    });
    expect(resp.statusCode).toEqual(400);
  });
});

describe ("GET /items/:name", function(){
  
  test("Get a single item from the list", async function(){
    items.push({ name: "cheerios", price: 6.70},
      { name: "popsicles", price: 1.62});

    const item = {name: "cheerios", price: 6.70};

    const resp = await request(app).get(`/items/cheerios`);
    expect(resp.body).toEqual(item);
  });
});