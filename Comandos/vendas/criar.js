const {ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {db, db1, db2, perms} = require("../../DataBase/index");
module.exports = {
    name:"criar",
    description:"Crie o produto da sua loja de merda",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name:"id",
            description:"Qual será o id?",
            type:ApplicationCommandOptionType.String,
            required:true
        }
    ],
    run: async(client, interaction) => {
        const user = perms.get(`${interaction.user.id}_id`)
        if(!user) return interaction.reply({content:"Você não tem permissão para usar está função", ephemeral:true})
        const id = interaction.options.getString("id");
        const dbsss = await db.get(`${id}`);
        if(dbsss) return interaction.reply({content:`Olá ${interaction.user}, este ID de produto existe! use /configurar para configura-lo !`, ephemeral:true});
        try {
            
        interaction.channel.send({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${id} | Sem Titulo...`)
                .setDescription(`\`\`\` Sem Descrição... \`\`\` \n 🪐 | Produto: ${id} \n 💸 | Valor: 10.00 \n 📦 | Estoque: 0`)
                .setColor("Default")
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${id}`)
                    .setStyle(3)
                    .setLabel("Comprar Produto")
                    .setEmoji("🛒")
                )
            ]
        }).then(() => {
            interaction.reply({
                content:"Produto Criado com sucesso!",
                ephemeral:true
            })
        })
        } catch {
            interaction.reply({
                content:"Ocorreu um erro ao tentar criar este produto...",
                ephemeral:true
            });
            return;
        }

        await db.set(`${id}`, {
            idproduto: id,
            titulo: `${id} | Sem Titulo...`,
            desc: `\`\`\` Sem Descrição... \`\`\``,
            nome: id,
            valor: 10.00,
            estoque: [],
            minimo: 1,
            banner:"remover"
        })
    }
}