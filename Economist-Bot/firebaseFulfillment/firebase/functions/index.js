'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    var tipoInvestidorRef = db.collection('Investidor');
      return tipoInvestidorRef.get()
      .then((snapshot) => {
        let tipoInvestidor = [];
          for(let doc of snapshot.docs){
            tipoInvestidor.push(doc.data());
            console.log(tipoInvestidor[0].Moderado);
            var resposta = tipoInvestidor[0].Moderado;
            //console.log(tipoInvestidor[0].Pergunta1);
            //var resposta = tipoInvestidor[0].Pergunta1;
            //console.log(doc.id, '=>', doc.data());
            agent.add(resposta);
  
          }
          return Promise.resolve(tipoInvestidor);
      })
      .catch((err) => {
          console.log('Ocorreu um erro: ', err);
      });  
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }


  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
