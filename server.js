/*jshint esversion: 6 */
// var config = require('./config.json');console.log("Loaded Config")}; // Loads manual config

// Initialise Discord
const Discord = require('discord.js');
const client = new Discord.Client();
// Initialise Firebase
const admin = require('firebase-admin'); 
admin.initializeApp({
  credential: admin.credential.cert({
		"project_id": process.env.FIREBASE_ID,
    "private_key": process.env.FIREBASE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_EMAIL,
  })
});
var db = admin.firestore();
admin.firestore().settings({timestampsInSnapshots: true});
var user = {};
function firestoreint(docRef, message){
	try{var setDoc = db.collection(message.guild.id).add({
		initiatedBy: message.author.tag,
		user1: user[0].id,
		user2: user[1].id,
		datestarted: admin.firestore.FieldValue.serverTimestamp()
	});}
	catch(error){var setDoc = db.collection(message.guild.id).add({
		initiatedBy: message.author.tag,
		datestarted: admin.firestore.FieldValue.serverTimestamp()
	})};
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content.startsWith('g!Start')) {
	message.delete(); // Delete prior message
	var user = message.mentions.users.first(2); // Extract the two mentioned users
	try{message.channel.send(`---- The court is now in session ---- \n This court was initiated by: <@${message.author.id}> \n This court session is against <@${user[0].id}> and <@${user[1].id}>`)}
	catch(error){(message.channel.send(`---- The court is now in session ---- \n This court was initiated by: <@${message.author.id}>`))}; // If the message does not contain two mentions then this is sent instead. 
	var docRef = db.collection(message.guild.id).doc('sessions');
	firestoreint(docRef, message);
} else if (message.content.startsWith('g!End')) {
	message.delete();
	message.channel.send(`---- The court session has been ended by <@${message.author.id}>`);
  }
});

client.login(process.env.discord_token);
// client.login(config.token); console.warn("Logging in with config.json. This shouldn't be used in production. Please consider using Heroku. ")