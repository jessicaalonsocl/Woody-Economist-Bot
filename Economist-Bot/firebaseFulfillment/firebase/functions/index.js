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

  function verificaPerfil(tipoTolerante){
    let investiu = JSON.stringify(request.body.queryResult.outputContexts[0].parameters.question_yes_reserve_yes);
    let naoInvestiu = JSON.stringify(request.body.queryResult.outputContexts[0].parameters.question_no_reserve_no);
    let grau = JSON.stringify(request.body.queryResult.outputContexts[0].parameters.number);
    let tipoPerfil = "";

    if(investiu.length <= 2){
      investiu = 0;
    }else{ 
      investiu = 1;
    }
    console.log(naoInvestiu);
    console.log(naoInvestiu.length);
    if(naoInvestiu.length <= 2){
      naoInvestiu = 0;
    }else{ 
      naoInvestiu = 1;
    }

    if(grau >= 1 && grau <=33){
      if(investiu == 1 && tipoTolerante == 1){
        tipoPerfil = "perfil moderado";
      }else if(investiu == 1 && tipoTolerante == 2){
        tipoPerfil = "perfil conservador";
      }else if(investiu == 1 && tipoTolerante == 3){
        tipoPerfil = "perfil conservador";
      }else if(investiu == 1 && tipoTolerante == 3){
        tipoPerfil = "perfil conservador";
      }
    }else if (grau >= 34 && grau <=66){
      if(investiu == 1 && tipoTolerante == 1){
        tipoPerfil = "perfil agressivo";
      }else if(investiu == 1 && tipoTolerante == 2){
        tipoPerfil = "perfil moderado";
      }else if(investiu == 1 && tipoTolerante == 3){
        tipoPerfil = "perfil conservador";
      }
    }else if (grau >= 67 && grau <=100){
      if(investiu == 1 && tipoTolerante == 1){
        tipoPerfil = "perfil agressivo";
      }else if(investiu == 1 && tipoTolerante == 2){
        tipoPerfil = "perfil moderado";
      }else if(investiu == 1 && tipoTolerante == 3){
        tipoPerfil = "perfil moderado";
      }
    }else if (naoInvestiu == 1){
      if(tipoTolerante == 1){
        tipoPerfil = "perfil agressivo";
      }else if(tipoTolerante == 2){
        tipoPerfil = "perfil moderado";
      }else if(tipoTolerante == 3){
        tipoPerfil = "perfil conservador";
      }
    }

    return tipoPerfil;
    
  }

  function regrasTolerante (resultRenda, resultEconomico){
      let verificaTolerante;

      // tolerante = 1
      // pouco tolerante = 2 
      // nao tolerante = 3
 
      if(resultRenda == 1 && resultEconomico == 1) verificaTolerante = 2;
      if(resultRenda == 1 && resultEconomico == 0) verificaTolerante = 3;
      if(resultRenda == 0 && resultEconomico == 1) verificaTolerante = 1;
      if(resultRenda == 0 && resultEconomico == 0) verificaTolerante = 2;

      return verificaTolerante;

  }
  
  function regrasEconomico (agent){
    let economiza = JSON.stringify(request.body.queryResult.outputContexts[0].parameters.question_yes_economy);
    let reserva = JSON.stringify(request.body.queryResult.outputContexts[0].parameters.question_yes_reserve);

    if(economiza.length <= 2){
      economiza = 0;
    }else{ 
      economiza = 1;
    }

    if(reserva.length <= 2){
      reserva  = 0;
    }else{
      reserva = 1;
    }

    let arrayEconomico = [];
    arrayEconomico.push(economiza);
    arrayEconomico.push(reserva);

    console.log(arrayEconomico);

    return arrayEconomico;

  }

  function validarRegrasEconomico(agent){
    let arrayEconomico = regrasEconomico (agent);
    let economico;

    // economico = 1
    // não economico = 0
    if(arrayEconomico[0] == 1 && arrayEconomico[1]== 1) economico = 1;
    if(arrayEconomico[0] == 1 && arrayEconomico[1]== 0) economico = 0;
    if(arrayEconomico[0] == 0 && arrayEconomico[1]== 1) economico = 1;
    if(arrayEconomico[0] == 0 && arrayEconomico[1]== 0) economico = 0;
  
    console.log(economico);
    return economico;

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

    // Renda comprometida = 1
    // Renda não comprometida = 0
    if(tipoDeRenda === true){
      renda = 1;
    }else{
      renda = 0;
    }

    return (renda);
  }

  function tipoInvestidor(agent){
    let resultRenda = validarRenda(agent);
    let resultEconomico = validarRegrasEconomico (agent);
    let usuarioTolerancia = regrasTolerante(resultRenda, resultEconomico);
    let perfilUsuario = verificaPerfil(usuarioTolerancia);

    return perfilUsuario;
  }

  function resultadoUm(agent){
    let result = tipoInvestidor(agent);
    agent.add(result);
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

  agent.handleRequest(intentMap);
});
