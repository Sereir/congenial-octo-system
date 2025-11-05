/* eslint-disable no-undef */
// Script d'initialisation MongoDB pour Docker
// Les variables 'db' et 'print' sont des globales MongoDB
db = db.getSiblingDB('ubereats');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'ubereats_user',
  pwd: 'ubereats_password',
  roles: [
    {
      role: 'readWrite',
      db: 'ubereats'
    }
  ]
});

print('✅ Database and user created successfully');
