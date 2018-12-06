#!/usr/bin/python3

from pymongo import MongoClient
import datetime

user='mickael'
password='48296r'
host='51.68.71.91'
port='43975'

mongo = MongoClient('mongodb://'+user+':'+password+'@'+host+':'+port+'/')

db =  mongo['production']

collection = db['User']

valider = False
while valider!= True:
	print("Ajout d'un utilisateur")
	username = input("User >")
	password = input("Password >")
	phone = input("Tel >")
	email = input("email >")
	if email == "" :
		 email = username+"@mellisphera.fr"
	connexion = input("connexion >")

	user  = {
		"createdAt" : datetime.datetime.now(), 
		"login" : {
			"username" : username,
			"password" : password
		},
		"phone" : phone,
		"email" : email,
		"connexions" : connexion
	}
	print(user)
	confirm = input("Confirmer(y/n)>")
	if(confirm == "y" or confirm == "Y"):
		valider = True

users = db.User

user_id = users.insert_one(user).inserted_id
print(user_id)


 
