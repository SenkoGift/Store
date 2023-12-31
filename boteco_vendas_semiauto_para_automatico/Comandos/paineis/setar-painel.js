const {ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder} = require("discord.js");
const {db, db1, db2, perms, pn } = require("../../DataBase/index");
module.exports = {
    name:"setar-painel",
    description:"sete o painel de vendas da sua loja de merda",
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
            content:`Painel Enviado com sucesso!`,
            ephemeral:true
        })
        const select = new StringSelectMenuBuilder()
        .setCustomId(`${id}`)
        .setPlaceholder("Selecione um Produto para podê comprar!")
        .setMaxValues(1);



        const painel = await pn.get(`${id}`);

        painel.pd.map((idpd) => {
            select.addOptions(
                {
                    label:`${db.get(`${idpd}.nome`)}`,
                    description:`💸 | Valor: ${Number(db.get(`${idpd}.valor`)).toFixed(2)} - 📦 | Estoque: ${db.get(`${idpd}.estoque`).length}`,
                    value:`${db.get(`${idpd}.idproduto`)}`
                }
            )
        })
        interaction.channel.send({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${painel.titulo}`)
                .setDescription(`${painel.desc}`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    select
                )
            ]
        });

    }
}