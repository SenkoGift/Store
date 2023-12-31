const {db, db1, db2, perms, pn} = require("../../DataBase/index");
const { GatewayIntentBits, Client, InteractionType, Collection, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name:"interactionCreate",
    run: async( interaction, client) => {

        if(interaction.isButton()){
            const customId = interaction.customId;
            if(customId.endsWith("_addproduct")){
                const id = customId.split("_")[0];
                const modal = new ModalBuilder()
                .setCustomId(`${id}_addproductmodal`)
                .setTitle("Adicionar Produto");

                const text = new TextInputBuilder()
                .setCustomId(`text`)
                .setLabel("Qual é o ID do produto?")
                .setStyle(1)
                .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }

            
            if(customId.endsWith("_titulomudarpainel")){
                const id = customId.split("_")[0];
                const modal = new ModalBuilder()
                .setCustomId(`${id}_tituloproduct_modal`)
                .setTitle("Modificar o Titulo");

                const text = new TextInputBuilder()
                .setCustomId(`text`)
                .setLabel("Qual será o titulo do painel?")
                .setStyle(1)
                .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }
            if(customId.endsWith("_descmudarpainel")){
                const id = customId.split("_")[0];
                const modal = new ModalBuilder()
                .setCustomId(`${id}_descmodalpainel`)
                .setTitle("Alterar Descrição");

                const text = new TextInputBuilder()
                .setCustomId(`text`)
                .setLabel("Qual será a descrição do painel?")
                .setStyle(2)
                .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }
            if(customId.endsWith("_removeproduct")){
                const id = customId.split("_")[0];
                const modal = new ModalBuilder()
                .setCustomId(`${id}_removeproductmodal`)
                .setTitle("Remover Produto");

                const text = new TextInputBuilder()
                .setCustomId(`text`)
                .setLabel("Qual é o ID do produto?")
                .setStyle(1)
                .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }

        }

        if(interaction.isModalSubmit()) {
            const customId = interaction.customId;
            if(customId.endsWith("_removeproductmodal")) {
                const id = customId.split("_")[0];
                const prod = interaction.fields.getTextInputValue("text");
                await pn.pull(`${id}.pd`, (element, index, array) => element === `${prod}`, true);

                update(id)
            }

            if(customId.endsWith("_descmodalpainel")) {
                const text = interaction.fields.getTextInputValue("text");
                const id = customId.split("_")[0];

                await pn.set(`${id}.desc`, text);

                update(id)

            }

            if(customId.endsWith("_tituloproduct_modal")){
                const text = interaction.fields.getTextInputValue("text");
                const id = customId.split(`_`)[0];

                await pn.set(`${id}.titulo`,text);

                update(id)

            }

            if(customId.endsWith("_addproductmodal")) {
                const text = interaction.fields.getTextInputValue("text");
                const id = customId.split("_")[0];

                const a = await pn.get(`${id}.pd`)

                if(a.includes(text)) return interaction.reply({content:`Você já adicionou este produto!`, ephemeral:true});

                await pn.push(`${id}.pd`, text);

                update(id)

            }



        }

        async function update(id) {
            if(!pn.get(`${id}`)) return interaction.reply({content:`Este Painel Não existe!`, ephemeral:true});
        let prod = "";
        pn.get(`${id}.pd`).map((pd) => {
            prod += `**ID:** ${pd} \nNome do Produto:${db.get(`${pd}.nome`)} | Valor: ${Number(db.get(`${pd}.valor`)).toFixed(2)} \n\n`
        });


        interaction.update({
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
        }

    }}