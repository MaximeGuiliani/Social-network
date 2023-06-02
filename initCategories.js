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


  // Sport
  // Culture
  // Music
  // Food
  // Other

  const cat_gastronomie = await myDAO.add_main_category("Food");
  const cat_jeux_videos = await myDAO.add_main_category("Video games");
  const cat_sciences = await myDAO.add_main_category("Sciences");
  const cat_sport = await myDAO.add_main_category("Sports");
  const cat_art_et_culture = await myDAO.add_main_category("Art & Culture");
  const cat_musique = await myDAO.add_main_category("Music");
  const cat_cinema = await myDAO.add_main_category("Cinema");
  const cat_good_causes = await myDAO.add_main_category("Good causes");

}

populate();