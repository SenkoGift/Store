const {ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {db, db1, db2, perms} = require("../../DataBase/index");

module.exports = {
    name:"configurar",
    description:"configure um produto da sua loja de merda",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name:"id",
            description:"Qual é o ID?",
            type:ApplicationCommandOptionType.String,
            required:true,
            autocomplete: true,
        }
    ],
    async autocomplete(interaction) {
      const value = interaction.options.getFocused().toLowerCase();
      let choices = await db.all().filter(pd => pd.ID)
  
      const filtered = choices.filter(choice => choice.ID.toLowerCase().includes(value)).slice(0, 25);
  
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
              filtered.map(choice => ({ name: `ID  - ${choice.ID} | Nome -  ${choice.data.nome}`, value: choice.ID}))
          );
      }
  }, 
    run: async(client, interaction) => {
        const user = perms.get(`${interaction.user.id}_id`)
        if(!user) return interaction.reply({content:"Você não tem permissão para usar está função", ephemeral:true})
        const id = interaction.options.getString("id");
        const dbsss = await db.get(`${id}`);
        if(!dbsss) return interaction.reply({content:`Olá ${interaction.user}, este ID de produto não existe! use /criar para podê usar está função !`, ephemeral:true});
        let banner; 
        const asd = `${dbsss.banner}`
        if(asd.startsWith("https://")) {
            banner = `[**Clique Aqui**](${dbsss.banner})`
        } else {
            banner = "`Banner não Configurado....`"
        }
        const stock = dbsss.estoque
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Configurando Produto.`)
                .setDescription(`Olá ${interaction.user}, seja bem vindo ao painel de configuração de produto, verifique abaixo as informações \n\n\n 📋 | ID Produto: ${id} \n ✏ | Titulo Atual: ${dbsss.titulo} \n ✏ | Descrição Atual: ${dbsss.desc} \n 📝 | Nome Produto: ${dbsss.nome} \n 💸 | Valor: ${dbsss.valor} \n Minimo de compra: ${dbsss.minimo} \n Estoque: ${stock.length} \n Banner Atual: ${banner}`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${id}_titulo`)
                    .setLabel("Alterar Titulo do Produto")
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${id}_nome`)
                    .setLabel("Alterar Nome do Produto")
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${id}_desc`)
                    .setLabel("Alterar Descrição do Produto")
                    .setStyle(3),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${id}_banner`)
                    .setLabel("Trocar o Banner")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${id}_min`)
                    .setLabel("Alterar Minimo")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${id}_stock`)
                    .setLabel("Estoque")
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${id}_valor`)
                    .setLabel("Alterar Valor")
                    .setStyle(1),
                )
            ],
            ephemeral:true
        })
    }
}