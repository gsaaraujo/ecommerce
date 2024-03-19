import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

describe("sign-up-with-email-and-password", () => {
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    prismaClient = new PrismaClient();
    await prismaClient.customer.deleteMany();
  });

  it("should sign up", async () => {
    const sut = await request("http://localhost:3000")
      .post("/auth/sign-up-with-email-and-password")
      .set("Content-Type", "application/json")
      .send({
        name: "Edward Elric",
        email: "edward.elric@gmail.com",
        password: "123456",
      });

    const customer = await prismaClient.customer.findUnique({ where: { email: "edward.elric@gmail.com" } });

    expect(sut.status).toBe(201);
    expect(sut.type).toBe("application/json");
    expect(sut.body).toEqual({
      status: "SUCCESS",
      statusCode: 201,
      statusText: "CREATED",
      data: {},
    });
    expect(customer).not.toBeNull();
  });

  it("should fail if already exists a customer with this email", async () => {
    await prismaClient.customer.create({
      data: {
        id: "4398df6a-776c-4e34-9db7-4163e6835dbf",
        name: "Edward Elric",
        email: "edward.elric@gmail.com",
        password: "$2b$10$S0yaEwFJh9rTz36XJiyXZOjDWrgYJgAe1JhrtGU.6Rb.NYbO8wppe",
      },
    });

    const sut = await request("http://localhost:3000")
      .post("/auth/sign-up-with-email-and-password")
      .set("Content-Type", "application/json")
      .send({
        name: "Edward Elric",
        email: "edward.elric@gmail.com",
        password: "123456",
      });

    expect(sut.status).toBe(409);
    expect(sut.type).toBe("application/json");
    expect(sut.body).toEqual({
      status: "ERROR",
      statusCode: 409,
      statusText: "CONFLICT",
      error: {
        message: "A customer with the email 'edward.elric@gmail.com' already exists in our records",
        suggestion: "Please use a different email address to sign up",
        path: "/auth/sign-up-with-email-and-password",
        timestamp: expect.any(String),
      },
    });
  });

  it("should fail if any of the properties is missing", async () => {
    const sut = await request("http://localhost:3000")
      .post("/auth/sign-up-with-email-and-password")
      .set("Content-Type", "application/json")
      .send({});

    expect(sut.status).toBe(400);
    expect(sut.type).toBe("application/json");
    expect(sut.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "name is required, email is required, password is required",
        path: "/auth/sign-up-with-email-and-password",
        timestamp: expect.any(String),
      },
    });
  });

  it("should fail if properties types are wrong", async () => {
    const sut = await request("http://localhost:3000")
      .post("/auth/sign-up-with-email-and-password")
      .set("Content-Type", "application/json")
      .send({
        name: 123,
        email: 123,
        password: 123,
      });

    expect(sut.status).toBe(400);
    expect(sut.type).toBe("application/json");
    expect(sut.body).toEqual({
      status: "ERROR",
      statusCode: 400,
      statusText: "BAD_REQUEST",
      error: {
        message: "name must be string, email must be string, password must be string",
        path: "/auth/sign-up-with-email-and-password",
        timestamp: expect.any(String),
      },
    });
  });
});
