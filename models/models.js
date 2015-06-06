var path = require('path');

// Postgress DATABASE_URL = postgres://user:passwd@host:port/database
// SQlite    DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user    = (url[2]||null);
var pwd     = (url[3]||null);
var protocol= (url[1]||null);
var dialect = (url[1]||null);
var port    = (url[5]||null);
var host    = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');


// Usar BDD SQlite o Postgress
var sequelize = new Sequelize(DB_name, user, pwd, 
      { dialect: protocol,
        protocol:protocol,
        port:    port,
        host:    host,
        storage: storage, //solo sqlite (.env)
        omitNull:true     // solo Postgress
  }
 );


// Usar BDD SQlite;
// var sequelize = new Sequelize(null, null, null,
//                        {dialect: "sqlite", storage: "quiz.sqlite"}
//                     );

// Importar la definicion de la tabla Quiz en quiz.js
// exportar definición de tabla Quiz

var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; 

// sequelize.sync() crea e inicializa tabla de pregutnas en DB
// success ejecuta el manejador una vez creada la tabla
// la tabla se inicializa solo si esta vacia
sequelize.sync().success(function() {
  Quiz.count().success(function (count) {
    if(count ===0) {  
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                 })
       .success(function() {console.log('Base de datos inicialiad')});
    };
  });
});

