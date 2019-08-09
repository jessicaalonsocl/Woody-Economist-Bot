
module.exports = class Investidor{
    
    constructor(requestBody){
        this.investidor = {
            name: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.name),
            state: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.state),
            country: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.country),
            email: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.email),
            age: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.age),
            genre: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.genre),
            profile: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.profile),
        }
    }
}