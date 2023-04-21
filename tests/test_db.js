import { expect } from "chai"
import { beforeEach } from "mocha";
import { setup_db } from '../database/setup_db.js';
import { DAO } from '../database/DAO.js';
import { User, Event } from '../database/models/index.js';

let sequelize;
let myDAO;

describe("TEST DB", () => {

  describe("TEST DAO", () => {
      before(async () => {
          sequelize = await setup_db(true, "test");
          myDAO = new DAO(sequelize);
      });
        
      beforeEach(async () => {
        const user = await myDAO.add_user("a_username", "email@mail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        const user1 = await myDAO.add_user("franck", "franck@mail.com", "00884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        const user2 = await myDAO.add_user("paul", "paul@mail.com", "11884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        const user3 =await myDAO.add_user("hugo", "hugo@mail.com", "22884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        const user4 =await myDAO.add_user("charles", "charles@mail.com", "33884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
          await myDAO.add_user("damien", "damien@mail.com", "44884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
          await myDAO.add_user("heba", "Heba@mail.com", "55884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
          await myDAO.save_event(Event.build({
            participants_number: 50,
            category: 'Concert',
            address: 'adresse du concert',
            description: 'Concert de Jazz',
            image_url: 'https://example.com/image_jazz.jpg',
            name: 'Jazz Convergence',
            organizerId: user1.id,
            date: "2023-04-21T12:30:00.000Z",
          }));
          await myDAO.save_event(Event.build({
            participants_number: 50,
            category: 'Randonnee',
            address: 'adresse de la randonnee',
            description: 'une rando à Luminy',
            image_url: 'https://example.com/image_rando.jpg',
            name: 'Sortie Luminy',
            organizerId: user2.id,
            date: "2023-04-21T12:30:00.000Z",

          }));
          await myDAO.save_event(Event.build({
            participants_number: 50,
            category: 'Musique',
            address: '123 rue de la musique',
            description: 'Un concert de rock',
            image_url: 'https://example.com/image.jpg',
            name: 'Concert de rock',
            organizerId: user3.id,
            date: "2023-04-21T12:30:00.000Z",

          }));
          await myDAO.save_event(Event.build({
            participants_number: 10,
            category: 'Karting',
            address: 'rue du karting',
            description: 'course de kart au castellet',
            image_url: 'https://example.com/image_karting.jpg',
            name: 'Mario Kart',
            organizerId: user4.id,
            date: "2023-04-21T12:30:00.000Z",

          }));
          
        });

        afterEach(async () => {
          User.truncate();
          Event.truncate();}
          );
          
        after(async () => {
          await sequelize.close();
        });
          
      
      it("test create user", async () => {
        const user = await myDAO.get_user_by_username("a_username")
        expect(user.username).to.equal("a_username");
        expect(user.email).to.equal("email@mail.com");
        expect(user.password_hash).to.equal("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
      });


      it("test delete user", async () => {
          await myDAO.remove_user_by_username("a_username");
          const user_after = await myDAO.get_user_by_username("a_username")
          expect(user_after).to.equal(null);
        });

        it("test get event by cat", async () => {          
          const my_events = await myDAO.get_events_by_category("Karting")
          // console.log(">>>>>>>\n"+JSON.stringify(my_events, null, 2).toString());
          expect(my_events.length).to.equal(1);
          expect(my_events[0].name).to.equal("Mario Kart");
        });


        it("test applying to event", async () => {
          const user = await myDAO.get_user_by_username("franck");
          const event_apply = await myDAO.get_event_by_name ("Jazz Convergence");
          const event_participate = await myDAO.get_event_by_name ("Sortie Luminy");
          await myDAO.apply(user.id, event_apply.id);
          await myDAO.participate(user.id, event_participate.id);
          const user_with_events = await myDAO.get_user_with_related_events(user.id, false, true, false)
          // console.log(">>>>>>>\n"+JSON.stringify(user_with_events, null, 2).toString());
          expect(user_with_events.candidateEvents.length).to.equal(1);
          expect(user_with_events.candidateEvents[0].name).to.equal("Jazz Convergence");

        });


        it("test participate to event", async () => {
          const user = await myDAO.get_user_by_username("franck");
          const event_apply = await myDAO.get_event_by_name ("Jazz Convergence");
          const event_participate = await myDAO.get_event_by_name ("Sortie Luminy");
          await myDAO.apply(user.id, event_apply.id);
          await myDAO.participate(user.id, event_participate.id);
          const user_with_events = await myDAO.get_user_with_related_events(user.id, false, false, true)
          // console.log(">>>>>>>\n"+JSON.stringify(user_with_events, null, 2).toString());
          expect(user_with_events.participantEvents.length).to.equal(1);
          expect(user_with_events.participantEvents[0].name).to.equal("Sortie Luminy");
        });


        it("test search", async () => {
          const events = await myDAO.get_events_by_filters({nb_places_wanted: 1,
                                                            category: "raNdon",
                                                            range_places: {min:50, max:1000},
                                                            address: "ADresse",
                                                            description:"RAndo",
                                                            event_name: "LUminy",
                                                            username: "PAUL",
                                                            score_host_min: 0,
                                                            range_date: {min:"2023-04-21T12:30:00.000Z", max:"2023-04-21T12:35:00.000Z"}})
          console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
        });



        it("test vide", async () => {
      
        });


  });


    describe("TEST RELATIONS (vide)", () => {

        it("(vide)", async () => {

          });

    });


    describe("TEST VALIDATION (vide)", () => {

      it("(vide)", async () => {

        });

  });



});
