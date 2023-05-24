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
        expect(response.body.message).to.be.equal("User created");
        expect(response.body.User.id).to.be.equal(1);
        expect(response.body.User.username).to.be.equal("testuser");
        expect(response.body.User.email).to.be.equal("test@mail.com");
        expect(response.body.User.bio).to.be.equal("ceci est une bio");
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
        expect(response.body.message).to.be.equal("User created");
        expect(response.body.User.id).to.be.equal(2);
        expect(response.body.User.username).to.be.equal("maxime");
        expect(response.body.User.email).to.be.equal("maxime@mail.com");
        expect(response.body.User.bio).to.be.equal("");
      });
    });

    describe("POST /users/login", () => {
      it("should login a user", async () => {
        const response = await supertest(app).post("/users/login").send({
          email: "test@mail.com",
          password: "password",
        });
        expect(response.statusCode).to.equal(200);
        expect(response.body.message).to.be.equal("Auth successful");
        expect(response.body.user.id).to.be.equal(1);
        expect(response.body.user.username).to.be.equal("testuser");
        expect(response.body.user.email).to.be.equal("test@mail.com");
        expect(response.body.user.bio).to.be.equal("ceci est une bio");
        expect(response.body.token).to.be.a("string");
      });
    });

    describe("GET /users", () => {
      it("should return a list of all users", async () => {
        const response = await supertest(app).get("/users");
        expect(response.statusCode).to.equal(200);
        expect(response.body.message).to.be.equal(
          "Handling GET requests to /users : returning all users"
        );
        expect(response.body.users).to.be.an("array");
        expect(response.body.users[0].id).to.be.equal(1);
        expect(response.body.users[1].id).to.be.equal(2);
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
        const response = await supertest(app).get("/users").query({
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
        expect(response.body).to.have.property("user");
        expect(response.body.user).to.be.an("object");
        expect(response.body.user).to.have.property("id");
        expect(response.body.user).to.have.property("username");
        expect(response.body.user).to.have.property("email");
        expect(response.body.user).to.have.property("bio");
        expect(response.body.user).to.have.property("organizedEvents");
        expect(response.body.user).to.have.property("candidateEvents");
        expect(response.body.user).to.have.property("participantEvents");
        expect(response.body.user).to.have.property("givenNotes");
        expect(response.body.user).to.have.property("receivedNotes");
        expect(response.body.user).to.have.property("messages");
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
        const response = await supertest(app).get("/events").query({
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
            image_url:"https://img.freepik.com/premium-vector/basketball_319667-191.jpg",
            date: "2024-04-26T19:11:16.471Z",
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
            image_url:"https://img.freepik.com/premium-vector/basketball_319667-191.jpg",
            date: "2025-01-26T19:11:16.471Z",
            name: "Basket",
            description: "1v1",
            category: "dada",
            MainCategoryId: 1,
          });
        expect(response.statusCode).to.equal(200);
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
          "2025-01-26T19:11:16.471Z"
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
        expect(response.statusCode).to.equal(200);
        expect(response.body.eventId).to.equal(1);
        expect(response.body.UserId).to.equal(1);
        expect(response.body.message).to.equal(
          "Your unapplications to event with id : 1 has been taken into account"
        );
      });
    });

    // (POST) /events/:eventId/accept/:userId

    describe("POST /events/:eventId/accept/:userId ", () => {
      it("should accept a candidate for an events with eventId as id", async () => {
        const response = await supertest(app)
          .post("/events/1/accept/1")
          .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).to.equal(200);
        expect(response.body.message).to.equal(
          "Accepted candidate for event with id : 1"
        );
        expect(response.body.accept_candidate[0].EventId).to.equal(1);
        expect(response.body.accept_candidate[0].UserId).to.equal(1);
      });
    });

    // (POST) /events/:eventId/refuse/:userId
    describe("POST /events/:eventId/refuse/:userId ", () => {
      it("should refuse a candidate for an events with eventId as id", async () => {
        await supertest(app)
          .post("/events/1/apply")
          .set("Authorization", `Bearer ${token}`)
          .then(async () => {
            const response = await supertest(app)
              .post("/events/1/refuse/1")
              .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).to.equal(200);
            expect(response.body.message).to.equal(
              "Refused candidate for event with id : 1"
            );
          });
      });
    });

    // (POST) /events/:eventId/unparticipate
    describe("POST /events/:eventId/unparticipate ", () => {
      it("should unparticipate for an events with eventId as id", async () => {
        const response = await supertest(app)
          .post("/events/1/unparticipate")
          .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).to.equal(200);
        expect(response.body.message).to.equal(
          "Unparticipated to event with id : 1"
        );
      });
    });

    // (POST) /events/:eventId/remove/:1
    describe("POST /events/:eventId/remove/:1 ", () => {
      it("should remove a participant for an events with eventId as id", async () => {
        await supertest(app)
          .post("/events/1/accept/1")
          .set("Authorization", `Bearer ${token}`)
          .then(async () => {
            const response = await supertest(app)
              .post("/events/1/remove/1")
              .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).to.equal(200);
            expect(response.body.message).to.equal(
              "Removed participant 1 from event with id : 1"
            );
          });
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

  describe("Categories API routes", () => {
    describe("GET /categories ", () => {
      it("should get all categories", async () => {
        const response = await supertest(app).get("/categories");
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property("message");
        expect(response.body).to.have.property("categories");
        expect(response.body.categories).to.be.an("array");
      });
    });

    describe("GET /categories ", () => {
      it("should get categories by name", async () => {
        const response = await supertest(app).get("/categories").query({
          name: "sport",
        });
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.property("message");
        expect(response.body).to.have.property("categories");
        expect(response.body.categories).to.be.an("array");
      });
    });
  });

  describe("Messages API routes", () => {
    describe("POST /messages ", () => {
      it("should create a new message", async () => {
        const response = await supertest(app).post("/messages").send({
          content: "test message",
          userId: 1,
          eventId: 1,
        });
        expect(response.statusCode).to.equal(201);
        expect(response.body.message).to.equal("Message posted");
        expect(response.body.result.id).to.equal(1);
        expect(response.body.result.userId).to.equal(1);
        expect(response.body.result.eventId).to.equal(1);
      });
    });

    describe("GET /messages/:eventId ", () => {
      it("should get all messages", async () => {
        const response = await supertest(app).get("/messages/1");
        expect(response.statusCode).to.equal(200);
        expect(response.body.messages).to.be.an("array");
      });
    });
  });

  describe("Notes API routes", () => {
    beforeEach(async () => {
      await supertest(app)
        .post("/users/signup")
        .send({
          username: "testevenetparticipant",
          email: "testevenetparticipant@mail.com",
          bio: "ceci est une bio",
          password: "mdp",
        })
        .then(async () => {
          await supertest(app)
            .post("/events/1/accept/2")
            .set("Authorization", `Bearer ${token}`);
        });
    });

    describe("POST /notes ", () => {
      it("should create a new note  from host", async () => {
        const response = await supertest(app)
          .post("/notes/addnotefromhost")
          .set("Authorization", `Bearer ${token}`)
          .send({
            creationDate: "2023-04-26T19:11:16.471Z",
            ownerId: 1,
            eventId: 1,
            targetId: 2,
            value: 2,
            title: "il a tout cassé :(",
            comment: "il a tout cassé :(",
          });
        expect(response.statusCode).to.equal(201);
        expect(response.body.message).to.equal("Note posted");
        expect(response.body.message).to.equal("Note posted");
        expect(response.body.note.id).to.equal(1);
        expect(response.body.note.eventId).to.equal(1);
        expect(response.body.note.ownerId).to.equal(1);
        expect(response.body.note.type).to.equal(1);
        expect(response.body.note.targetId).to.equal(2);
        expect(response.body.note.title).to.equal("il a tout cassé :(");
        expect(response.body.note.comment).to.equal("il a tout cassé :(");
      });
    });

    describe("POST /notes ", () => {
      it("should create a new note from participant", async () => {
        const response = await supertest(app)
          .post("/notes/addnotefromparticipant")
          .set("Authorization", `Bearer ${token}`)
          .send({
            creationDate: "2023-04-26T19:11:16.471Z",
            ownerId: 2,
            eventId: 1,
            value: 2,
            title: "bad host",
            comment: "il a dit que j'ai tout cassé :(",
          });
        expect(response.statusCode).to.equal(201);
        expect(response.body.message).to.equal("Note posted");
        expect(response.body.note.id).to.equal(2);
        expect(response.body.note.eventId).to.equal(1);
        expect(response.body.note.ownerId).to.equal(2);
        expect(response.body.note.type).to.equal(0);
        expect(response.body.note.targetId).to.equal(1);
        expect(response.body.note.title).to.equal("bad host");
        expect(response.body.note.comment).to.equal(
          "il a dit que j'ai tout cassé :("
        );
      });
    });
  });

  describe("complementary API tests", () => {
    describe("GET /users ", () => {
      it("should return a list of all users related to events", async () => {
        const response = await supertest(app).get("/users").query({
          id: 1,
          include_givenNotes: true,
          include_receivedNotes: true,
          include_messages: true,
        });
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an("object");
      });
    });

    describe("GET /events/upcoming ", () => {
      it("should return a list of all upcoming events", async () => {
        const res = await supertest(app).get("/events");

        const response = await supertest(app)
          .get("/events/upcoming")
          .query({ limit: 2 });
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an("object");
      });
    });
  });
});
