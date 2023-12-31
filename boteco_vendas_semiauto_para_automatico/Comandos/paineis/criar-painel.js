const {ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder} = require("discord.js");
const {db, db1, db2, perms, pn } = require("../../DataBase/index");
module.exports = {
    name:"criar-painel",
    description:"Crie painel de vendas da sua loja de merda",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name:"id",
            description:"Qual será o ID do painel?",
            type:ApplicationCommandOptionType.String,
            required:true
        },
        {
          name:"id-produto",
          description:"Qual é o ID do produto?",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
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
        const id = interaction.options.getString("id");
        const idpd = interaction.options.getString("id-produto");
        const user = perms.get(`${interaction.user.id}_id`)
        if(!user) return interaction.reply({content:"Você não tem permissão para usar está função", ephemeral:true});

        if(!db.get(`${idpd}`)) return interaction.reply({content:`Este Produto não existe!`, ephemeral:true});
        if(pn.get(`${id}`)) return interaction.reply({content:`Este Painel já existe!`, ephemeral:true});

        interaction.reply({
            content:`Painel Criado com sucesso`,
            ephemeral:true
        });
        interaction.channel.send({
            embeds:[
                new EmbedBuilder()
                .setTitle(`Sem Nome | Painel`)
                .setDescription(`# Sem Descrição...`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .addOptions(
                        {
                            label:`${db.get(`${idpd}.nome`)}`,
                            description:`💸 | Valor: ${Number(db.get(`${idpd}.valor`)).toFixed(2)} - 📦 | Estoque: ${db.get(`${idpd}.estoque`).length}`,
                            value:`${db.get(`${idpd}.idproduto`)}`
                        }
                    )
                    .setCustomId(`${id}`)
                    .setPlaceholder("Selecione um Produto para podê comprar!")
                    .setMaxValues(1)
                )
            ]
        });

        await pn.set(`${id}`, {
            idpn: id,
            titulo: "Sem Nome | Painel",
            desc: '# Sem Descrição...',
            pd: [`${idpd}`]
        })

    }
}