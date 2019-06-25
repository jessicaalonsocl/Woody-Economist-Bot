'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const admin = require('firebase-admin');
admin.initializeApp();
let db = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));


  function welcome(agent) {
    let welcomeRef = db.collection('Welcome');
      return welcomeRef.get()
      .then((snapshot) => {
        let welcome = [];
          for(let doc of snapshot.docs){
            welcome.push(doc.data());
          }
          let resposta = welcome[Math.floor(Math.random() * welcome.length)];
          agent.add(resposta);

          return Promise.resolve(welcome);
      })
      .catch((err) => {
          console.log('Ocorreu um erro: ', err);
      });  
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function regrasRenda (agent){
    let solteiro = JSON.stringify(request.body.queryResult.outputContexts[0].parameters.single_widower);
    let dependentes = JSON.stringify(request.body.queryResult.outputContexts[0].parameters.question_yes_dependents);
    let divida = JSON.stringify(request.body.queryResult.outputContexts[0].parameters.question_yes_debts);
    let estadocivil;

    if(solteiro.length <= 2){
      estadocivil = 1;
    }else{ 
      estadocivil = 0;
    }

    if(dependentes.length <= 2){
      dependentes  = 0;
    }else{
      dependentes = 1;
    }

    if (divida.length <= 2){
      divida = 0;
    }else{ 
      divida = 1;
    }

    console.log(estadocivil,dependentes,divida);
    let arrayRenda = [];
    arrayRenda.push(estadocivil);
    arrayRenda.push(dependentes);
    arrayRenda.push(divida);

    return arrayRenda;
  }

  function compare(arr1, arr2){
    if (arr1.length !== arr2.length) return false;
    for (let i = 0, len = arr1.length; i < len; i++){
        if (arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true; 
    
  }

  function verificarRenda(bool, regra){
    let analisarRenda;
    console.log(bool);
    if(bool === true){
        if(regra == "R1")  analisarRenda = true;
        else if (regra == "R2")  analisarRenda = true;
        else if (regra == "R3")  analisarRenda = true;
        else if (regra == "R4")  analisarRenda = false;
        else if (regra == "R5")  analisarRenda = false;
        else if (regra == "R6")  analisarRenda = true;
        else if (regra == "R7")  analisarRenda = false;
        else if (regra == "R8")  analisarRenda = true;
      }

    return analisarRenda;
  }

  function verificarRegra(arr,arrR1,arrR2,arrR3,arrR4,arrR5,arrR6,arrR7,arrR8){
    let tipoDeRenda;
    let Regra1 = [];
    let Regra2 = [];
    let Regra3 = [];
    let Regra4 = [];
    let Regra5 = [];
    let Regra6 = [];
    let Regra7 = [];
    let Regra8 = [];

    Regra1 = compare(arr, arrR1);
    Regra2 = compare(arr, arrR2);
    Regra3 = compare(arr, arrR3);
    Regra4 = compare(arr, arrR4);
    Regra5 = compare(arr, arrR5);
    Regra6 = compare(arr, arrR6);
    Regra7 = compare(arr, arrR7);
    Regra8 = compare(arr, arrR8);

    if(Regra1 === true) tipoDeRenda = verificarRenda(Regra1,"R1");
    if(Regra2 === true) tipoDeRenda = verificarRenda(Regra2,"R2");
    if(Regra3 === true) tipoDeRenda = verificarRenda(Regra3,"R3");
    if(Regra4 === true) tipoDeRenda = verificarRenda(Regra4,"R4");
    if(Regra5 === true) tipoDeRenda = verificarRenda(Regra5,"R5");
    if(Regra6 === true) tipoDeRenda = verificarRenda(Regra6,"R6");
    if(Regra7 === true) tipoDeRenda = verificarRenda(Regra7,"R7");
    if(Regra8 === true) tipoDeRenda = verificarRenda(Regra8,"R8");

    return tipoDeRenda;
  }

  function validarRenda(agent){
    let tipoDeRenda = false;
    let arr = [];
    arr = regrasRenda(agent);
    let arrR1 = [1,1,1];
    let arrR2 = [1,1,0];
    let arrR3 = [1,0,1];
    let arrR4 = [1,0,0];
    let arrR5 = [0,0,0];
    let arrR6 = [0,1,1];
    let arrR7 = [0,1,0];
    let arrR8 = [0,0,1];
    
    let renda = "";
    tipoDeRenda = verificarRegra(arr,arrR1,arrR2,arrR3,arrR4,arrR5,arrR6,arrR7,arrR8);

    if(tipoDeRenda === true){
      renda = "Renda Comprometida";
    }else{
      renda = "Renda não Comprometida";
    }

    return (renda);
  }

  function tipoInvestidor(agent){
    let rendacomprometida = validarRenda(agent);
    console.log(rendacomprometida);
    return rendacomprometida;
  }

  function resultadoUm(agent){
    agent.add('Ok, obrigado(a)! Agora tenho o seu perfil de investidor, vou procurar aqui o melhor investimento para você.');
  }

  function resultadoDois(agent){
    let result = tipoInvestidor(agent);
    agent.add(result);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('get-reserve-no', resultadoUm);
  intentMap.set('get-satisfaction', resultadoDois);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
