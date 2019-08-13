const perfilInvestidor = require('./perfil_investidor.model.js');


module.exports = class ChatbotController{
  //receber um servico por injecao de dependencia
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
    let classificador = new perfilInvestidor(this.requestBody);
    return classificador.getPerfilDeInvestimento(this.requestBody);
  }

}