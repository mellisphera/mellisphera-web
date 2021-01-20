#!/bin/bash
if (($#==1));
then
	if [ -d "/var/www/html/$1" ];
	then
		rm -rf ./dist
		#rm -fv src/config.ts
		#echo "config ..."
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
			rm -rvf "/var/www/html/$1/*"
			cp -rRv dist/cleanversion/* "/var/www/html/$1/"
			ln -s "/mellisphera/imgClient.$1" "/var/www/html/$1/assets/client"
		else
			echo "Verifier la compilation !"
		fi
	else
		echo "Ce repertoire n'existe pas !"
	fi
else
	echo "Ajouter le repertoire de destination en argument - test ou bzz "
fi
