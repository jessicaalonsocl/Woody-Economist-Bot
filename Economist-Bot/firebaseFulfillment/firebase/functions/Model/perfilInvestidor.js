
module.exports = class Investidor{
    
    constructor(requestBody){
        this.usuario = {
            name: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.nome),
            state: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.Estado),
            email: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.email),
            age: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.age),
            date: new Date().toISOString().slice(0,10),
            profile: ""
        }

        // this.usuario.profile = this.PerfilInvestidor(profile);

    }
    UsuarioDados(perfil){
        this.usuario.profile = perfil;
        return this.usuario;
    }

}

