#!/bin/bash
if (($#==1));
then
	if [ -d "/var/www/html/$1" ];
	then
		rm -rf ./dist
		#rm -fv src/config.ts
		#echo "config ..."
		if [ $1 = 'test' ]; #|| [ $1 = 'bzz' ];
			then
				echo "actualisation de ms-pics sur test"
				rm -rf /mellisphera/test/mellisphera-web/src/assets/ms-pics/*
      			cp /mellisphera/test/ms-pics/* /mellisphera/test/mellisphera-web/src/assets/ms-pics/
		elif [ $1 = 'bzz' ];
			then
				echo "actualisation de ms-pics sur prod"
				rm -rf /mellisphera/prod/mellisphera-web/src/assets/ms-pics/*
      			cp /mellisphera/prod/ms-pics/* /mellisphera/prod/mellisphera-web/src/assets/ms-pics/
		else
			echo "erreur lors de la copie de ms-pics"
		fi
		#if [ $1 = 'test' ] || [ $1 = 'bzz' ];
		#then
		#	cp -v /home/mickael/config_test.ts src/constants/config.ts
		#else
		#	cp -v /home/mickael/config_app.ts src/constants/config.ts
		#fi
		echo "build ..."
		ng build --prod --base-href='/'
		file=./dist
		if [ -d "$file" ];
		then
			echo "cp vers apache $1"
			rm -rf "/var/www/html/$1/*"
			cp -rR dist/cleanversion/* "/var/www/html/$1/"
			ln -s "/mellisphera/imgClient" "/var/www/html/$1/assets/client"
		else
			echo "Verifier la compilation !"
		fi
	else
		echo "Ce repertoire n'existe pas !"
	fi
else
	echo "Ajouter le repertoire de destination en argument - test ou bzz "
fi
