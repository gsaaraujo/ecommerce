import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

describe("add-product-to-cart-controller", () => {
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    prismaClient = new PrismaClient();
    await prismaClient.cartItem.deleteMany();
    await prismaClient.cart.deleteMany();
  });

  it("should add a product to the cart", async () => {
    const sut = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "9fb939ac-aa11-4c13-8a7d-dbd9a9b7e261",
        productId: "aaa769f6-ebe2-45b1-8e26-bc10a18208a9",
        quantity: 2,
        unitPrice: 12.5,
      });

    expect(sut.status).toBe(201);
    expect(sut.type).toBe("application/json");
    expect(sut.body).toEqual({
      status: "SUCCESS",
      statusCode: 201,
      statusText: "CREATED",
      data: {},
    });
  });

  it("should fail if product is not found", async () => {
    const sut = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5",
        productId: "aaa769f6-ebe2-45b1-8e26-bc10a18208a9",
        quantity: 2,
        unitPrice: 12.5,
      });

    expect(sut.status).toBe(404);
    expect(sut.type).toBe("application/json");
    expect(sut.body).toEqual({
      status: "ERROR",
      statusCode: 404,
      statusText: "NOT_FOUND",
      error: {
        message: "The customer with the ID 'eff8a064-cc3b-41fe-9461-5ee2ef74d1d5' does not exist in our records",
        suggestion: "Please check if the customer ID is correct",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
  });

  it("should fail if customer is not found", async () => {
    const sut = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5",
        productId: "aaa769f6-ebe2-45b1-8e26-bc10a18208a9",
        quantity: 2,
        unitPrice: 12.5,
      });

    expect(sut.status).toBe(404);
    expect(sut.type).toBe("application/json");
    expect(sut.body).toEqual({
      status: "ERROR",
      statusCode: 404,
      statusText: "NOT_FOUND",
      error: {
        message: "The customer with the ID 'eff8a064-cc3b-41fe-9461-5ee2ef74d1d5' does not exist in our records",
        suggestion: "Please check if the customer ID is correct",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
  });

  it("should fail if properties are missing", async () => {
    const sut1 = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({});

    const sut2 = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({ customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5" });

    const sut3 = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({ customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5", productId: "aaa769f6-ebe2-45b1-8e26-bc10a18208a9" });

    const sut4 = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5",
        productId: "aaa769f6-ebe2-45b1-8e26-bc10a18208a9",
        quantity: 2,
      });

    expect(sut1.status).toBe(400);
    expect(sut2.status).toBe(400);
    expect(sut3.status).toBe(400);
    expect(sut4.status).toBe(400);
    expect(sut1.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "customerId is required, productId is required, quantity is required, unitPrice is required",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
    expect(sut2.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "productId is required, quantity is required, unitPrice is required",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
    expect(sut3.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "quantity is required, unitPrice is required",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
    expect(sut4.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "unitPrice is required",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
  });

  it("should fail if properties types are wrong", async () => {
    const sut1 = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: 123,
        productId: 123,
        quantity: "2",
        unitPrice: "12.50",
      });

    const sut2 = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5",
        productId: 123,
        quantity: "2",
        unitPrice: "12.50",
      });

    const sut3 = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5",
        productId: "aaa769f6-ebe2-45b1-8e26-bc10a18208a9",
        quantity: "2",
        unitPrice: "12.50",
      });

    const sut4 = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5",
        productId: "aaa769f6-ebe2-45b1-8e26-bc10a18208a9",
        quantity: 2,
        unitPrice: "12.50",
      });

    expect(sut1.status).toBe(400);
    expect(sut2.status).toBe(400);
    expect(sut3.status).toBe(400);
    expect(sut4.status).toBe(400);
    expect(sut1.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message:
          "customerId must be string, productId must be string, quantity must be number, unitPrice must be number",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
    expect(sut2.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "productId must be string, quantity must be number, unitPrice must be number",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
    expect(sut3.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "quantity must be number, unitPrice must be number",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
    expect(sut4.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "unitPrice must be number",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
  });

  it("should fail if customerId is not an uuid", async () => {
    const sut = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "123",
        productId: "aaa769f6-ebe2-45b1-8e26-bc10a18208a9",
        quantity: 2,
        unitPrice: 12.5,
      });

    expect(sut.status).toBe(400);
    expect(sut.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "customerId must be uuid",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
  });

  it("should fail if productId is not an uuid", async () => {
    const sut = await request("http://localhost:3000")
      .post("/carts/add-product")
      .set("Content-Type", "application/json")
      .send({
        customerId: "eff8a064-cc3b-41fe-9461-5ee2ef74d1d5",
        productId: "123",
        quantity: 2,
        unitPrice: 12.5,
      });

    expect(sut.status).toBe(400);
    expect(sut.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "productId must be uuid",
        path: "/carts/add-product",
        timestamp: expect.any(String),
      },
    });
  });
});
