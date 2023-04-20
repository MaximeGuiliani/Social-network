import { setup_db } from './database/setup_db.js';
import { DAO } from './database/DAO.js';
import { User, Event } from './database/models/index.js';


async function test(){
    const sequelize = await setup_db(true,"prod");
    const myDAO = new DAO(sequelize);

    console.log("---------------\n")
  
    const user = await myDAO.add_user("a_username", "email@mail.com", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")
    console.log("---------------\n"+JSON.stringify(user, null, 2).toString())

    // await myDAO.remove_user_by_username("a_username")
    // console.log("---------------\n")
        
    await myDAO.update_user_by_username("a_username", "a_new_username", "new_email@mail.com", "aaaaaaaaaa28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")
    const user2 = await myDAO.get_user_by_username("a_new_username")
    console.log("---------------\n"+JSON.stringify(user2, null, 2).toString())
    
    const event = Event.build({
        participants_number: 50,
        category: 'Musique',
        address: '123 rue de la musique',
        description: 'Un concert de rock',
        image_url: 'https://example.com/image.jpg',
        name: 'Concert de rock',
        organizerId: user.id,
    });
    await myDAO.save_event(event);
    console.log("---------------\n"+user.id)


    // await myDAO.remove_event_by_name("Concert de rock");
    // console.log("---------------\n")


    await myDAO.update_event_by_name("Concert de rock", "Super Concert", "Super Musique", "321 avanue new", "new description", "https://example.com/new_image.jpg")
    const event2 = await myDAO.get_event_by_name("Super Concert")
    console.log("---------------\n"+JSON.stringify(event2, null, 2).toString())


}

await test();
