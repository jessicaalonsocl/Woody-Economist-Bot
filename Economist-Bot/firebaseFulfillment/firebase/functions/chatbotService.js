const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const ChatbotController = require('./chatbotController.js');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

module.exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    let controller = new ChatbotController(agent, request.body);

    function welcome(){agent.add(controller.welcome());}
    function tipoInvestidor(){agent.add(controller.tipoInvestidor());}

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    // intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('get-reserve-no', tipoInvestidor);
    intentMap.set('get-satisfaction', tipoInvestidor);
  
    agent.handleRequest(intentMap);
  });
