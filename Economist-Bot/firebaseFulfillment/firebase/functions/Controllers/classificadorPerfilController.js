const regrasRenda = require('../Model/regrasRenda.js');
const ChatbotService = require('../Services/chatbotService.js');
const ClassificadorPerfilRepository = require('../Repositories/classificadorPerfilRepository.js');

module.exports = class ClassificadorPerfil{


    constructor(requestBody){
        this.repository = new ClassificadorPerfilRepository();
        this.getDadosInvestidor(requestBody);
        this.perfilInvestidor = {
            isRendaComprometida: 0,
            isInvestidorEconomico: 0,
            toleranciaRisco: 0
        }

        this.perfilInvestidor.isRendaComprometida = this.getRendaComprometida();
        this.perfilInvestidor.isInvestidorEconomico = this.getInvestidorEconomico();
        this.perfilInvestidor.toleranciaRisco = this.getToleranciaRisco();
    }

    /** 
     * Obter dados do investidor
     */
    getDadosInvestidor(requestBody){
        this.dadosInvestidor = {
            investiu: 0,
            naoInvestiu: 0,
            grauSatisfacao: JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.number),
            economiza: 0,
            reserva: 0,
            estadoCivil: 0,
            possuiDependente: 0,
            possuiDivida: 0,
        }
        let respostaInvestiu = JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.question_yes_reserve_yes);
        this.dadosInvestidor.investiu = respostaInvestiu.length <= 2 ? 0 : 1;
        
        let respostaNaoInvestiu = JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.question_no_reserve);
        this.dadosInvestidor.naoInvestiu = respostaNaoInvestiu.length <= 2 ? 0 : 1;

        let respostaEconomiza = JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.question_yes_economy);
        this.dadosInvestidor.economiza = respostaEconomiza.length <= 2 ? 0 : 1;

        let respostaReserva = JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.question_yes_reserve);
        this.dadosInvestidor.reserva = respostaReserva.length <= 2 ? 0 : 1;

        let respostaSolteiro = JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.single_widower);
        this.dadosInvestidor.estadoCivil = respostaSolteiro.length <= 2 ? 0 : 1;

        let respostaDependente = JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.question_yes_dependents);
        this.dadosInvestidor.possuiDependente = respostaDependente.length <= 2 ? 0 : 1;

        let respostaDivida = JSON.stringify(requestBody.queryResult.outputContexts[0].parameters.question_yes_debts);
        this.dadosInvestidor.possuiDivida = respostaDivida.length <= 2 ? 0 : 1;
    }

    /**
     * Verificar se o investidor é do tipo econômico
     */
    getInvestidorEconomico(){
        if(this.dadosInvestidor.economiza == 1 && this.dadosInvestidor.reserva == 1) return 1;
        else if(this.dadosInvestidor.economiza == 1 && this.dadosInvestidor.reserva == 0) return 0;
        else if(this.dadosInvestidor.economiza == 0 && this.dadosInvestidor.reserva == 1) return 1;
        else if(this.dadosInvestidor.economiza == 0 && this.dadosInvestidor.reserva == 0) return 0;
    }

    /** 
     * Verificar a tolerância do investidor quanto aos riscos
     */
    getToleranciaRisco(){
        if(this.perfilInvestidor.isRendaComprometida == 1 && this.perfilInvestidor.isInvestidorEconomico == 1) return 2;
        else if(this.perfilInvestidor.isRendaComprometida == 1 && this.perfilInvestidor.isInvestidorEconomico == 0) return 3;
        else if(this.perfilInvestidor.isRendaComprometida == 0 && this.perfilInvestidor.isInvestidorEconomico == 1) return 1;
        else if(this.perfilInvestidor.isRendaComprometida == 0 && this.perfilInvestidor.isInvestidorEconomico == 0) return 2;
    }

    /**
     * Verificar se o investidor possue renda comprometida 
     */
    getRendaComprometida(){
        let regraRenda = regrasRenda.find(regra => {
            regra.possuiDivida === this.dadosInvestidor.possuiDivida &&
            regra.estadoCivil === this.dadosInvestidor.estadoCivil &&
            regra.possuiDependente === this.dadosInvestidor.possuiDependente
        });

        if(regraRenda !== undefined)
            return regraRenda.rendaComprometida;

        return 0;
    }

    /**
     * Retornar o tipo de perfil do investidor 
     */
    getPerfilDeInvestimento(){
        return new Promise((resolve, reject) => {
            let tipoPerfil = '';
            if(this.dadosInvestidor.grauSatisfacao >= 1 && this.dadosInvestidor.grauSatisfacao <=33){
                if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 1){
                    tipoPerfil = "perfil moderado";
                }else if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 2){
                    tipoPerfil = "perfil conservador";
                }else if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 3){
                    tipoPerfil = "perfil conservador";
                }else if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 3){
                    tipoPerfil = "perfil conservador";
                }
            }else if (this.dadosInvestidor.grauSatisfacao >= 34 && this.dadosInvestidor.grauSatisfacao <=66){
                if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 1){
                    tipoPerfil = "perfil agressivo";
                }else if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 2){
                    tipoPerfil = "perfil moderado";
                }else if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 3){
                    tipoPerfil = "perfil conservador";
                }
            }else if (this.dadosInvestidor.grauSatisfacao >= 67 && this.dadosInvestidor.grauSatisfacao <=100){
                if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 1){
                    tipoPerfil = "perfil agressivo";
                }else if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 2){
                    tipoPerfil = "perfil moderado";
                }else if(this.dadosInvestidor.investiu == 1 && this.perfilInvestidor.toleranciaRisco == 3){
                    tipoPerfil = "perfil moderado";
                }
            }else if (this.perfilInvestidor.naoInvestiu == 1){
                if(this.perfilInvestidor.toleranciaRisco == 1){
                    tipoPerfil = "perfil agressivo";
                }else if(this.perfilInvestidor.toleranciaRisco == 2){
                    tipoPerfil = "perfil moderado";
                }else if(this.perfilInvestidor.toleranciaRisco == 3){
                    tipoPerfil = "perfil conservador";
                }
            }
            let dados = {
                name: 'Name1',
                state: 'CA', 
                country: 'USA',
                email:'teste4@teste.com', 
                age: 21, 
                genre: 'F',
                date: new Date().toISOString().slice(0,10),
                profile: tipoPerfil
            };
            
            this.repository.insertClassificadorPerfil(dados).then(() => {
                resolve(dados.profile);
            }).catch(error => {
                console.log(error);
                reject();
            });
        }); 
    }
}