import { User, Event } from "./models/index.js";

class DAO {

	constructor(sequelize) {
	  this.sequelize = sequelize;
	}

	//ajout d'un utilisateur
	async add_user(username, email, password_hash, score_host = null, score_participant = null) {
		return this.sequelize.transaction( t => {
		return User.create({
			username: username,
			email: email,
			password_hash: password_hash,
			score_host: score_host,
			score_participant: score_participant,
		});
	});
}
//TODO: ajouter des transactions pour les autres fonctions, comme ci-dessus


//suppression d'un utilisateur
async  remove_user_by_username(username) {
	return User.destroy({
		where: {username: username}
	});
}


//modif d'un utilisateur
async  update_user_by_username(username, new_username, email, password_hash, score_host = null, score_participant = null) {
	return User.update(
		{
			username: new_username,
			email: email,
			password_hash: password_hash,
			score_host: score_host,
			score_participant: score_participant,
		},
		{ where: { username: username } }
		);
	}
	
	
// get d'un utilisateur
async  get_user_by_username(username) {
  return User.findOne({
	where: {username: username}
  });
}


//ajout d'un event
async  save_event(event) {
	return event.save();
}


//suppression d'un event
async  remove_event_by_name(event_name) {
	return Event.destroy({
		where: {name: event_name}
	});
}


//modif d'un event
async  update_event_by_name(name, new_name, category, address, description, image_url) {
	return Event.update(
		{
			name: new_name,
			category: category,
			address: address,
			description: description,
			image_url: image_url,
		},
		{ where: { name: name } }
		);
	}
	
	
	// get d'un event par nom 
	async  get_event_by_name(name) {
		return Event.findOne({
			where: {name: name}
		});
	}
	
	// utilsier des booléen pour le eager loading, choisi par le caller
// get d'un event avec ses participants
// get d'un event avec ses candidats
// get event avec tout

//get d'un event par id
//get d'un event par note exact de son organisateur
//get d'un event par note min de son organisateur
//get d'events par catégorie
//get d'events par places restantes

// get des camarades d'un utilisateur pour un event donné

// get d'un user par id
// get d'un utilisateur avec ses events organisés
// get d'un utilisateur avec ses particpations
// get d'un utilisateur avec ses candidatures
// get d'un utilisateur avec tout

// user.createEvent() , au lieu de passer par son id, on passe par son objet, c'est + ORM friendly

// get all the users


}

export { DAO };