const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./DataBase/produtos.json"});
const db1 = new JsonDatabase({databasePath:"./DataBase/carrinho.json"});
const db2 = new JsonDatabase({databasePath:"./DataBase/config.json"});
const pn = new JsonDatabase({databasePath:"./DataBase/painel.json"});
const perms = new JsonDatabase({databasePath:"./DataBase/perms.json"});


module.exports.db = db
module.exports.db1 = db1
module.exports.db2 = db2
module.exports.perms = perms
module.exports.pn = pn