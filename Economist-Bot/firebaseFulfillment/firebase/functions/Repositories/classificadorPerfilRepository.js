module.exports = class ClassificadorPerfilRepositório{
   
  //https://firebase.google.com/docs/firestore/query-data/get-data

    /**
     * Estabelecer conexao com o banco
     */
    conectiondb(){

      const admin = require('firebase-admin');
      if (!admin.apps.length) {
          admin.initializeApp();
      }
      let db = admin.firestore();

      return db;
    }

    /**
     * Obter dados do banco
     */
    getClassificadorPerfil(perfil){
        let data = db.collection('Investidor').doc(perfil);
          return data.get()
          .then((snapshot) => {
            let documents = [];
              for(let doc of snapshot.docs){
                documents.push(doc.data());
              }
              //let resposta = welcome[Math.floor(Math.random() * documents.length)];
              return Promise.resolve(documents);
            })
            .catch((err) => {
                console.log('Ocorreu um erro: ', err);
            });
    }

    /**
     * Escrever dados no banco
     */

    insertClassificadorPerfil(profile){
      return new Promise((resolve, reject) => {
        const db = this.conectiondb();
        const perfilRef = db.collection('usuario'); 
        
        perfilRef.doc(profile.email).set(profile).then(() => {
          resolve()
        }).catch(error => {
          reject(error);
        });  
      });
    }


}


