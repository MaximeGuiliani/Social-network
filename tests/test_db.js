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
          await Event.destroy({ where: {} });
          await User.destroy({ where: {} });
      });
        
      beforeEach(async () => {
        const user =  await myDAO.add_user("a_username", "email@mail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        const user1 = await myDAO.add_user("franck", "franck@mail.com", "00884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        const user2 = await myDAO.add_user("paul", "paul@mail.com", "11884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        const user3 = await myDAO.add_user("hugo", "hugo@mail.com", "22884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        const user4 = await myDAO.add_user("charles", "charles@mail.com", "33884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
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
          await Event.destroy({ where: {} });
          await User.destroy({ where: {} });
        });
          
        after(async () => {
          await sequelize.close();
        });
          
      
      it("test create user", async () => {
        const user = await myDAO.get_user_by_username("a_username")
        expect(user.username).to.equal("a_username");
        expect(user.email).to.equal("email@mail.com");
        expect(user.password_hash).to.equal("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
      });

      it("test save event", async () => {
        let hugo = await myDAO.get_user_by_username("hugo")
        const event = Event.build({
          participants_number: 100,
          category: 'Testing',
          address: '345 avnue du test unitaire',
          description: 'un event purement inutile',
          image_url: 'https://example.com/image_test.jpg',
          name: 'Mon test',
          date: "2023-12-31T20:30:00.000Z",
          organizerId: hugo.id,
      });
        await myDAO.save_event(event);
        let event_after_save = await myDAO.get_event_by_id(event.id)
        expect(event_after_save.name).to.equal("Mon test");
        expect(event_after_save.category).to.equal("Testing");
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
          const user_with_events = await myDAO.get_user_with_related_events({id:user.id, include_candidateEvents:true})
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
          const user_with_events = await myDAO.get_user_with_related_events({id:user.id, include_participantEvents:true})
          // console.log(">>>>>>>\n"+JSON.stringify(user_with_events, null, 2).toString());
          expect(user_with_events.participantEvents.length).to.equal(1);
          expect(user_with_events.participantEvents[0].name).to.equal("Sortie Luminy");
        });


        it("test user with related event 1", async () => {
          const user = await myDAO.get_user_by_username("franck");
          const event_apply = await myDAO.get_event_by_name ("Jazz Convergence");
          await myDAO.apply(user.id, event_apply.id);
          const event_participate = await myDAO.get_event_by_name ("Sortie Luminy");
          await myDAO.participate(user.id, event_participate.id);
          const event_participate2 = await myDAO.get_event_by_name ("Concert de rock");
          await myDAO.participate(user.id, event_participate2.id);
          
          const user_with_events = await myDAO.get_user_with_related_events({id: user.id, include_participantEvents:true, include_candidateEvents:true})
          // console.log(">>>>>>>\n"+JSON.stringify(user_with_events, null, 2).toString());
          expect(user_with_events.candidateEvents.length).to.equal(1);
          expect(user_with_events.candidateEvents[0].name).to.equal("Jazz Convergence");
          expect(user_with_events.participantEvents.length).to.equal(2);
          expect(user_with_events.organizedEvents).to.equal(undefined);
        });


        it("test search", async () => {
          const events = await myDAO.get_events_by_filters({nb_places_wanted: 1,
                                                            category: "raNdon",
                                                            range_places: {min:50, max:1000},
                                                            address: "ADresse",
                                                            description:"RAndo",
                                                            event_name: "LUminy",
                                                            username: "PaUL",
                                                            score_host_min: 0,
                                                            range_date: {min:"2023-04-21T12:30:00.000Z", max:"2023-04-21T12:35:00.000Z"}})
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(1);

        });



        it("test collation 'NO CASE NO ACCENT' is active for the db", async () => {
          let my_events = await myDAO.get_events_by_name_like("MÀRIö KArt")
          expect(my_events[0].name).to.equal("Mario Kart");
        });
   
        it("get event with related users", async () => {
          let my_event = await myDAO.get_event_by_name("mario kart")
          let other_event = await myDAO.get_event_by_name("Jazz Convergence")
          let hugo = await myDAO.get_user_by_username("hugo")
          let franck = await myDAO.get_user_by_username("franck")
          let paul = await myDAO.get_user_by_username("paul")
          let charles = await myDAO.get_user_by_username("charles")
          await myDAO.apply(hugo.id, my_event.id);
          await myDAO.apply(hugo.id, other_event.id);
          await myDAO.apply(franck.id, my_event.id);
          await myDAO.apply(paul.id, my_event.id);
          await myDAO.participate(charles.id, my_event.id);

          let event_with_related_users = await myDAO.get_event_with_related_users({eventId:my_event.id, include_organizer:true, include_candidates:true, include_participants:true})
          console.log(">>>>>>>\n"+JSON.stringify(event_with_related_users, null, 2).toString());
          // expect(my_events[0].name).to.equal("Mario Kart");
        });

        it("test find all users", async () => {
          let users = await myDAO.get_all_users()
          console.log(">>>>>>>\n"+JSON.stringify(users, null, 2).toString());
          expect(users.length).to.equal(7);
        });

        it("test find all events", async () => {
          let events = await myDAO.get_all_events()
          console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(4);
        });

        // it("test vide", async () => {
      
        // });


  });


  //   describe("TEST RELATIONS (vide)", () => {

  //       it("(vide)", async () => {

  //         });

  //   });


  //   describe("TEST VALIDATION (vide)", () => {

  //     it("(vide)", async () => {

  //       });

  // });



});
