import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { beforeEach } from "mocha";
import { setup_db } from "../database/setup_db.js";
import { DAO } from "../database/DAO.js";
import {
  User,
  Event,
  Address,
  MainCategory,
  EventMessage,
  Note,
} from "../database/models/index.js";

let sequelize;
let myDAO;

describe("TEST DB", () => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               describe("TEST DAO", () => {
    before(async () => {
      sequelize = await setup_db(true, "test");
      myDAO = new DAO(sequelize);
      await Event.destroy({ where: {} });
      await User.destroy({ where: {} });
      await Address.destroy({ where: {} });
      await MainCategory.destroy({ where: {} });
      await Note.destroy({ where: {} });
      await EventMessage.destroy({ where: {} });
    });

    beforeEach(async () => {
      const cat_gastronomie = await myDAO.add_main_category("Gastronomie");
      const cat_jeux_videos = await myDAO.add_main_category("Jeux-Vidéos");
      const cat_sciences = await myDAO.add_main_category("Sciences");
      const cat_sport = await myDAO.add_main_category("Sports");
      const cat_art_et_culture = await myDAO.add_main_category("Art & Culture");
      const cat_musique = await myDAO.add_main_category("Musique");
      const cat_cinema = await myDAO.add_main_category("Cinéma");

      const user = await myDAO.add_user({
        username: "a_username",
        email: "email@mail.com",
        password_hash:
          "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        bio: "la bio de a_username",
        picture: "https://site.com/picture_du_user",
      });
      const franck = await myDAO.add_user({
        username: "franck",
        email: "franck@mail.com",
        password_hash:
          "00884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        bio: "la bio de franck",
      });
      const paul = await myDAO.add_user({
        username: "paul",
        email: "paul@mail.com",
        password_hash:
          "11884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        bio: "la bio de paul",
      });
      const hugo = await myDAO.add_user({
        username: "hugo",
        email: "hugo@mail.com",
        password_hash:
          "22884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        bio: "la bio de hugo",
      });
      const charles = await myDAO.add_user({
        username: "charles",
        email: "charles@mail.com",
        password_hash:
          "33884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        bio: "la bio de charles",
      });
      const damien = await myDAO.add_user({
        username: "damien",
        email: "damien@mail.com",
        password_hash:
          "44884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        bio: "la bio de damien",
      });
      const heba = await myDAO.add_user({
        username: "heba",
        email: "Heba@mail.com",
        password_hash:
          "55884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        bio: "la bio de heba",
      });
      const jazz = await myDAO.save_event({
        participants_number: 50,
        category: "Concert",
        description: "Concert de Jazz",
        image_url: "https://example.com/image_jazz.jpg",
        name: "Jazz Convergence",
        organizerId: franck.id,
        date: "2023-04-21T12:30:00.000Z",
        MainCategoryId: cat_musique.id,
        address: {
          street: "200 avenue du concert",
          city: "Marseille",
          country: "france",
          zip: "13900",
        },
      });

      const rando = await myDAO.save_event({
        participants_number: 50,
        category: "Randonnee",
        description: "une rando à Luminy",
        image_url: "https://example.com/image_rando.jpg",
        name: "Sortie Luminy",
        organizerId: paul.id,
        date: "2023-04-21T12:30:00.000Z",
        MainCategoryId: cat_sport.id,
        address: {
          street: "333 avenue de la rando",
          city: "La Ciotat",
          country: "france",
          zip: "13600",
        },
      });
      const concert = await myDAO.save_event({
        participants_number: 50,
        category: "Musique",
        description: "Un concert de rock",
        image_url: "https://example.com/image.jpg",
        name: "Concert de rock",
        organizerId: hugo.id,
        date: "2023-04-21T12:30:00.000Z",
        MainCategoryId: cat_musique.id,
        address: {
          street: "123 rue de la musique",
          city: "Paris",
          country: "France",
          zip: "codedeparis",
        },
      });
      const kart = await myDAO.save_event({
        participants_number: 10,
        category: "Karting",
        description: "course de kart au castellet",
        image_url: "https://example.com/image_karting.jpg",
        name: "Mario Kart",
        organizerId: charles.id,
        date: "2023-04-21T12:30:00.000Z",
        MainCategoryId: cat_sport.id,
        address: {
          street: "rue du karting",
          city: "Paris",
          country: "France",
          zip: "75001",
        },
      });
      const smash = await myDAO.save_event({
        participants_number: 6,
        category: "Super Smash Bros Ultimate",
        description: "venez participer à un contest Smash",
        image_url: "https://example.com/image_ssbu.jpg",
        name: "Giga Contest Smash",
        organizerId: charles.id,
        date: "2023-04-21T13:30:00.000Z",
        MainCategoryId: cat_jeux_videos.id,
        address: {
          street: "rue de smash bros",
          city: "Paris",
          country: "France",
          zip: "75001",
        },
      });

      await myDAO.participate(franck.id, jazz.id);
      await myDAO.participate(hugo.id, jazz.id);
      await myDAO.participate(paul.id, jazz.id);
      await myDAO.participate(franck.id, rando.id);
      await myDAO.participate(hugo.id, rando.id);
      await myDAO.participate(paul.id, concert.id);

      await myDAO.add_note_from_participant({
        creationDate: "2023-04-22T12:30:00.000Z",
        ownerId: franck.id,
        eventId: jazz.id,
        value: 4,
        title: "avis1",
      });
      await myDAO.add_note_from_participant({
        creationDate: "2023-04-22T12:30:00.000Z",
        ownerId: hugo.id,
        eventId: jazz.id,
        value: 3,
        title: "avis2",
      });
      await myDAO.add_note_from_participant({
        creationDate: "2023-04-22T12:30:00.000Z",
        ownerId: paul.id,
        eventId: jazz.id,
        value: 2,
        title: "avis3",
      });

      await myDAO.add_note_from_participant({
        creationDate: "2023-04-22T12:30:00.000Z",
        ownerId: franck.id,
        eventId: rando.id,
        value: 5,
        title: "avis4",
      });
      await myDAO.add_note_from_participant({
        creationDate: "2023-04-22T12:30:00.000Z",
        ownerId: hugo.id,
        eventId: rando.id,
        value: 4,
        title: "avis5",
      });
      await myDAO.add_note_from_participant({
        creationDate: "2023-04-22T12:30:00.000Z",
        ownerId: paul.id,
        eventId: concert.id,
        value: 5,
        title: "avis6",
      });
    });

    afterEach(async () => {
      await Event.destroy({ where: {} });
      await User.destroy({ where: {} });
      await Address.destroy({ where: {} });
      await MainCategory.destroy({ where: {} });
      await Note.destroy({ where: {} });
      await EventMessage.destroy({ where: {} });
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
        const hugo = await myDAO.get_user_by_username("hugo")
        const cat_musique = await myDAO.get_main_categoty_by_name("Musique");
        const {id} = await myDAO.save_event({
          participants_number: 100,
          category: "Testing",
          description: "un event purement inutile",
          image_url: "https://example.com/image_test.jpg",
          name: "Mon test",
          organizerId: hugo.id,
          date: "2023-12-31T20:30:00.000Z",
          MainCategoryId: cat_musique.id,
          address: {
            street: "345 avnue du test unitaire",
            city: "Test city",
            country: "CountryTest",
            zip: "13900",
          },
        });
        let event_after_save = await myDAO.get_event_by_id(id)
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
          const franck = await myDAO.get_user_by_username("franck");
          const user_with_events = await myDAO.get_user_with_related_events({id:franck.id, include_participantEvents:true})
          // console.log(">>>>>>>\n"+JSON.stringify(user_with_events, null, 2).toString());
          expect(user_with_events.participantEvents.length).to.equal(2);
        });


        it("test user with related event 1", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const event_apply = await myDAO.get_event_by_name ("Jazz Convergence");
          await myDAO.apply(franck.id, event_apply.id);
          
          const user_with_events = await myDAO.get_user_with_related_events({id: franck.id, include_participantEvents:true, include_candidateEvents:true})
          // console.log(">>>>>>>\n"+JSON.stringify(user_with_events, null, 2).toString());
          expect(user_with_events.candidateEvents.length).to.equal(1);
          expect(user_with_events.participantEvents.length).to.equal(2);
          expect(user_with_events.organizedEvents).to.equal(undefined);
        });


        it("test search 1", async () => {
          const events = await myDAO.get_events_by_filters({
            nb_places_wanted: 48,
            category: "raNdon",
            range_places: { min: 50, max: 1000 },
            description: "RAndo",
            event_name: "LUminy",
            username: "PaUL",
            score_host_min: 0,
            range_date: {
              min: "2023-04-21T12:30:00.000Z",
              max: "2023-04-21T12:35:00.000Z",
            },
          });
          console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(1);
        });
    
        it("test search 2", async () => {
          const events = await myDAO.get_events_by_filters({
            address: {
              street: "333",
              city: "LA CIOTAT",
              country: "france",
            },
            range_date: {
              min: "2023-04-21T12:30:00.000Z",
              max: "2023-04-21T12:35:00.000Z",
            },
          });
          //console.log(">>>>>>>\n" + JSON.stringify(events, null, 2).toString());
          // expect(events.length).to.equal(1);
        });
        
        it("test search 3", async () => {
          const events = await myDAO.get_events_by_filters({
            nb_places_wanted: 51,
            description: "RAndo",
            event_name: "LUminy",
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(0);
        });
    
        it("test search 4", async () => {
          const events = await myDAO.get_events_by_filters({
            range_places: { min: 51, max: 1000 },
            description: "RAndo",
            event_name: "LUminy",
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(0);
        });
    
        it("test search 5", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const event_participate = await myDAO.get_event_by_name("sortie luminy");
          await myDAO.participate(franck.id, event_participate.id);
          await myDAO.participate(hugo.id, event_participate.id);
          const events = await myDAO.get_events_by_filters({
            nb_places_wanted: 50,
            description: "RAndo",
            event_name: "LUminy",
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(0);
        });

        it("test search - street", async () => {
          const events = await myDAO.get_events_by_filters({
            address:{street:"333 avenue de la rando"}
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(1);
          expect(events[0].name).to.equal("Sortie Luminy");
        });
    
        it("test search - city", async () => {
          const events = await myDAO.get_events_by_filters({
            event_name :"luminy",
            address:{city:"ciotat"}
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(1);
          expect(events[0].name).to.equal("Sortie Luminy");
        });
    

        it("test search - zip", async () => {
          const events = await myDAO.get_events_by_filters({
            address:{zip:"75001"}
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(2);
        });
        // street: "333 avenue de la rando",
        // city: "La Ciotat",
        // country: "france",
        // zip: "13600",

        it("test search - country", async () => {
          const events = await myDAO.get_events_by_filters({
            address:{country:"france"}
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(5);
        });

        it("test search 6", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const event_participate = await myDAO.get_event_by_name("sortie luminy");
          await myDAO.participate(franck.id, event_participate.id);
          await myDAO.participate(hugo.id, event_participate.id);
          const events = await myDAO.get_events_by_filters({
            nb_places_wanted: 48,
            description: "RAndo",
            event_name: "LUminy",
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(1);
        });

        it("test search - score min host ok ", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const event_participate = await myDAO.get_event_by_name("sortie luminy");
          await myDAO.participate(franck.id, event_participate.id);
          await myDAO.participate(hugo.id, event_participate.id);
          const events = await myDAO.get_events_by_filters({
            nb_places_wanted: 1,
            description: "RAndo",
            event_name: "LUminy",
            score_host_min: 4.4,
          });
          // console.log(">>>>>>>\n" + JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(1);
        });

        it("test search - score min host NOT ok ", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const event_participate = await myDAO.get_event_by_name("sortie luminy");
          await myDAO.participate(franck.id, event_participate.id);
          await myDAO.participate(hugo.id, event_participate.id);
          const events = await myDAO.get_events_by_filters({
            nb_places_wanted: 1,
            description: "RAndo",
            event_name: "LUminy",
            score_host_min: 4.6,
          });
          // console.log(">>>>>>>\n" + JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(0);
        });
    
        it("test search - date not found ", async () => {
          const events = await myDAO.get_events_by_filters({
            range_date: {min:"2023-04-21T13:31:00.000Z", max:"2023-04-21T13:32:00.000Z"},
            description: "contest Smash",
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(0);
        });
    
        it("test search - date found ", async () => {
          const events = await myDAO.get_events_by_filters({
            range_date: {min:"2023-04-21T13:30:00.000Z", max:"2023-04-21T13:32:00.000Z"},
            description: "contest Smash",
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(1);
        });
    
        it("test search - main category found ", async () => {
          const cat_jv = await myDAO.get_main_categoty_by_name("Jeux-Vidéos")
          const events = await myDAO.get_events_by_filters({
            MainCategoryId:999,
            range_date: {min:"2023-04-21T13:30:00.000Z", max:"2023-04-21T13:32:00.000Z"},
            description: "contest Smash",
          });
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(0);
        });
    
        it("test search - main category not found ", async () => {
          const cat_jv = await myDAO.get_main_categoty_by_name("Jeux-Vidéos")
          const events = await myDAO.get_events_by_filters({
            MainCategoryId:cat_jv.id,
            range_date: {min:"2023-04-21T13:30:00.000Z", max:"2023-04-21T13:32:00.000Z"},
            description: "contest Smash",
          });
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
          // console.log(">>>>>>>\n"+JSON.stringify(event_with_related_users, null, 2).toString());
          expect(event_with_related_users.candidates.length).to.equal(3);
          expect(event_with_related_users.participants.length).to.equal(1);
          expect(event_with_related_users.organizer.username).to.equal("charles");
          expect(event_with_related_users.MainCategory.name).to.equal("Sports");
        });

        it("test find all users", async () => {
          let users = await myDAO.get_all_users()
          // console.log(">>>>>>>\n"+JSON.stringify(users, null, 2).toString());
          expect(users.length).to.equal(7);
        });

        it("test find all events", async () => {
          let events = await myDAO.get_all_events()
          // console.log(">>>>>>>\n"+JSON.stringify(events, null, 2).toString());
          expect(events.length).to.equal(5);
        });

        it("test get_event_with_related_users ", async () => {
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");
    
          const hugo = await myDAO.get_user_by_username("hugo");
          const franck = await myDAO.get_user_by_username("franck");
          const paul = await myDAO.get_user_by_username("paul");
          const charles = await myDAO.get_user_by_username("charles");
          await myDAO.apply(hugo.id, jazz.id);
          await myDAO.apply(franck.id, jazz.id);
          await myDAO.apply(paul.id, jazz.id);
    
          const event = await myDAO.get_event_with_related_users({
            eventId: jazz.id,
            include_organizer: true,
            include_candidates: true,
            include_participants: true,
            include_notes: true,
          });
    
          // console.log(">>>>>>>\n" + JSON.stringify(event, null, 2).toString());
          expect(event.candidates.length).to.equal(3);
          expect(event.participants.length).to.equal(3);
          expect(event.organizer.username).to.equal("franck");
          expect(event.MainCategory.name).to.equal("Musique");
          expect(event.Address.street).to.equal("200 avenue du concert");
          expect(event.notes.length).to.equal(3);
        });


        it("test get_user_with_related_events ", async () => {
          const concert_de_hugo = await myDAO.get_event_by_name("Concert de rock");
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");
          const kart = await myDAO.get_event_by_name("Mario Kart");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          await myDAO.apply(hugo.id, jazz.id);
          await myDAO.participate(hugo.id, kart.id);
          await myDAO.add_note_from_host({
            creationDate: "2023-05-21T13:32:00.000Z",
            ownerId: hugo.id,
            eventId: concert_de_hugo.id,
            targetId: paul.id,
            value: 5,
            title: "Super Paul",
            comment: "tres sage",
          });
    
          const user_with_related = await myDAO.get_user_with_related_events({
            id: hugo.id,
            include_organizedEvents: true,
            include_candidateEvents: true,
            include_participantEvents: true,
            include_givenNotes: true,
            include_receivedNotes: true,
          });
          // console.log(
          //   ">>>>>>>\n" + JSON.stringify(user_with_related, null, 2).toString()
          // );
          expect(user_with_related.organizedEvents.length).to.be.above(0);
          expect(user_with_related.candidateEvents.length).to.be.above(0);
          expect(user_with_related.participantEvents.length).to.be.above(0);
          expect(user_with_related.givenNotes.length).to.be.above(0);
          expect(user_with_related.receivedNotes.length).to.be.above(0);
        });
        
        
        it("test note_host_is_possible OK", async () => {
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");
          const franck_host_jazz = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          await myDAO.participate(hugo.id, jazz.id);
          await myDAO.participate(paul.id, jazz.id);

          const is_possilbe = await myDAO.note_host_is_possible({ownerId:hugo.id, targetId:franck_host_jazz.id, eventId:jazz.id})
          expect(is_possilbe).to.equal(true);
        });
        
        it("test note_host_is_possible NOT OK", async () => {
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");
          const franck_host_jazz = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          const charles = await myDAO.get_user_by_username("charles");
          await myDAO.participate(hugo.id, jazz.id);
          await myDAO.participate(paul.id, jazz.id);
          const is_possilbe = await myDAO.note_host_is_possible({ownerId:charles.id, targetId:franck_host_jazz.id, eventId:jazz.id})
          expect(is_possilbe).to.equal(false);
        });
 

        it("test note_participant_is_possible OK", async () => {
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");
          const franck_host_jazz = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          await myDAO.participate(hugo.id, jazz.id);
          await myDAO.participate(paul.id, jazz.id);

          const is_possilbe = await myDAO.note_participant_is_possible({ownerId:franck_host_jazz.id, targetId:hugo.id, eventId:jazz.id})
          expect(is_possilbe).to.equal(true);
        });
        
        it("test note_participant_is_possible NOT OK", async () => {
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");
          const franck_host_jazz = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          const charles = await myDAO.get_user_by_username("charles");
          await myDAO.participate(hugo.id, jazz.id);
          await myDAO.participate(paul.id, jazz.id);

          const is_possilbe = await myDAO.note_participant_is_possible({ownerId:franck_host_jazz.id, targetId:charles.id, eventId:jazz.id})
          expect(is_possilbe).to.equal(false);
        });

 

        it("test add_message", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");

          await myDAO.add_message({userId:franck.id, eventId:jazz.id, content:"Bonjour a tous"})
          await myDAO.add_message({userId:hugo.id, eventId:jazz.id, content:"Salut Franck"})
          await myDAO.add_message({userId:paul.id, eventId:jazz.id, content:"Hi Franck"})
          await myDAO.add_message({userId:franck.id, eventId:jazz.id, content:"Patate patate"})
          
          const messages = await myDAO.get_all_messages_from_event(jazz.id)
          // console.log(">>>>>>>\n" + JSON.stringify(messages, null, 2).toString());
          expect(messages.length).to.equal(4);
        });

        it("test get_all_messages_from_event", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");

          await myDAO.add_message({userId:franck.id, eventId:jazz.id, content:"Bonjour a tous"})
          await myDAO.add_message({userId:hugo.id, eventId:jazz.id, content:"Salut Franck"})
          await myDAO.add_message({userId:paul.id, eventId:jazz.id, content:"Hi Franck"})
          await myDAO.add_message({userId:franck.id, eventId:jazz.id, content:"Patate patate"})
          
          const messages = await myDAO.get_all_messages_from_event(jazz.id)
          // console.log(">>>>>>>\n" + JSON.stringify(messages, null, 2).toString());
          expect(messages.length).to.equal(4);
        });

        it("test get_user_with_related_events", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");

          await myDAO.add_message({userId:franck.id, eventId:jazz.id, content:"Bonjour a tous"})
          await myDAO.add_message({userId:hugo.id, eventId:jazz.id, content:"Salut Franck"})
          await myDAO.add_message({userId:paul.id, eventId:jazz.id, content:"Hi Franck"})
          await myDAO.add_message({userId:franck.id, eventId:jazz.id, content:"Patate patate"})
          
          const user = await myDAO.get_user_with_related_events({id:franck.id, include_messages:true })
          // console.log(">>>>>>>\n" + JSON.stringify(user, null, 2).toString());
          expect(user.messages.length).to.equal(2);
        });


        it("test get_event_with_related_users", async () => {
          const franck = await myDAO.get_user_by_username("franck");
          const hugo = await myDAO.get_user_by_username("hugo");
          const paul = await myDAO.get_user_by_username("paul");
          const jazz = await myDAO.get_event_by_name("Jazz Convergence");

          await myDAO.add_message({userId:franck.id, eventId:jazz.id, content:"Bonjour a tous"})
          await myDAO.add_message({userId:hugo.id, eventId:jazz.id, content:"Salut Franck"})
          await myDAO.add_message({userId:paul.id, eventId:jazz.id, content:"Hi Franck"})
          await myDAO.add_message({userId:franck.id, eventId:jazz.id, content:"Patate patate"})
          
          const event = await myDAO.get_event_with_related_users({eventId:jazz.id, include_messages:true})
          // console.log(">>>>>>>\n" + JSON.stringify(event, null, 2).toString());
          expect(event.messages.length).to.equal(4);
        });

        it("test message_is_possible - organizer", async () => {
          const paul = await myDAO.get_user_by_username("paul");
          const rando_de_paul = await myDAO.get_event_by_name("Sortie Luminy");
          
          // add_message() fait appel à message_is_possible()
          await myDAO.add_message({userId:paul.id, eventId:rando_de_paul.id, content:"Bjr, Je suis votre encadrant"})

          const event = await myDAO.get_event_with_related_users({eventId:rando_de_paul.id, include_messages:true})
          // console.log(">>>>>>>\n" + JSON.stringify(event, null, 2).toString());
          expect(event.messages.length).to.equal(1);
        });

        it("test message_is_possible - participant", async () => {
          const hugo = await myDAO.get_user_by_username("hugo");
          const rando_de_paul = await myDAO.get_event_by_name("Sortie Luminy");
          
          // add_message() fait appel à message_is_possible()
          await myDAO.add_message({userId:hugo.id, eventId:rando_de_paul.id, content:"Bjr, Je suis un participant"})

          const event = await myDAO.get_event_with_related_users({eventId:rando_de_paul.id, include_messages:true})
          console.log(">>>>>>>\n" + JSON.stringify(event, null, 2).toString());
          expect(event.messages.length).to.equal(1);
        });


        it("test message_is_possible - NOT possible", async () => {
          // add_message() fait appel à message_is_possible()
          const hugo_participant = await myDAO.get_user_by_username("hugo");
          const charles_not_participant = await myDAO.get_user_by_username("charles");
          const rando_de_paul = await myDAO.get_event_by_name("Sortie Luminy");
          
          return expect(myDAO.add_message({userId:charles_not_participant.id, eventId:rando_de_paul.id, content:"Bjr, Je NE suis PAS un participant"}))
            .to.be.rejectedWith(Error);

        });

        // await myDAO.participate(franck.id, jazz.id);
        // await myDAO.participate(hugo.id, jazz.id);
        // await myDAO.participate(paul.id, jazz.id);
        // await myDAO.participate(franck.id, rando.id);
        // await myDAO.participate(hugo.id, rando.id);
        // await myDAO.participate(paul.id, concert.id);
        

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
