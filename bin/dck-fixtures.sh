#!/bin/bash

# Premier ajout contient un administrateur système
docker-compose exec php bin/console doctrine:fixtures:load --append --group=system_admin


# Boucle sans administrateur système
for i in `seq 1 40`;
do
	if docker-compose exec php bin/console doctrine:fixtures:load --append --group=group2 -vvv
	then
		echo Doctrine fixtures load successful!
	else
		echo ERROR : Failed to tload fixtures! Please recheck the variables 1>&2
		exit 1 # Terminer en indicant l'erreur
	fi
done;
