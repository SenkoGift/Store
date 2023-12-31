const {ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder} = require("discord.js");
const {db, db1, db2, perms, pn } = require("../../DataBase/index");
module.exports = {
    name:"configurar-painel",
    description:"Configure painel de vendas da sua loja de merda",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
          name:"id",
          description:"Qual é o ID do Painel?",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        }
    ],
    async autocomplete(interaction) {
      const value = interaction.options.getFocused().toLowerCase();
      let choices = await pn.all().filter(pd => pd.data.idpn)
  
      const filtered = choices.filter(choice => choice.data.idpn.toLowerCase().includes(value)).slice(0, 25);
  
      if(!interaction) return;
      if(interaction.user.id !== perms.get(`${interaction.user.id}_id`) && interaction.user.id !== db2.get(`owner`)) {
          return interaction.respond([
              { name:"Você não tem Permissão para usar!", value:`asdnosaudn127n93612nyndsyadnaudb`}
          ])
        } else if(choices.length === 0){ 
          await interaction.respond([
              { name: "Crie um Painel!", value: "a29183912asd92384XASDASDSADASDSADASDASD12398212222" }
          ])
      } else if(filtered.length === 0) {
          await interaction.respond([
              { name: "Não Achei Nenhum Painel", value: "a29183912asd92384XASDASDSADASDSADASDASD1239821" }
          ]);
      } else {
          await interaction.respond(
              filtered.map(choice => ({ name: `ID  - ${choice.data.idpn}`, value: choice.data.idpn}))
          );
      }
  }, 
    run: async(client, interaction) => {
        const id = interaction.options.getString("id");
        const user = perms.get(`${interaction.user.id}_id`)
        if(!user) return interaction.reply({content:"Você não tem permissão para usar está função", ephemeral:true});


        if(!pn.get(`${id}`)) return interaction.reply({content:`Este Painel Não existe!`, ephemeral:true});
        let prod = "";
        pn.get(`${id}.pd`).map((pd) => {
            prod += `**ID:** ${pd} \nNome do Produto:${db.get(`${pd}.nome`)} | Valor: ${Number(db.get(`${pd}.valor`)).toFixed(2)} \n\n`
        });


        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Configuração de Painel`)
                .setDescription(`Titulo Atual: ${pn.get(`${id}.titulo`)} \n Descrição: ${pn.get(`${id}.desc`)} \n# Lista de Produtos no Painel:\n ${prod}`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${id}_addproduct`)
                    .setLabel("Adicionar Produto")
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${id}_titulomudarpainel`)
                    .setLabel("Mudar Titulo")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${id}_descmudarpainel`)
                    .setLabel("Mudar Descrição")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${id}_removeproduct`)
                    .setLabel("Remover Produto")
                    .setStyle(4),
                )
            ]
        })
        interaction.channel.send({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${db.get(`${id}`)}`)
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
                    .setCustomId("carrinhopainel")
                    .setPlaceholder("Selecione um Produto para podê comprar!")
                    .setMaxValues(1)
                )
            ]
        });
    }
}