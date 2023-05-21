import supertest from "supertest";
import app from "../../app.js";
import chai from "chai";
const expect = chai.expect;

describe("User API routes", () => {
  let token = null; // Declare token with a default value of null

  beforeEach(async () => {
    // Log in user to get authentication token
    const response = await supertest(app).post("/users/login").send({
      email: "test@mail.com",
      password: "password",
    });
    token = response.body.token; // Update the value of token
  });

  describe("POST /users/signup", () => {
    it("should create a new user", async () => {
      const response = await supertest(app).post("/users/signup").send({
        username: "testuser",
        email: "test@mail.com",
        bio: "ceci est une bio",
        password: "password",
      });

      expect(response.statusCode).to.equal(201);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("code");
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.equal("User created");
      expect(response.body).to.have.property("User");
    });
  });

  describe("POST /users/login", () => {
    it("should login a user", async () => {
      const response = await supertest(app).post("/users/login").send({
        email: "test@mail.com",
        password: "password",
      });
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("code");
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.equal("Auth successful");
      expect(response.body).to.have.property("token");
      expect(response.body).to.have.property("user");
    });
  });

  describe("GET /users", () => {
    it("should return a list of all users", async () => {
      const response = await supertest(app).get("/users");
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("code");
      expect(response.body).to.have.property("users");
      expect(response.body.users).to.be.an("array");
    });
  });

  describe("PATCH /users/:userName", () => {
    it("should update a user's information", async () => {
      const response = await supertest(app)
        .patch("/users/testuser")
        .set("Authorization", `Bearer ${token}`)
        .send({
          bio: "ceci est une bio modifié",
        });
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property("updatedUser");
      expect(response.body.updatedUser).to.be.an("object");
    });
  });

  describe("GET /users  related to events", () => {
    it("should return a list of all users related to events", async () => {
      // use query parameters
      const int = 1;
      const response = await supertest(app)
        .get("/users")
        .query("params", {
          id: 1,
          include_organizedEvents: true,
          include_candidateEvents: true,
          include_participantEvents: true,
          include_givenNotes: true,
          include_receivedNotes: true,
          include_messages: true,
        });
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("code");
      expect(response.body).to.have.property("users");
      expect(response.body.users).to.be.an("array");
    });
  });

  describe("DELETE /users/:userName", () => {
    it("should delete a user", async () => {
      const response = await supertest(app)
        .delete("/users/testuser")
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property("deletedUser");
      expect(response.body.deletedUser).to.be.an("object");
    });
  });
});
