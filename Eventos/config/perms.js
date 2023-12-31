const {db, db1, db2, perms} = require("../../DataBase/index");
const { GatewayIntentBits, Client, InteractionType, Collection, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name:"interactionCreate",
    run: async( interaction, client) => {
        if(interaction.isButton() && interaction.customId === "adduserperm") {

            const modal = new ModalBuilder()
            .setCustomId("permadd_modal")
            .setTitle("💢 - Adicionar permissão");
        
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Digite o ID da pessoa")
            .setStyle(1)
            .setRequired(true);
            
            modal.addComponents(new ActionRowBuilder().addComponents(text));
            return interaction.showModal(modal);
          }
          if(interaction.isButton() && interaction.customId === "removeruserperm") {
            const modal = new ModalBuilder()
            .setCustomId("permremove_modal")
            .setTitle("💢 - Remover permissão");
        
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Digite o ID da pessoa")
            .setStyle(1)
            .setRequired(true);
            
            modal.addComponents(new ActionRowBuilder().addComponents(text));
            return interaction.showModal(modal);
          } 
          if(interaction.isModalSubmit() && interaction.customId === "permadd_modal") {
            const text = interaction.fields.getTextInputValue("text");
            await perms.set(`${text}_id`, text)
            const oi = perms.all();
                let users = "";
                oi.map((user, index) => {
                    users += `👥 | ${index + 1}° - <@${user.data}> - \`${user.data}\`\n`
                });
                interaction.update({
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
          if(interaction.isModalSubmit() && interaction.customId === "permremove_modal") {
            const text = interaction.fields.getTextInputValue("text");
            perms.delete(`${text}_id`)
        
            const oi = perms.all();
                let users = "";
                oi.map((user, index) => {
                    users += `👥 | ${index + 1}° - <@${user.data}> - \`${user.data}\`\n`
                });
                interaction.update({
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
    }}