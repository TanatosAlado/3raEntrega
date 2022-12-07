const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;
const axios = require("axios");
const url = "http://localhost:8080";

const request = supertest(url);

describe("Test Productos", () => {
  let producto;
  let productoNuevo;
  beforeEach(() => {
    producto = {
      nombre: "Gran Enemigo",
      precio: 7890,
      foto: "gintest.png",
      descripcion: "Un vino que apapacha el alma ",
      stock: 6,
      codigo: ene223,
    };
  });

  it("getAllProds", async () => {
    const response = await axios.get(`${url}/mongoproductos`);
    expect(response.status).to.eql(200);
    expect(response.data).to.be.an("array");
    expect(response.data).to.not.be.undefined;
  });

  it("Deberia agregar un nuevo prod", async () => {
    const response = await axios.post(`${url}/mongoproductos`, producto);

    const body = response.data;
    expect(response.status).to.eql(200);
    expect(body).to.include.keys('nombre', 'precio', 'foto', 'descripcion', 'stock', 'codigo');
    expect(body.nombre).to.eql(producto.nombre)
   
  });
});