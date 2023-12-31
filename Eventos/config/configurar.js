const {db, db1, db2, perms} = require("../../DataBase/index");
const { GatewayIntentBits, Client, InteractionType, Collection, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name:"interactionCreate",
    run: async( interaction, client) => {
        if(interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu() ) {
            const customId = interaction.customId;
            if(customId.endsWith("_titulo")) {
              const id = customId.split("_")[0];
              const modal = new ModalBuilder()
              .setTitle(`💢 - Configurar Titulo`)
              .setCustomId(`${id}_titulomodal`);
        
              const text = new TextInputBuilder()
              .setCustomId(`text`)
              .setStyle(1)
              .setRequired(true)
              .setLabel("Qual será o novo titulo?");
        
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(customId.endsWith("_titulomodal")) {
              const id = customId.split("_")[0];
              const text = interaction.fields.getTextInputValue("text");
              await db.set(`${id}.titulo`, text);
              voltar(id)
            }
        
        
        
            if(customId.endsWith("_nome")) {
              const id = customId.split("_")[0];
              const modal = new ModalBuilder()
              .setTitle(`💢 - Configurar Nome`)
              .setCustomId(`${id}_nomemodal`);
        
              const text = new TextInputBuilder()
              .setCustomId(`text`)
              .setStyle(1)
              .setRequired(true)
              .setLabel("Qual será o novo nome?");
        
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(customId.endsWith("_nomemodal")) {
              const id = customId.split("_")[0];
              const text = interaction.fields.getTextInputValue("text");
              await db.set(`${id}.nome`, text);
              voltar(id)
            }
        
        
            if(customId.endsWith("_desc")) {
              const id = customId.split("_")[0];
              const modal = new ModalBuilder()
              .setTitle(`💢 - Configurar Descrição`)
              .setCustomId(`${id}_descmodal`);
        
              const text = new TextInputBuilder()
              .setCustomId(`text`)
              .setStyle(2)
              .setRequired(true)
              .setLabel("Qual será a nova descrição?");
        
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(customId.endsWith("_descmodal")) {
              const id = customId.split("_")[0];
              const text = interaction.fields.getTextInputValue("text");
              await db.set(`${id}.desc`, text);
              voltar(id)
            }
        
        
        
            if(customId.endsWith("_banner")) {
              const id = customId.split("_")[0];
              const modal = new ModalBuilder()
              .setTitle(`💢 - Configurar Banner`)
              .setCustomId(`${id}_bannermodal`);
        
              const text = new TextInputBuilder()
              .setCustomId(`text`)
              .setStyle(1)
              .setRequired(true)
              .setPlaceholder("Caso deseja retirar digite: remover")
              .setLabel("Qual será o novo banner?");
        
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(customId.endsWith("_bannermodal")) {
              const id = customId.split("_")[0];
              const text = interaction.fields.getTextInputValue("text");
              if(text === "remover") {
                await db.set(`${id}.banner`, text);
                voltar(id);
                return;
              }
              try {
                interaction.reply({
                  content:"esta sera seu novo banner:",
                  ephemeral:true,
                  embeds:[
                    new EmbedBuilder()
                    .setImage(text)
                  ]
                })
                await db.set(`${id}.banner`, text);
              } catch {
                interaction.reply({
                  content:`Você não colocou uma url valida!`,
                  ephemeral:true
                })
              }
            }
        
        
        
            if(customId.endsWith("_min")) {
              const id = customId.split("_")[0];
              const modal = new ModalBuilder()
              .setTitle(`💢 - Configurar Minimo`)
              .setCustomId(`${id}_minmodal`);
        
              const text = new TextInputBuilder()
              .setCustomId(`text`)
              .setStyle(1)
              .setRequired(true)
              .setLabel("Qual será o novo Minimo?");
        
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(customId.endsWith("_minmodal")) {
              const id = customId.split("_")[0];
              const text = interaction.fields.getTextInputValue("text");
              if(isNaN(text)) {
                return interaction.reply({
                  content:`Coloque um numero!`,
                  ephemeral:true
                })
              }
              await db.set(`${id}.minimo`, Number(text));
              voltar(id)
            }
        
        
        
            if(customId.endsWith("_valor")) {
              const id = customId.split("_")[0];
              const modal = new ModalBuilder()
              .setTitle(`💢 - Alterar Valor`)
              .setCustomId(`${id}_valormodal`);
        
              const text = new TextInputBuilder()
              .setCustomId(`text`)
              .setStyle(1)
              .setRequired(true)
              .setPlaceholder("10.00")
              .setLabel("Qual será o novo Valor?");
        
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(customId.endsWith("_valormodal")) {
              const id = customId.split("_")[0];
              const text = interaction.fields.getTextInputValue("text");
              if(isNaN(text)) {
                return interaction.reply({
                  content:`Coloque um numero!`,
                  ephemeral:true
                })
              }
              await db.set(`${id}.valor`, Number(text));
              voltar(id)
            }
            if(customId.endsWith("_stock")) {
              const id = customId.split("_")[0];
              stock(id)
            }
            if(customId.endsWith("_addestoque")) {
              const id = customId.split("_")[0];
              const modal = new ModalBuilder()
              .setCustomId(`${id}_addmodal`)
              .setTitle("Adicionar Estoque");
        
              const text = new TextInputBuilder()
              .setLabel("Adicione o estoque que você deseja")
              .setStyle(2)
              .setRequired(true)
              .setCustomId("text");
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(customId.endsWith("_addmodal")) {
              const id = customId.split("_")[0];
              const text = interaction.fields.getTextInputValue("text").split("\n");
              
              text.map((asd) => {
                db.push(`${id}.estoque`, asd)
              });
              stock(id)
            }
            if(customId.endsWith("_removerestoque")) {
              const id = customId.split("_")[0];
              const modal = new ModalBuilder()
              .setCustomId(`${id}_removmodal`)
              .setTitle("Remover Estoque");
        
              const text = new TextInputBuilder()
              .setLabel("COLOQUE [SIM] OU [NÃO]")
              .setStyle(1)
              .setPlaceholder("Lembre-se, isso apagara todo o seu estoque")
              .setRequired(true)
              .setMaxLength(3)
              .setCustomId("text");
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(customId.endsWith("_removmodal")) {
              const id = customId.split("_")[0];
              const text = interaction.fields.getTextInputValue("text");
        
              if(text === "SIM" || text === "Sim" || text === "sim") {
                await db.set(`${id}.estoque`, []);
                stock(id)
                return;
              } else if(text === "NÃO" || text === "Não" || text === "não") {
                stock(id);
                return;
              }  else {
                stock(id)
              }
        
              
            }
            if(customId.endsWith("_voltar")) {
              const id = customId.split("_")[0];
              voltar(id);
            }
          }
        
          async function stock (id) {
            const stock = await db.get(`${id}.estoque`);
            let est = "";
            if(stock.length <= 0) {
              est = "Este Produto está sem estoque!"
            } else {
              stock.map((sd, index) => {
                est += `📦 | ${index + 1}° - **${sd}**\n`
              })
            }
        
        
            interaction.update({
              embeds:[
                new EmbedBuilder()
                .setDescription(`${est}`)
              ],
              components:[
                new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                  .setCustomId(`${id}_addestoque`)
                  .setStyle(3)
                  .setLabel("Adicionar Estoque"),
                  new ButtonBuilder()
                  .setCustomId(`${id}_removerestoque`)
                  .setStyle(4)
                  .setLabel("Remover Estoque"),
                  new ButtonBuilder()
                  .setCustomId(`${id}_voltar`)
                  .setStyle(2)
                  .setLabel("Voltar"),
                )
              ]
            })
          }
          async function voltar(id) {
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
                interaction.update({
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
                    ]
                })
          }

    }
}