"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var calling = require('botbuilder-calling');
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

//var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
var connector = new calling.CallConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

// text chatbot "hello world"
//var bot = new builder.UniversalBot(connector);
//bot.dialog('/', function (session) {
//    session.send('You said ' + session.message.text);
//});

var bot = new calling.UniversalCallBot(connector);

// not sure if this applies to bots in Azure
//bot.localePath(path.join(__dirname, './locale'));
//server.post('/api/calls', connector.listen());

// Add root dialog
bot.dialog('/', function (session) {
    session.send('Watson... come here!');
});

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
