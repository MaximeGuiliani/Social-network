import { User, Event } from "./models/index.js";
import { Op } from "sequelize";

//INFO: user.createEvent() , au lieu de passer par son id, on passe par son objet, c'est + ORM friendly
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


	//suppression d'un utilisateur
	async  remove_user_by_username(username) {
		return this.sequelize.transaction( t => {
			return User.destroy({
				where: {username: username}
			});
		});
	}


	//modif d'un utilisateur
	async  update_user_by_username(username, new_username, email, password_hash, score_host = null, score_participant = null) {
		return this.sequelize.transaction( t => {
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
		});
	}
	
		
	// get d'un utilisateur
	async  get_user_by_username(username) {
		return this.sequelize.transaction( t => {
			return User.findOne({
			where: {username: username}
			});
		});
	}

	//get d'un event par id
	async get_user_by_id(id) {
		return this.sequelize.transaction(async t => {
			return await User.findOne({where: { id: id }});
		});
	}

	//ajout d'un event
	async  save_event(event) {
		return this.sequelize.transaction( t => {
			return event.save();
		});
	}


	//suppression d'un event
	async  remove_event_by_name(event_name) {
		return this.sequelize.transaction( t => {
			return Event.destroy({where: {name: event_name}});
		});
	}


	//modif d'un event
	async  update_event_by_name(name, new_name, category, address, description, image_url) {
		
		return this.sequelize.transaction( t => {
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
		});
	}
	
	
	// get d'un event par nom 
	async  get_events_by_name_like(name) {
		return this.sequelize.transaction( t => {
			return Event.findAll({
				where: {
					name: {
						[Op.like]: `%${name.toLowerCase()}%`,
					},
				}
			});
		});
	}

	// get d'un event par nom 
	async  get_event_by_name(name) {
		return this.sequelize.transaction( t => {
			return Event.findOne({where: {name: name}});
		});
	}
	
	//get d'un event par note exact de son organisateur
	async get_events_by_organizer_score(score) {
		return this.sequelize.transaction( t => {
			return Event.findAll({
				include: [
					{
						model: User,
						as: 'organizer',
						where: { score_host: score }
					}
				]
			});
		});
	}




//get d'un event par note min de son organisateur
async get_events_by_organizer_score_min(score_min) {
	return this.sequelize.transaction( t => {
	  return Event.findAll({
		include: [{
		  model: User,
		  as: 'organizer',
		  where: { score_host: { [Op.gte]: score_min } }
		}]
	  });
	});
  }


//get d'events par catégorie
async get_events_by_category(category) {
	let where = {};
	if (category!==undefined) where.category = category;
    return this.sequelize.transaction( t => {
        return Event.findAll({
            where: where,
        });
    });
}


// get all the event
async get_all_events() {
	return this.sequelize.transaction(t=> {
	  return Event.findAll();
	});
  }


// get all the users
async get_all_users() {
	return this.sequelize.transaction( t => {
	  return User.findAll();
	});
  }

// get d'un utilisateur par id
async get_user_by_id(id) {
	return this.sequelize.transaction(t => {
	  return User.findOne({where: { id: id }});
	});
  }

  

	// get user avec ses event associés
	async get_user_with_related_events(id, include_organizedEvents = false, include_candidateEvents = false, include_participantEvents = false) {
		const include = [];
		if (include_organizedEvents) include.push({ model: Event, as: 'organizedEvents' });
		if (include_candidateEvents) include.push({ model: Event, as: 'candidateEvents', through: {attributes: []} });
		if (include_participantEvents) include.push({ model: Event, as: 'participantEvents', through: {attributes: []} });

		return this.sequelize.transaction(async t => {
			return await User.findOne({
				where: { id: id },
				include: include
			});
		});
	}
 


	// utilsier des booléen pour le eager loading, choisi par le caller
	// get d'un event avec organisateur
	// get d'un event avec ses participants
	// get d'un event avec ses candidats
	// get event avec tout
	async get_event_with_related_users(eventId, include_organizer = false, include_candidates = false, include_participants = false) {
		const include = [];
		if(include_organizer) include.push({ model: User, as: 'organizer' });
		if(include_candidates) include.push({ model: User, as: 'candidates' });
		if(include_participants) include.push({ model: User, as: 'participants' });
		
		return this.sequelize.transaction( t => {
			return Event.findOne({
				where: { id: eventId },
				include: include
			});
		});

	}


	//faire candidater
	async apply(userId, eventId) {
		return this.sequelize.transaction( async t => {
			const user = await User.findByPk(userId);
			const event = await Event.findByPk(eventId);
			if (!user || !event) { throw new Error("User or event not found"); }
			return event.addCandidate(user);
		});
	}


	//faire candidater avec name
	async apply_by_name(username, event_name) {
		return this.sequelize.transaction( async t => {
			const user = await User.findOne( {where: {username: user_username}} );
			const event = await Event.findOne( {where: {name: event_name}} );
			if (!user || !event) throw new Error("User or event not found"); 
			return event.addCandidate(user);
		});
	}


	//faire participer
	async participate(userId, eventId) {
		return this.sequelize.transaction(async t => {
			const user = await User.findByPk(userId);
			const event = await Event.findByPk(eventId);
			if (!user || !event) throw new Error("User or event not found");
			return event.addParticipant(user);
		});
	}

  
	//faire participer avec name
	async participate_by_name(username, event_name) {
		return this.sequelize.transaction(async t => {
			const user = await User.findOne({ where: { username: username } });
			const event = await Event.findOne({ where: { name: event_name } });
			if (!user || !event) throw new Error("User or event not found");
			return event.addParticipant(user);
		});
	}




	//get d'events par places restantes, catégorie, lieu, date, etc
	async get_events_by_filters({nb_places_wanted, category, range_places, address, description, event_name, username, range_date, score_host_min}) {
		let info = {
			attributes: [
				'id',
				'name',
				'participants_number',
				'category',
				'address',
				'description',
				'image_url',
				'organizerId',
				'date',
				[this.sequelize.literal('participants_number - COUNT(UserId)'), 'nb_places_left'],
			],
			include: [
				{
					model: User,
					as: 'participants',
					through: {attributes: ['UserId']},
					attributes: [],
				},
				{
					model: User,
					as: 'organizer',
					attributes: ['score_host', 'score_participant', 'username', 'email']
				},
			],
			group: ['Event.id'],
			having: {
				[Op.and]: [
				//   this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('category')), Op.like, `%${category.toLowerCase()}%`),
				//   { participants_number: {[Op.between]: [range_places.min, range_places.max]} },
				//   this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('description')), Op.like, `%${description.toLowerCase()}%`),
				//   this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('name')), Op.like, `%${event_name.toLowerCase()}%`),
				//   this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('address')), Op.like, `%${address.toLowerCase()}%`),
				//   this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('organizer.username')), Op.like, `%${username.toLowerCase()}%`),
				//   { 'nb_places_left': {[Op.gte]: nb_places_wanted} },
				//   { date : {[Op.lte]: range_date.max, [Op.gte]: range_date.min} },
				//   { 'organizer.score_host': {[Op.or]: {[Op.gte]: score_host_min, [Op.eq]: null} } }, //ici on fait le choix d'inclure les event d'organisateurs qui n'ont pas de score
				]
			}
		}

		if(nb_places_wanted !== undefined) info.having[Op.and].push(   {'nb_places_left': {[Op.gte]: nb_places_wanted}}                                                                                    );
		if(category !== undefined) info.having[Op.and].push(           this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('category')), Op.like, `%${category.toLowerCase()}%`)            );
		if(range_places !== undefined) info.having[Op.and].push(       { participants_number: {[Op.between]: [range_places.min, range_places.max]} }                                                       );
		if(address !== undefined) info.having[Op.and].push(            this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('address')), Op.like, `%${address.toLowerCase()}%`)              );
		if(description !== undefined) info.having[Op.and].push(        this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('description')), Op.like, `%${description.toLowerCase()}%`)      );
		if(event_name !== undefined) info.having[Op.and].push(         this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('name')), Op.like, `%${event_name.toLowerCase()}%`)              );
		if(username !== undefined) info.having[Op.and].push(           this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('organizer.username')), Op.like, `%${username.toLowerCase()}%`)  );
		if(range_date !== undefined) info.having[Op.and].push(         { date : {[Op.lte]: range_date.max, [Op.gte]: range_date.min} }                                                                     );
		if(score_host_min !== undefined) info.having[Op.and].push(     { 'organizer.score_host': {[Op.or]: {[Op.gte]: score_host_min, [Op.eq]: null} } }                                                   ); //ici on fait le choix d'inclure les event d'organisateurs qui n'ont pas de score

		return this.sequelize.transaction(t => {
			return Event.findAll(info);
		});

	}




}

export { DAO };
