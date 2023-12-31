const {} = require("discord.js");


module.exports = {
    name:"ready",
    run:async(client) => {

        console.log(`🔥 Estou online em ${client.user.username}!`);
        console.log(`🔥 Tenho ${client.users.cache.size} Amiguinhus :D`);
        console.log(`🔥 Estou em ${client.guilds.cache.size}, Servidores XD`);

    }
}