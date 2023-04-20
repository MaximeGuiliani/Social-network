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
            User.truncate()
            Event.truncate()
        });

        after(async () => {
          await sequelize.close();
        });

      
        it("test create user", async () => {
          const user = await myDAO.add_user("a_username", "email@mail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
      
          expect(user.username).to.equal("a_username");
          expect(user.email).to.equal("email@mail.com");
          expect(user.password_hash).to.equal("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
        });


        it("test delete user", async () => {
            await myDAO.add_user("a_username", "email@mail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
            await myDAO.remove_user_by_username("a_username");
        
            const user_after = await myDAO.get_user_by_username("a_username")
            expect(user_after).to.equal(null);
          });


          it("test vide", async () => {
        
          });


    });


    describe("TEST ELSE", () => {

        it("else vide", async () => {

          });

    });



});
