const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const ChatbotController = require('../user/perfil_investidor.controller.js');
const functions = require('firebase-functions');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


module.exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    let controller = new ChatbotController(agent, request.body);

    function welcome(){agent.add(controller.welcome());}
    // function investidor(){
    //     controller.tipoInvestidor().then(tipoInvestidor => {
    //         tipoInvestidor = controller.tipoInvestidor();
    //         agent.add(tipoInvestidor);
    //     });
    // }
    function investidor(){agent.add(controller.tipoInvestidor());}

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    // intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('get-reserve-no', investidor);
    intentMap.set('get-satisfaction', investidor);

    agent.handleRequest(intentMap);
  });



  





