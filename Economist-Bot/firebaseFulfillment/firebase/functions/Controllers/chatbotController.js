const ClassificadorPerfil = require('./classificadorPerfilController.js');


module.exports = class ChatbotController{
  constructor(agent, requestBody){
    this.requestBody = requestBody;
    this.agent = agent;
  }
  
  welcome(){    
    return 'Olá me chamo Woody, Qual o seu nome?';
  }

  /**
   * Determina o tipo de investidor
   */
  tipoInvestidor(){
    // return new Promise((resolve, reject) => {
    //   let classificador = new ClassificadorPerfil(this.requestBody);
    //   classificador.getPerfilDeInvestimento().then(perfilInvestidor => {
    //     resolve(perfilInvestidor);
    //   }).reject(error => {
    //     console.log(error);
    //     reject(error);
    //   });
    // });
    let classificador = new ClassificadorPerfil(this.requestBody);
    return classificador.getPerfilDeInvestimento();
  }

}