// const perfilInvestidorModel = require('./perfil_investidor.model.js');
const dbManager = require('../utils/db_manager.js');

module.exports = class perfilInvestidorController{
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
  tipoInvestidor(perfilInvestidorModel){
    let classificadorPerfil = new perfilInvestidorModel(this.requestBody);
    return classificadorPerfil.getPerfilDeInvestimento(this.requestBody, dbManager);
  }

}