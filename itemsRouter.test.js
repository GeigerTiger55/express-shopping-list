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