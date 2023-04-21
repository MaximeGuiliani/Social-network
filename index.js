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

//await test();


async function test2(){
    
    const sequelize = await setup_db(true, "prod");
    const myDAO = new DAO(sequelize);

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

      const franck = await myDAO.get_user_by_username("franck");
      const event_apply = await myDAO.get_event_by_name ("Jazz Convergence");
      const event_participate = await myDAO.get_event_by_name ("Sortie Luminy");
      await myDAO.apply(franck.id, event_apply.id);
      await myDAO.participate(franck.id, event_participate.id);
      
      const paul = await myDAO.get_user_by_username("paul");
      await myDAO.participate(paul.id, event_participate.id);

}

await test2();

