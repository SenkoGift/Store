const {ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {db, db1, db2, perms} = require("../../DataBase/index");

module.exports = {
    name:"perms",
    description:"Configure as permissões do seu bot de merda",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {
        if(interaction.user.id !== await db2.get(`owner`)) return interaction.reply({
            content:`Apenas o *OWNER/DONO* pode usar esta função!`,
            ephemeral:true
        });
        const oi = perms.all();
        let users = "";
        oi.map((user, index) => {
            users += `👥 | ${index + 1}° - <@${user.data}> - \`${user.data}\`\n`
        });
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Configuração de permissão`)
                .setDescription(`Lista de pessoas que estão na database: \n\n ${users}`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("adduserperm")
                    .setLabel("adicionar usuario")
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId("removeruserperm")
                    .setLabel("remover usuario")
                    .setStyle(4),
                )
            ],
            ephemeral:true
        })

    }
}