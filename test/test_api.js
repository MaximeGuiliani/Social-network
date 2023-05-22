import supertest from "supertest";
import app from "../app.js";
import chai from "chai";
const expect = chai.expect;

describe("API routes", () => {
  let token = null; // Declare token with a default value of null

  beforeEach(async () => {
    // Log in user to get authentication token
    const response = await supertest(app).post("/users/login").send({
      email: "test@mail.com",
      password: "password",
    });
    token = response.body.token; // Update the value of token
  });

  describe("User API routes", () => {
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

    describe("POST /users/signup second test", () => {
      it("should create a 2nd new user", async () => {
        const response = await supertest(app).post("/users/signup").send({
          username: "maxime",
          email: "maxime@mail.com",
          password: "maxime",
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
        const response = await supertest(app).get("/users").query("params", {
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

    // describe("DELETE /users/:userName", () => {
    //   it("should delete a user", async () => {
    //     const response = await supertest(app)
    //       .delete("/users/testuser")
    //       .set("Authorization", `Bearer ${token}`);
    //     expect(response.statusCode).to.equal(200);
    //     expect(response.body).to.have.property("deletedUser");
    //     expect(response.body.deletedUser).to.be.an("object");
    //   });
    // });
  });

  describe("Event API routes", () => {
    describe("GET /events ", () => {
      it("should get all events", async () => {
        const response = await supertest(app).get("/events");
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property("message");
        expect(response.body).to.have.property("events");
        expect(response.body.events).to.be.an("array");
      });
    });

    describe("GET /events related to user", () => {
      it("should get all events related to user", async () => {
        /*
         */
        const response = await supertest(app).get("/events").query("params", {
          eventId: 1,
          include_organizer: true,
          include_candidates: true,
          include_participants: true,
          include_notes: true,
          include_messages: true,
        });
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property("message");
        expect(response.body).to.have.property("events");
        expect(response.body.events).to.be.an("array");
      });
    });

    describe("POST /events/create ", () => {
      it("should create an event", async () => {
        const response = await supertest(app)
          .post("/events/create")
          .set("Authorization", `Bearer ${token}`)
          .send({
            participants_number: 23,
            address: {
              street: "gap street",
              city: "GAP",
              country: "France",
              zip: "05000",
            },
            date: "2023-04-26T19:11:16.471Z",
            name: "Basket 1V1",
            description: "1v1 basket ball tournament",
            category: "basket",
            MainCategory: "sport",
          });
        expect(response.statusCode).to.equal(201);
        expect(response.body).to.have.property("message");
        expect(response.body).to.have.property("createdEvent");
        expect(response.body.createdEvent).to.be.an("object");
      });
    });

    describe("PATCH /events ", () => {
      it("should update an event", async () => {
        const response = await supertest(app)
          .patch("/events/1")
          .set("Authorization", `Bearer ${token}`)
          .send({
            participants_number: 10,
            address: {
              street: "gap street",
              city: "GAP",
              country: "France",
              zip: "05000",
            },
            date: "2023-01-26T19:11:16.471Z",
            name: "Basket",
            description: "1v1",
            category: "dada",
            MainCategoryId: 1,
          });
        expect(response.statusCode).to.equal(200);
        console.log(response.body);
        expect(response.body).to.have.property("message");
        expect(response.body).to.have.property("modifiedEvent");
        expect(response.body.modifiedEvent).to.be.an("object");
        expect(response.body.modifiedEvent.id).to.equal(1);
        expect(response.body.modifiedEvent.participants_number).to.equal(10);

        // TODO : fix update adresse
        // expect(response.body.modifiedEvent.address.street).to.equal(
        //   "gap street"
        // );
        // expect(response.body.modifiedEvent.address.city).to.equal("GAP");
        // expect(response.body.modifiedEvent.address.country).to.equal("France");
        // expect(response.body.modifiedEvent.address.zip).to.equal("05000");
        expect(response.body.modifiedEvent.date).to.equal(
          "2023-01-26T19:11:16.471Z"
        );
        expect(response.body.modifiedEvent.name).to.equal("Basket");
        expect(response.body.modifiedEvent.description).to.equal("1v1");
        expect(response.body.modifiedEvent.category).to.equal("dada");
        expect(response.body.modifiedEvent.MainCategoryId).to.equal(1);
      });
    });

    // TODO : fix event related to users avec organizer = null
    describe("GET /events/search ", () => {
      it("should get events with filters", async () => {
        const response = await supertest(app)
          .get("/events/search")
          .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property("message");
        expect(response.body).to.have.property("events");
        expect(response.body.events).to.be.an("array");
      });
    });

    describe("POST /events/:eventId/apply ", () => {
      it("should apply for an events with eventId as id", async () => {
        const response = await supertest(app)
          .post("/events/1/apply")
          .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).to.equal(200);
        expect(response.body.eventId).to.equal(1);
        expect(response.body.UserId).to.equal(1);
        expect(response.body.message).to.equal(
          "Your applications to event with id : 1 has been taken into account"
        );
      });
    });

    describe("POST /events/:eventId/unapply ", () => {
      it("should unapply for an events with eventId as id", async () => {
        const response = await supertest(app)
          .post("/events/1/unapply")
          .set("Authorization", `Bearer ${token}`);
          console.log(response.body)
        expect(response.statusCode).to.equal(200);
        expect(response.body.eventId).to.equal(1);
        expect(response.body.UserId).to.equal(1);
        expect(response.body.message).to.equal(
          "Your unapplications to event with id : 1 has been taken into account"
        );
      });
    });

    // TODO : faire une event à delete pour le test
    // describe("DELETE /events/:eventId ", () => {
    //   it("should delete events with eventId as id", async () => {
    //     const response = await supertest(app).delete("/events/1").set("Authorization", `Bearer ${token}`);
    //     expect(response.statusCode).to.equal(200);
    //     expect(response.body).to.have.property("message");
    //     expect(response.body.message).to.equal("Deleted event with id : 1");
    //   });
    // });

    
  });
});
