const {ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {db, db1, db2, perms} = require("../../DataBase/index");

module.exports = {
    name:"setar",
    description:"Sete o produto da sua loja de merda",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name:"id",
            description:"Qual será o id?",
            type:ApplicationCommandOptionType.String,
            autocomplete: true,
            required:true
        }
    ],
    async autocomplete(interaction) {
      const value = interaction.options.getFocused().toLowerCase();
      let choices = await db.all().filter(pd => pd.data.idproduto)
  
      const filtered = choices.filter(choice => choice.data.idproduto.toLowerCase().includes(value)).slice(0, 25);
  
      if(!interaction) return;
      if(interaction.user.id !== perms.get(`${interaction.user.id}_id`) && interaction.user.id !== db2.get(`owner`)) {
          return interaction.respond([
              { name:"Você não tem Permissão para usar!", value:`asdnosaudn127n93612nyndsyadnaudb`}
          ])
        } else if(choices.length === 0){ 
          await interaction.respond([
              { name: "Crie um produto!", value: "a29183912asd92384XASDASDSADASDSADASDASD12398212222" }
          ])
      } else if(filtered.length === 0) {
          await interaction.respond([
              { name: "Não Achei Nenhum produto", value: "a29183912asd92384XASDASDSADASDSADASDASD1239821" }
          ]);
      } else {
          await interaction.respond(
              filtered.map(choice => ({ name: `ID  - ${choice.data.idproduto} | Nome -  ${choice.data.nome}`, value: choice.data.idproduto}))
          );
      }
  }, 
    run: async(client, interaction) => {
        const user = perms.get(`${interaction.user.id}_id`)
        if(!user) return interaction.reply({content:"Você não tem permissão para usar está função", ephemeral:true})
        const id = interaction.options.getString("id");
        const dbsss = await db.get(`${id}`);
        if(!dbsss) return interaction.reply({content:`Olá ${interaction.user}, este ID de produto não existe! use /criar para podê usar está função !`, ephemeral:true});
        try {
            const embed = new EmbedBuilder()
            .setTitle(dbsss.titulo)
            .setDescription(`${dbsss.desc} \n 🪐 | Produto: ${dbsss.nome} \n 💸 | Valor: ${Number(dbsss.valor).toFixed(2)} \n 📦 | Estoque: ${dbsss.estoque.length}`)
            .setColor("Default");

            if(dbsss.banner.startsWith("https://")) {
                embed.setImage(dbsss.banner);
            }

        interaction.channel.send({
            embeds:[
                embed
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
                content:"Produto Setado com sucesso!",
                ephemeral:true
            })
        })
        } catch {
            interaction.reply({
                content:"Ocorreu um erro ao tentar setar este produto...",
                ephemeral:true
            });
            return;
        }
    }
}