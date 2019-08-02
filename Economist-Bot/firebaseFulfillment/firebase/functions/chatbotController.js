const ChatbotService = require('./chatbotService.js');
const ClassificadorPerfil = require('./classificadorPerfil.js');

module.exports = class ChatbotController{
  constructor(agent, requestBody){
    this.requestBody = requestBody;
    this.agent = agent;
  }
  
  welcome(){
    return 'Olá';
  }

  /**
   * Determin o tipo de investidor
   */
  tipoInvestidor(){
    let classificador = new ClassificadorPerfil(this.requestBody);
    return classificador.getPerfilDeInvestimento();
  }

}