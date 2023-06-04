import { setup_db } from "./database/setup_db.js";
import { DAO } from "./database/DAO.js";
import {
  User,
  Event,
  Address,
  MainCategory,
  EventMessage,
  Note,
} from "./database/models/index.js";

let sequelize;
let myDAO;

async function destroy() {
  sequelize = await setup_db(true, "prod");
  myDAO = new DAO(sequelize);
  await Event.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Address.destroy({ where: {} });
  await MainCategory.destroy({ where: {} });
  await Note.destroy({ where: {} });
  await EventMessage.destroy({ where: {} });
}

async function populate() {
  sequelize = await setup_db(true, "prod");
  myDAO = new DAO(sequelize);
  await Event.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Address.destroy({ where: {} });
  await MainCategory.destroy({ where: {} });
  await Note.destroy({ where: {} });
  await EventMessage.destroy({ where: {} });


  const cat_gastronomie = await myDAO.add_main_category("Food");
  const cat_jeux_videos = await myDAO.add_main_category("Video games");
  const cat_sciences = await myDAO.add_main_category("Sciences");
  const cat_sport = await myDAO.add_main_category("Sports");
  const cat_art_et_culture = await myDAO.add_main_category("Art & Culture");
  const cat_musique = await myDAO.add_main_category("Music");
  const cat_cinema = await myDAO.add_main_category("Cinema");
  const cat_good_causes = await myDAO.add_main_category("Good causes");

  // USERS

  const leopaul = await myDAO.add_user({
    username: "leopaul",
    email: "leo-paul.musardo@etu.univ-amu.fr",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de leopaul",
    picture: "https://site.com/picture_du_leopaul",
  });
  const user = await myDAO.add_user({
    username: "a_username",
    email: "email@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de a_username",
    picture: "https://site.com/picture_du_user",
  });
  const franck = await myDAO.add_user({
    username: "franck",
    email: "franck@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de franck",
  });
  const paul = await myDAO.add_user({
    username: "paul",
    email: "paul@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de paul",
  });
  const hugo = await myDAO.add_user({
    username: "hugo",
    email: "hugo@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de hugo",
  });
  const charles = await myDAO.add_user({
    username: "charles",
    email: "charles@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de charles",
  });
  const damien = await myDAO.add_user({
    username: "damien",
    email: "damien@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de damien",
  });
  const heba = await myDAO.add_user({
    username: "heba",
    email: "Heba@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de heba",
  });

  const anis = await myDAO.add_user({
    username: "anis",
    email: "anis@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "Intérêt principal : foot",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg",
  });

  const mehdi = await myDAO.add_user({
    username: "mehdi",
    email: "mehdi@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "Bonjour, je suis un grand fan de manga, et je dessine très souvent. J'aimerai pouvoir participé à des séances de dessin où l'on pourra se partager nos astuces.",
    picture:
      "https://geekalition.com/wp-content/uploads/2022/11/Isagi-Yoichi-Blue-Lock.webp",
  });

  const nour = await myDAO.add_user({
    username: "nour",
    email: "nour@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "Bonjour tout le monde, je suis une grande sportive, intéressée par des marathons.",
  });

  const le_gamer = await myDAO.add_user({
    username: "Xx_gameur_du_13_xX",
    email: "gamer@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "J'aime trop les jeux vidéos, c'est ma passssiiiiiiiion ",
    picture:
      "https://media.istockphoto.com/id/1182383458/fr/vectoriel/gamer-esport-mascotte-logo-design.jpg?s=2048x2048&w=is&k=20&c=TQaNy6F46LbSgc6lk9ytQ1zm7LeHpTMKzxhyS-2Hits=",
  });

  const yacine = await myDAO.add_user({
    username: "yacine",
    email: "yacine@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "Très actif au niveau du football, cherche souvent des gens pour jouer 2 à 3 fois par semaine. ( à 11 ou city )",
    picture:
      "https://www.nautiljon.com/images/perso/00/87/agatsuma_zenitsu_18378.webp",
  });

  const oscar = await myDAO.add_user({
    username: "oscar",
    email: "oscar@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "Amateur de Harry Potter, on peut se faire des petites soirées jeux lié à cela.",
    picture:
      "https://i.familiscope.fr/1400x787/smart/2022/04/06/livres-harry-potter.jpg",
  });

  const cedric = await myDAO.add_user({
    username: "cedric",
    email: "cedric@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "Je peins à mes heures perdues.",
  });

  const assia = await myDAO.add_user({
    username: "assia",
    email: "assia@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "Bonjour, amatrice d'escape game, j'aimerai rejoindre des esprits malin afin d'en accomplir le plus possible et dans les meilleurs temps !!",
    picture:
      "https://img.lemde.fr/2015/12/04/26/0/640/640/664/0/75/0/79e8b7c_5194-wikr8j.jpg",
  });

  const sophie = await myDAO.add_user({
    username: "sophie",
    email: "sophie@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de sophie",
  });

  const eric = await myDAO.add_user({
    username: "eric",
    email: "eric@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de eric",
  });

  const amine = await myDAO.add_user({
    username: "amine",
    email: "amine@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de amine",
  });

  const souf = await myDAO.add_user({
    username: "souf",
    email: "souf@mail.com",
    password_hash:
      "$2b$10$hnQ/tWVHXXFncPIKa.FUau59WIVkfJZ/3m9Uo20J3OqBC1edTi9y6",
    bio: "la bio de souf",
  });

  // EVENTS

  // ART & CULTURE

  const japan_expo = await myDAO.save_event({
    participants_number: 3,
    category: "Culture Cosplay",
    description:
      "Cherche un petit groupe pour aller à la japan expo en cosplay de Tanjiro, Zenitsu, Inosuke et Nezuko :) .",
    image_url:
      "https://upload.wikimedia.org/wikipedia/fr/thumb/e/ed/Japan_Expo_Logo_2.svg/798px-Japan_Expo_Logo_2.svg.png",
    name: "Japan Expo Cosplay",
    organizerId: mehdi.id,
    date: "2023-06-06T13:00:00.000Z",
    MainCategoryId: cat_art_et_culture.id,
    address: {
      street: "12 avenue du prado",
      city: "Marseille",
      country: "France",
      zip: "13009",
    },
  });

  // CINEMA

  const bestas = await myDAO.save_event({
    participants_number: 4,
    category: "Film Cinéma",
    description:
      "Je cherche des personnes qui veulent voir As Bestas avec moi afin de passer un bon moment au cinéma.",
    image_url:
      "https://fr.web.img6.acsta.net/pictures/22/06/23/15/35/2625015.jpg",
    name: "Séance Cinéma As Bestas",
    organizerId: leopaul.id,
    date: "2023-06-06T13:30:00.000Z",
    MainCategoryId: cat_cinema.id,
    address: {
      street: "12 avenue du prado",
      city: "Marseille",
      country: "France",
      zip: "13009",
    },
  });

  const hp = await myDAO.save_event({
    participants_number: 5,
    category: "Film Cinéma",
    description:
      "Je cherche des personnes qui veulent voir Harry Potter à l'école des sorciers lors d'une retransmission organisé par l'association X.",
    image_url: "https://imgsrc.cineserie.com/2001/12/1500437.jpg?ver=1",
    name: "Harry Potter à L'Ecole Des Sorciers",
    organizerId: oscar.id,
    date: "2024-06-07T19:30:00.000Z",
    MainCategoryId: cat_cinema.id,
    address: {
      street: "58 avenue des aigles",
      city: "Marseille",
      country: "France",
      zip: "13009",
    },
  });

  // FOOD

  // GOOD CAUSES

  // MUSIC

  const jazz = await myDAO.save_event({
    participants_number: 50,
    category: "Concert",
    description: "Concert de Jazz",
    image_url: "https://www.unesco.org/sites/default/files/styles/best_image/public/2023-04/shutterstock_1370931491.jpg?itok=RbzVs1cy",
    name: "Jazz Convergence",
    organizerId: franck.id,
    date: "2024-04-21T12:30:00.000Z",
    MainCategoryId: cat_musique.id,
    address: {
      street: "200 avenue du concert",
      city: "Marseille",
      country: "france",
      zip: "13900",
    },
  });

  const concert = await myDAO.save_event({
    participants_number: 50,
    category: "Musique",
    description: "Dernier concert des Daft Punk",
    image_url: "https://www.radiomeuh.com/images/9b938d7d-5de5-449e-aee3-2f418abd4e13/daft-punk-epilogue.png?fm=jpg&q=80&fit=max&crop=512%2C374%2C0%2C0",
    name: "Concert Daft Punk",
    organizerId: hugo.id,
    date: "2024-04-21T12:30:00.000Z",
    MainCategoryId: cat_musique.id,
    address: {
      street: "123 rue de la musique",
      city: "Paris",
      country: "France",
      zip: "codedeparis",
    },
  });

  // SCIENCES

  const forum_science = await myDAO.save_event({
    participants_number: 10,
    category: "Forum",
    description:
      "Participons à ce forum de la santé qui réunira plusieurs professionnelle du domaine.",
    image_url:
      "https://emf.fr/wp-content/uploads/2019/07/Affiche-Forum-sant%C3%A9-septembre-2019.jpg",
    name: "Forum de la santé",
    organizerId: charles.id,
    date: "2023-06-06T13:30:00.000Z",
    MainCategoryId: cat_sciences.id,
    address: {
      street: "rue des aigles",
      city: "Poitiers",
      country: "France",
      zip: "86000",
    },
  });

  // SPORTS

  const volley = await myDAO.save_event({
    participants_number: 10,
    category: "Volley ball",
    description: "Beach volley a la Ciotat",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Beach_volleyball_%284701437938%29.jpg/1200px-Beach_volleyball_%284701437938%29.jpg",
    name: "Volley Ball !",
    organizerId: leopaul.id,
    date: "2024-07-21T12:30:00.000Z",
    MainCategoryId: cat_sport.id,
    address: {
      street: "plage Lumiere",
      city: "La Ciotat",
      country: "France",
      zip: "13600",
    },
  });

  const rando = await myDAO.save_event({
    participants_number: 50,
    category: "Randonnee",
    description: "une rando à Luminy",
    image_url:
      "https://active-road.com/img/activites/slidemedium-p1230374-copie.jpg",
    name: "Sortie Luminy",
    organizerId: paul.id,
    date: "2024-04-21T12:30:00.000Z",
    MainCategoryId: cat_sport.id,
    address: {
      street: "333 avenue de la rando",
      city: "La Ciotat",
      country: "france",
      zip: "13600",
    },
  });

  const kart = await myDAO.save_event({
    participants_number: 10,
    category: "Karting",
    description: "course de kart au castellet",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Simeon_Ivanov_karting.jpg",
    name: "Karting",
    organizerId: leopaul.id,
    date: "2023-06-05T23:30:00.000Z",
    MainCategoryId: cat_sport.id,
    address: {
      street: "rue du karting",
      city: "Paris",
      country: "France",
      zip: "75001",
    },
  });

  const foot = await myDAO.save_event({
    participants_number: 21,
    category: "Foot",
    description:
      "J'organise un match à 11 contre 11, n'hésitez pas à venir nombreux dans la joie et la bonne humeur :) .",
    image_url: "https://lvdneng.rosselcdn.net/sites/default/files/dpistyles_v2/ena_16_9_extra_big/2021/06/07/node_1021419/51559787/public/2021/06/07/B9727281356Z.1_20210607131243_000%2BG4II93U2R.3-0.jpg?itok=c3uu-2aT1623423388",
    name: "Match de foot 11 vs 11",
    organizerId: yacine.id,
    date: "2023-06-07T13:30:00.000Z",
    MainCategoryId: cat_sport.id,
    address: {
      street: "Stade de Luminy",
      city: "Marseille",
      country: "France",
      zip: "13009",
    },
  });

  const futsal = await myDAO.save_event({
    participants_number: 7,
    category: "Foot",
    description: "J'organise un futsal, on recherche 7 personnes.",
    image_url:
      "https://img.olympicchannel.com/images/image/private/t_social_share_thumb/f_auto/primary/qjxgsf7pqdmyqzsptxju",
    name: "City 5 vs 5",
    organizerId: yacine.id,
    date: "2023-06-06T13:30:00.000Z",
    MainCategoryId: cat_sport.id,
    address: {
      street: "12 rue de la valentine",
      city: "Marseille",
      country: "France",
      zip: "13012",
    },
  });

  // VIDEO GAMES

  const smash = await myDAO.save_event({
    participants_number: 6,
    category: "Super Smash Bros Ultimate",
    description: "venez participer à un contest Smash",
    image_url:
      "https://static1.millenium.org/articles/1/37/25/41/@/1422365-h2x1-nswitch-supersmashbrosultimate-02-image1600w-1-article_m-1.jpg",
    name: "Giga Contest Smash",
    organizerId: charles.id,
    date: "2024-04-21T13:30:00.000Z",
    MainCategoryId: cat_jeux_videos.id,
    address: {
      street: "rue de smash bros",
      city: "Paris",
      country: "France",
      zip: "75001",
    },
  });

  const club_pro = await myDAO.save_event({
    participants_number: 10,
    category: "Fifa 23",
    description:
      "Recrute des joueurs club pro pour une coupe EA, tout poste recherché.",
    image_url:
      "https://static.fnac-static.com/multimedia/Images/FD/Comete/161738/CCP_IMG_1200x800/2143874.jpg",
    name: "Club pro fifa 23 ps4 ps5",
    organizerId: yacine.id,
    date: "2023-06-06T13:30:00.000Z",
    MainCategoryId: cat_jeux_videos.id,
    address: {
      street: "rue de club pro",
      city: "Marseille",
      country: "France",
      zip: "13005",
    },
  });

  const snip = await myDAO.save_event({
    participants_number: 1,
    category: "Call of Duty",
    description: "Cherche un gars pour faire un 1 vs 1 snipersur mw2 !",
    image_url:
      "https://image.jeuxvideo.com/medias/165511/1655108230-8066-jaquette-avant.jpg",
    name: "1 vs 1 Call of Duty",
    organizerId: le_gamer.id,
    date: "2023-06-06T12:30:00.000Z",
    MainCategoryId: cat_jeux_videos.id,
    address: {
      street: "x",
      city: "x",
      country: "France",
      zip: "00000",
    },
  });

  const exclusif = await myDAO.save_event({
    participants_number: 1,
    category: "Exclusif",
    description: "Un event ultra exclusif avec 1 seul participant!",
    image_url:
      "https://st2.depositphotos.com/1007499/5773/v/950/depositphotos_57739015-stock-illustration-exclusive-stamp.jpg",
    name: "Evenement Exclusif",
    organizerId: leopaul.id,
    date: "2024-06-06T12:30:00.000Z",
    MainCategoryId: cat_jeux_videos.id,
    address: {
      street: "rue exclusive",
      city: "La Ciotat",
      country: "France",
      zip: "13600",
    },
  });

  const bros = await myDAO.save_event({
    participants_number: 5,
    category: "Mario Bros",
    description: "Le meilleure jeu multi, venez tous",
    image_url:
      "https://cdn.cultura.com/cdn-cgi/image/width=768/media/pim/new-super-mario-bros-u-deluxe-0045496423759_20.jpg",
    name: "Mario Bros Switch",
    organizerId: damien.id,
    date: "2024-06-06T12:30:00.000Z",
    MainCategoryId: cat_jeux_videos.id,
    address: {
      street: "Switch",
      city: "bla",
      country: "bla",
      zip: "00",
    },
  });

  await myDAO.apply(leopaul.id, rando.id);
  
  await myDAO.apply(leopaul.id, smash.id);
  await myDAO.apply(paul.id, volley.id);

  await myDAO.apply(assia.id, volley.id);
  await myDAO.apply(le_gamer.id, volley.id);
  await myDAO.apply(anis.id, volley.id);
  await myDAO.apply(yacine.id, volley.id);
  await myDAO.apply(oscar.id, volley.id);
  await myDAO.apply(eric.id, volley.id);
  await myDAO.apply(sophie.id, volley.id);
  await myDAO.apply(heba.id, volley.id);
  await myDAO.apply(nour.id, volley.id);
  
  await myDAO.apply(damien.id, exclusif.id);
  await myDAO.apply(heba.id, exclusif.id);
  await myDAO.apply(hugo.id, exclusif.id);
  await myDAO.apply(charles.id, exclusif.id);

  await myDAO.participate(mehdi.id, futsal.id);
  await myDAO.participate(eric.id, futsal.id);
  await myDAO.participate(amine.id, futsal.id);
  await myDAO.participate(hugo.id, futsal.id);
  await myDAO.participate(leopaul.id, futsal.id);
  await myDAO.participate(cedric.id, futsal.id);
  await myDAO.participate(souf.id, futsal.id);

  await myDAO.participate(hugo.id, volley.id);
  await myDAO.participate(leopaul.id, jazz.id);
  await myDAO.participate(hugo.id, jazz.id);
  await myDAO.participate(paul.id, jazz.id);
  await myDAO.participate(franck.id, rando.id);
  await myDAO.participate(hugo.id, rando.id);
  await myDAO.participate(paul.id, concert.id);
  await myDAO.participate(damien.id, concert.id);

  await myDAO.participate(oscar.id, snip.id);

  await myDAO.add_note_from_participant({
    ownerId: oscar.id,
    eventId: snip.id,
    value: 1,
    title: "NE PAS JOUER AVEC LUI !!!",
    comment:
      "Ne fais qu'insulter lorsqu'il perd, joueur très désagréable, je ne recommande pas de jouer avec lui.",
  });

  await myDAO.add_note_from_participant({
    ownerId: mehdi.id,
    eventId: futsal.id,
    value: 4,
    title: "Sympa",
    comment: "Bonne ambiance, bon niveau, fairplay, à refaire",
  });

  await myDAO.add_note_from_participant({
    ownerId: eric.id,
    eventId: futsal.id,
    value: 3,
    title: "Bien",
    comment:
      "Bon match , si on oublie le fait que je n'avais pas beaucoup de ballons...",
  });

  await myDAO.add_note_from_participant({
    ownerId: amine.id,
    eventId: futsal.id,
    value: 5,
    title: "Excellent",
    comment:
      "Super match ! On avait une beau équipe, et le duo avec Yacine était fabuleux !",
  });

  await myDAO.add_note_from_participant({
    ownerId: souf.id,
    eventId: futsal.id,
    value: 4,
    title: "Cool",
  });

  await myDAO.add_note_from_participant({
    ownerId: cedric.id,
    eventId: futsal.id,
    value: 4,
    title: "Bonne organisation",
  });

  await myDAO.add_note_from_participant({
    ownerId: leopaul.id,
    eventId: futsal.id,
    value: 5,
    title: "Très bien",
    comment:
      "On a passé un bon moment, Yacine a très bien organisé, c'est à refaire !",
  });

  await myDAO.add_note_from_participant({
    ownerId: hugo.id,
    eventId: futsal.id,
    value: 4,
    title: "Bon match",
  });

  await myDAO.add_note_from_host({
    ownerId: yacine.id,
    eventId: futsal.id,
    targetId: amine.id,
    value: 5,
    title: "Magnifique",
    comment: "Très bon joueur, je recommande.",
  });

  await myDAO.add_note_from_host({
    ownerId: yacine.id,
    eventId: futsal.id,
    targetId: leopaul.id,
    value: 5,
    title: "Bien",
    comment: "Bon joueur et bonne mentalité",
  });

  await myDAO.add_note_from_host({
    ownerId: yacine.id,
    eventId: futsal.id,
    targetId: hugo.id,
    value: 4,
    title: "Bien",
  });

  await myDAO.add_note_from_host({
    ownerId: yacine.id,
    eventId: futsal.id,
    targetId: eric.id,
    value: 2,
    title: "Raleur",
  });

  await myDAO.add_note_from_host({
    ownerId: yacine.id,
    eventId: futsal.id,
    targetId: souf.id,
    value: 5,
    title: "Tres bien",
  });

  await myDAO.add_note_from_host({
    ownerId: hugo.id,
    eventId: concert.id,
    targetId: damien.id,
    value: 5,
    title: "Super",
    comment:
    "Ca c'est très bien passé",
  });

  await myDAO.add_note_from_host({
    ownerId: yacine.id,
    eventId: futsal.id,
    targetId: cedric.id,
    value: 4,
    title: "Bon gars",
  });

  await myDAO.add_note_from_participant({
    ownerId: leopaul.id,
    eventId: jazz.id,
    value: 4,
    title: "franck est un super organisateur",
  });

  await myDAO.add_note_from_participant({
    ownerId: hugo.id,
    eventId: volley.id,
    value: 4,
    title: "super volley ",
  });

  await myDAO.add_note_from_host({
    ownerId: franck.id,
    eventId: jazz.id,
    targetId: leopaul.id,
    value: 3,
    title: "Super soirée avec LP",
    comment: "bli bla blou",
  });

  await myDAO.add_note_from_host({
    ownerId: leopaul.id,
    eventId: volley.id,
    targetId: hugo.id,
    value: 3,
    title: "Hugoo",
    comment: "hugooooo",
  });

  await myDAO.add_note_from_participant({
    ownerId: franck.id,
    eventId: rando.id,
    value: 4,
    title: "avis1",
  });

  // await myDAO.add_note_from_participant({
  //   creationDate: "2024-04-22T12:30:00.000Z",
  //   ownerId: hugo.id,
  //   eventId: jazz.id,
  //   value: 3,
  //   title: "avis2",
  // });
  // await myDAO.add_note_from_participant({
  //   creationDate: "2024-04-22T12:30:00.000Z",
  //   ownerId: paul.id,
  //   eventId: jazz.id,
  //   value: 2,
  //   title: "avis3",
  // });

  // await myDAO.add_note_from_participant({
  //   creationDate: "2024-04-22T12:30:00.000Z",
  //   ownerId: franck.id,
  //   eventId: rando.id,
  //   value: 5,
  //   title: "avis4",
  // });
  // await myDAO.add_note_from_participant({
  //   creationDate: "2024-04-22T12:30:00.000Z",
  //   ownerId: hugo.id,
  //   eventId: rando.id,
  //   value: 4,
  //   title: "avis5",
  // });
  // await myDAO.add_note_from_participant({
  //   creationDate: "2024-04-22T12:30:00.000Z",
  //   ownerId: paul.id,
  //   eventId: concert.id,
  //   value: 5,
  //   title: "avis6",
  // });
}

await populate();
//await destroy();
