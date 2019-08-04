module.exports = class ClassificadorPerfilRepositório{
   
    insertClassificadorPerfil(perfil){
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
}


