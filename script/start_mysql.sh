# Installer MySQL si nécessaire 
## brew insall mysql

# Démarrer le service MySQL
# https://stackoverflow.com/questions/100948/how-do-you-stop-mysql-on-a-mac-os-install
brew services start mysql

# Arrêter le service MySQL
## brew services stop mysql

# Redémarrer le service MySQL
## brew services restart mysql


# Créer une base de données
# https://www.digitalocean.com/community/tutorials/how-to-use-sequelize-with-node-js-and-mysql

# DEFAULT LOGIN
# usernam:root password:empty


# Creer la database de test:
# CREATE DATABASE IF NOT EXISTS sn_test_db;

# Creer la database de production:
# CREATE DATABASE IF NOT EXISTS sn_prod_db;

# Pour query la db avec mysql en ligne de commande:
# mysql -u root
# mysql> connect sn_test_db;
# mysql> show tables;
# mysql> select * from users;