# Buja Market

## Installation
### Téléchargement du projet
````shell script
 $ git clone https://github.com/iracanyes/bujamarket.git
````
### Docker 
Docker permet de créer un environnement  de développement indépendant de l'OS utilisé. On pourra ainsi dans créer un environnement serveur dédié au projet et entierement configuré  
Installez la version de Docker correspondant à votre système d'exploitation
* [Docker pour Windows Pro, Entreprise, or Educational](https://docs.docker.com/docker-for-windows/install/)
* [Docker-toolbox pour Windows 10 Home et les anciennes versions de Windows et Mac](https://docs.docker.com/toolbox/toolbox_install_windows/)
* [Docker Engine pour Linux](https://docs.docker.com/install/)  

### Installation du projet
#### Modification des variables d'environnement
On commence par créer les variables d'environnement en copiant les fichiers ````/.env.dist```` et ````/api/.env.dist```` vers les fichiers ````/.env```` et ````/api/.env```` respectivement. 
Après on modifie les valeurs !ChangeMe! de ces fichiers. 

#### Création des containers Docker 
Avant la création de l'environnement de développement, il faut s'assurer que les ports réseau qui seront utilisés par les containers sont libres et qu'aucun service n'utilise les ports suivants
* 443 - Client
* 444 - Admin
* 8443 - API
* 8444 - API - Cache-proxy
* 3306 - Database MySQL
* 1337 - Mercure

Dans le terminal (pour windows le terminal Docker), accéder au répertoire racine du projet et exécutez la commande suivante:  
````shell script
$ cd bujamarket
$ docker-compose up -d
````
Remarque: La commande ci-dessus doit être effectué uniquement à la création du projet
### Lancer/Stopper l'application 
Par la suite, si on veut démarrer ou arrêter le programme, on utilise les commandes suivantes.
````shell script
$ docker-compose start
$ docker-compose stop
````
On peut remplir la base de donnée avec des données fictives avec la commande suivante qui va exécuter un script shell pour remplir la base de donnée:
````shell script
$ bin/dck-fixtures.sh
````
On peut maintenant accéder à la [page d'accueil du projet](https://localhost/dev)  

