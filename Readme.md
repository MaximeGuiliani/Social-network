# M1 IDL Projet Social network (SN)

Le but de ce projet est de créer un réseau social en utilisant une API Rest et un client web pour cette API.
Une base de données sera docn necessaire.

L'application permettra de créer des utilisateurs, des événements, des commentaires et des notes.  

- La partie _front-end_ repose principalement sur React-dom, Raact-Router, et Chakra-ui.

- La partie back-end_, quand à elle, repose principalement sur Express, MySQL, Sequelize, JWT

## Pour commencer

### Le backend

```bash
git clone https://github.com/MaximeGuiliani/Social-network.git
```

### Le frontend
```bash
git clone https://github.com/LPMusardo/sn-front.git
```

### Pré-requis

Vous allez avoir besoin de :
- NodeJS/Npm
- MySQL

### Installation

#### Configuration de la base de données

Il faut (juste) créer la base de donnée mySQL au préalable
Une liste des commandes utiles est disponible dans le fichier [start_mysql.sh](script/start_mysql.sh)

#### Mise en place du backend

Pour configurer le backend, il faut installer les dépendances.

```bash
npm install
```


## Démarrage


On peut maintenant lancer le serveur.

```bash
npm start
##### result
#Server is running on port 3000  
# http://localhost:3000
```

Ensuite, on peut executer l'un des scripts suivant dans un second terminal [initCategories.js](initCategories.js) pour initialiser les categories ou [populate.js](populate.js) pour commencer à utiliser l'application avec des données de test.

```bash 
node initCategories.js
```

OU


```bash 
node populate.js
```


## Vous pouver maintenant faire des requetes à l'API
Une **documentation** est disponible à l'adresse suivante : [Social_network_API](https://app.swaggerhub.com/apis-docs/MAXIMEGUILIANI_2/Social_network_API/1.0.0)



## Auteurs
* **Léo-Paul Musardo**
* **Maxime Guiliani**  
* **Mickaël Lascoutounas** 
* **Yacine Boukhari** 
