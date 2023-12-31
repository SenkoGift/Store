const {db, db1, db2, perms, pn} = require("../../DataBase/index");
const { GatewayIntentBits, Client, InteractionType, Collection, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, StringSelectMenuBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const mercadopago = require("mercadopago")
const axios = require('axios')

module.exports = {
    name:"interactionCreate",
    run: async( interaction, client) => {
        if(interaction.isButton() || interaction.isStringSelectMenu()) {
          let ides = await db.get(`${interaction.customId}`);
          let tis = "produto"
          if(!ides) {
            if(interaction.isStringSelectMenu()) {
              ides = await db.get(`${interaction.values[0]}`);
              tis = "select"
            }
          }


            const eprod = ides;
            if(eprod) {
              const channs = interaction.guild.channels.cache.find(channel => channel.topic === interaction.user.id);
              if(channs) {
                return interaction.reply({content:`Olá ${interaction.user}, você ja tem um carrinho!`, ephemeral:true, components:[
                  new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setStyle(5)
                    .setLabel("Ir para o Carrinho")
                    .setURL(channs.url)
                  )
                ]})
              }
              if(eprod.estoque.length <= 0) {
                return interaction.reply({content:`Este Produto está sem estoque`, ephemeral:true})
              }
              let id = interaction.customId;
              if(interaction.isStringSelectMenu()) {
                id = interaction.values[0]
              }
        
              await interaction.reply({
                content:`Estou Criando seu carrinho aguarde...`,
                ephemeral:true
              });
              const dbsss = ides
              if(tis === "produto") {
                const embed = new EmbedBuilder()
              .setTitle(dbsss.titulo)
              .setDescription(`${dbsss.desc} \n 🪐 | Produto: ${dbsss.nome} \n 💸 | Valor: ${Number(dbsss.valor).toFixed(2)} \n 📦 | Estoque: ${dbsss.estoque.length}`)
              .setColor("Default");
        
              if(dbsss.banner.startsWith("https://")) {
                  embed.setImage(dbsss.banner);
              }
        
          interaction.message.edit({
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
          })
              } else {
                const select = new StringSelectMenuBuilder()
        .setCustomId(`${interaction.customId}`)
        .setPlaceholder("Selecione um Produto para podê comprar!")
        .setMaxValues(1);



        const painel = await pn.get(`${interaction.customId}`);

        painel.pd.map((idpd) => {
            select.addOptions(
                {
                    label:`${db.get(`${idpd}.nome`)}`,
                    description:`💸 | Valor: ${Number(db.get(`${idpd}.valor`)).toFixed(2)} - 📦 | Estoque: ${db.get(`${idpd}.estoque`).length}`,
                    value:`${db.get(`${idpd}.idproduto`)}`
                }
            )
        })
        interaction.message.edit({
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
              interaction.guild.channels.create({
                name:`🛒-${interaction.user.username}`,
                topic: interaction.user.id,
                permissionOverwrites: [
                  {
                    id: interaction.user.id,
                    allow:["ViewChannel", "SendMessages"],
                  },
                  {
                    id: interaction.guild.id,
                    deny:["ViewChannel", "SendMessages"],
                  },
                  {
                    id: await db2.get(`cargoperm`),
                    allow:["ViewChannel", "SendMessages"],
                  },
                ],
                parent: await db2.get(`categoria_carrinho`)
              }).then((channel) => {
                db1.set(`${channel.id}_carrinho`, {
                  channel: channel.id,
                  user: interaction.user.id,
                  produto: id,
                  quantidade: 1,
                  status: 1
                });
                interaction.editReply({
                  content:`Seu Carrinho foi criado com sucesso!`,
                  ephemeral:true,
                  components:[
                    new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                      .setStyle(5)
                      .setLabel("Ir para o Carrinho")
                      .setURL(channel.url)
                    )
                  ]
                })
                channel.send({
                  embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.member.displayName} | Carrinho`)
                    .setDescription(`Olá ${interaction.user}, Seja Bem vindo ao nosso carrinho, gostaria de lhe informar que para continuar recomendo testar sua DM, e também ler o nossos **TERMOS** para evitar Futuros problemas! Caso ja tenha feito ambas ações, pode prosseguir com a sua compra`)
                  ],
                  components:[
                    new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                      .setCustomId(`${interaction.user.id}_continuarcompra`)
                      .setLabel("Continuar Compra")
                      .setStyle(3),
                      new ButtonBuilder()
                      .setCustomId(`testardm`)
                      .setLabel("Testar DM")
                      .setStyle(1),
                      new ButtonBuilder()
                      .setCustomId(`termos`)
                      .setLabel("Veja os Termos")
                      .setStyle(1),
                      new ButtonBuilder()
                      .setCustomId(`${interaction.user.id}_cancelarcompra`)
                      .setEmoji("❌")
                      .setStyle(4),
                    )
                  ]
                }).then(() => {
                  
                channel.send({
                  embeds:[
                    new EmbedBuilder()
                    .setTitle(`Produto: ${dbsss.nome}`)
                    .setDescription(`Valor: ${Number(dbsss.valor).toFixed(2)} \n Quantidade: 1 \n Estoque: ${dbsss.estoque.length} \n\n Total a Pagar: ${Number(dbsss.valor) * 1}`)
                  ],
                  components:[
                    new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                      .setCustomId(`${interaction.user.id}_removerprod`)
                      .setEmoji("➖")
                      .setStyle(3),
                      new ButtonBuilder()
                      .setCustomId(`${interaction.user.id}_editprod`)
                      .setEmoji("✏")
                      .setStyle(2),
                      new ButtonBuilder()
                      .setCustomId(`${interaction.user.id}_adicionarprod`)
                      .setEmoji("➕")
                      .setStyle(3),
                    )
                  ]
                })
                })
                const chans = interaction.guild.channels.cache.get(`${db2.get(`canal_logs`)}`)
                if(chans) {
                  chans.send({
                    embeds:[
                      new EmbedBuilder()
                      .setTitle(`${interaction.guild.name} | NOVO CARRINHO!`)
                      .setDescription(`Usuaro: ${interaction.user} está comprando o Produto do ID: ${id}`)
                    ],
                    components:[
                    new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                      .setCustomId("siduofosdyfnsdiya876123")
                      .setLabel("Mensagem Automatica")
                      .setStyle(2)
                      .setDisabled(true)
                    )
                  ]
                  })
                }
        
              })
            }
          }
          if(interaction.isButton() || interaction.isModalSubmit()) {
            const customId = interaction.customId;
            if(customId.endsWith("_continuarcompra")) {
              const userid = customId.split("_")[0];
              if(interaction.user.id !== userid) return interaction.deferUpdate();
              const dbss = await db1.get(`${interaction.channel.id}_carrinho`);
              let ides = await db.get(`${dbss.produto}`);
          let tis = "produto"
          if(!ides) {
            if(interaction.isStringSelectMenu()) {
              ides = await db.get(`${interaction.values[0]}`);
            tis = "select"
            }
          }


            const prod = ides;
              if(Number(dbss.quantidade) < prod.minimo) {
                interaction.reply({
                  content:`Olá ${interaction.user}, este Produto está com a minima dê ${prod.minimo}, ele aceita este minimo de compra!`,
                  ephemeral:true
                });
                return;
              }
              await interaction.channel.bulkDelete(50).then(() => {
                
                mercadopago.configurations.setAccessToken(db2.get(`access_token`))
                var payment_data = {
                  transaction_amount: Number(dbss.quantidade) * Number(prod.valor),
                  description: `Comprar Produto - ${interaction.user.username}`,
                  payment_method_id: "pix",
                  payer: {
                    email: "schemaposse@gmail.com",
                    first_name: "Paula",
                    last_name: "Guimaraes",
                    identification: {
                      type: "CPF",
                      number: "07944777984",
                  },
                  address: {
                    zip_code: "06233200",
                    street_name: "Av. das Nações Unidas",
                    street_number: "3003",
                    neighborhood: "Bonfim",
                    city: "Osasco",
                    federal_unit: "SP",
                  },
                  },
                  notification_url: interaction.user.displayAvatarURL(),
                };
                
                mercadopago.payment.create(payment_data).then(function (data) {
                  
                  const buffer = Buffer.from(data.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
                  const attachment = new AttachmentBuilder(buffer, "payment.png");
                  
                interaction.channel.send({
                  embeds:[
                    new EmbedBuilder()
                    .setTitle(`Resumo de Compra | Pagamento`)
                    .setDescription(`Produto: ${prod.nome} \n Valor: ${Number(prod.valor).toFixed(2)} \n Quantidade: ${dbss.quantidade} \n Total a Pagar: ${Number(Number(dbss.quantidade) * Number(prod.valor)).toFixed(2)}`)
                  ],
                  components:[
                    new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                      .setCustomId(`pixcpc`)
                      .setLabel("Pix Copia e Cola")
                      .setStyle(1),
                      new ButtonBuilder()
                      .setCustomId(`qrcode`)
                      .setLabel("Qr Code")
                      .setStyle(1),
                      new ButtonBuilder()
                      .setCustomId(`${interaction.user.id}_cancelarcompra`)
                      .setEmoji("❌")
                      .setStyle(4),
                    )
                  ]
                }).then(msg => {
                  
                  const filter = i => i.member.id === interaction.user.id;
                  const collector = msg.createMessageComponentCollector({ filter });
                  collector.on('collect', interaction2 => {
                    
                    if (interaction2.customId == 'pixcpc') {
                      interaction2.reply({ content: `${data.body.point_of_interaction.transaction_data.qr_code}`, ephemeral: true })
                    }
                    
                    if (interaction2.customId == 'qrcode') {
                      interaction2.reply({ files: [attachment], ephemeral: true })
                    }
                  
                  })
                })
                 
                 const checkPaymentStatus = setInterval(async () => {
                   axios.get(
                     `https://api.mercadolibre.com/collections/notifications/${data.body.id}`,
                   {
                     headers: {
                       Authorization: `Bearer ${db2.get(`access_token`)}`,
                     },
                   }).then(async (doc) => {
                      if (doc.data.collection.status == "approved") {
                        clearInterval(checkPaymentStatus);
                        compraAprovada()
                      }
                   })
                }, 2000)
                
                const schemaPosse = setInterval(async () => {
                  const info = db1.get(`${interaction.channel.id}_carrinho`)
                  if (info.status == 2) {
                    clearInterval(checkPaymentStatus);
                    clearInterval(schemaPosse);
                    compraAprovada()
                  }
                }, 2000)
              })
              .catch(err => {
                   interaction.channel.send({
                     content: `⚠️ | Erro ao gerar o pagamento!\n❌ | Erro: \`${err.message}\``,
                     components: [new ActionRowBuilder()
                        .addComponents(
                           new ButtonBuilder()
                             .setCustomId('fecharcarrinho')
                             .setLabel('Deletar Carrinho')
                             .setStyle(2)
                        )
                      ]
                   })
                })
            })
            }
            if (customId == "fecharcarrinho") {
              interaction.channel.delete()
            }
            
         async function compraAprovada() {
           const dbss = await db1.get(`${interaction.channel.id}_carrinho`);
           let ides = await db.get(`${dbss.produto}`);
          if(!ides) {
            if(interaction.isStringSelectMenu()) {
              ides = await db.get(`${interaction.values[0]}`);
            tis = "select"
            }
          }


            const prod = ides;
              const removed = prod.estoque.splice(0, Number(dbss.quantidade));
              db.set(`${dbss.produto}.estoque`, prod.estoque);
              const user = interaction.client.users.cache.get(dbss.user);
              await interaction.channel.bulkDelete(50).then(() => {
                interaction.channel.send({
                  content:`Olá ${user} seu pagamento foi aprovado com sucesso! \n Olhe o seu Privado para pegar seu produto`
                })
              })
              if(dbss.quantidade > 5) {
                fs.writeFile(`./produtos-${interaction.channel.id}.txt`, `📦 | Entrega do produto: ${prod.nome} - ${dbss.quantidade}/${dbss.quantidade}\n${removed.join("\n\n")}`, (err) => {
                  if (err) throw err;
                  console.log('Arquivo criado com sucesso!');
                  })
                  const filed = `./produtos-${interaction.channel.id}.txt`;
                  
                  await user.send({ files: [filed] }).catch(error => {
                    interaction.channel.send(`Opa! parece que seu privado está bloqueado, mais não se preocupe, o produto será enviado neste canal!`)
                    interaction.channel.send({ files: [filed]}).then(() => {
                    
                      fs.unlink(`./produtos-${interaction.channel.id}.txt`, (err) => {
                        if (err) throw err;
                        console.log('Arquivo Apagado com sucesso!');
                        });
                      })
                    interaction.channel.send(`Lembre-se de salvar o produto, o carrinho irá fechar em 1 minuto!`)
                  })
              } else {
               await user.send({
                  content:`📦 | Entrega do produto: ${prod.nome} - ${dbss.quantidade}/${dbss.quantidade}\n${removed.join("\n\n")}`
                }).catch(error => {
                  interaction.channel.send(`Opa! parece que seu privado está bloqueado, mais não se preocupe, o produto será enviado neste canal!`)
                  interaction.channel.send({ content:`📦 | Entrega do produto: ${prod.nome} - ${dbss.quantidade}/${dbss.quantidade}\n${removed.join("\n\n")}`})
                  interaction.channel.send(`Lembre-se de salvar o produto, o carrinho irá fechar em 1 minuto!`)
                });
              }
              const member = interaction.member;
              member.roles.add(await db2.get(`cargo`))
              setTimeout(() => {
                interaction.channel.delete()
                db1.delete(`${interaction.channel.id}_carrinho`)
              }, 60000);
        
              
            }
            if(customId.endsWith("_cancelarcompra")) {
              const userid = customId.split("_")[0];
              if(interaction.user.id !== userid) return interaction.deferUpdate();
              db1.delete(`${interaction.channel.id}_carrinho`)
              await interaction.channel.delete();
              const chans = interaction.guild.channels.cache.get(`${db2.get(`canal_logs`)}`)
                if(chans) {
                  chans.send({
                    embeds:[
                      new EmbedBuilder()
                      .setTitle(`${interaction.guild.name} | CARRINHO CANCELADO!`)
                      .setDescription(`Usuaro: ${interaction.user} Cancelou a compra..`)
                    ],
                    components:[
                    new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                      .setCustomId("siduofosdyfnsdiya876123")
                      .setLabel("Mensagem Automatica")
                      .setStyle(2)
                      .setDisabled(true)
                    )
                  ]
                  })
                }
        
        
            }
            if(customId.endsWith("_removerprod")) {
              const userid = customId.split("_")[0];
              if(interaction.user.id !== userid) return interaction.deferUpdate();
              const dbss = await db1.get(`${interaction.channel.id}_carrinho`);
              const dbss1 = await db.get(`${dbss.produto}`);
              let quantia = Number(dbss.quantidade) - 1;
              let stock = await db.get(`${dbss.produto}`);
              if(quantia < 1) {
                return interaction.deferUpdate()
              }
              await db1.set(`${interaction.channel.id}_carrinho.quantidade`, quantia);
              
              interaction.update({
                embeds:[
                  new EmbedBuilder()
                  .setTitle(`Produto: ${dbss1.nome}`)
                  .setDescription(`Valor: ${Number(dbss1.valor).toFixed(2)} \n Quantidade: ${quantia} \n Estoque: ${dbss1.estoque.length} \n\n Total a Pagar: ${Number(dbss1.valor) * quantia}`)
                ],
                components:[
                  new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_removerprod`)
                    .setEmoji("➖")
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_editprod`)
                    .setEmoji("✏")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_adicionarprod`)
                    .setEmoji("➕")
                    .setStyle(3),
                  )
                ]
              })
            }
            if(customId.endsWith("_editprod")) {
              const userid = customId.split("_")[0];
              if(interaction.user.id !== userid) return interaction.deferUpdate();
              
              const modal = new ModalBuilder()
              .setTitle(`${interaction.guild.name} | Alterar Estoque`)
              .setCustomId("produtoedit_modal");
        
              const text = new TextInputBuilder()
              .setCustomId("text")
              .setLabel("Coloque a quantidade que você queira!")
              .setStyle(1)
              .setMaxLength(4)
              .setRequired(true);
        
              modal.addComponents(new ActionRowBuilder().addComponents(text));
              return interaction.showModal(modal);
            }
            if(interaction.customId === "qrcode") {
              interaction.reply({
                content:`${interaction.user}`,
                ephemeral:true,
                embeds:[
                  new EmbedBuilder()
                  .setImage(`${await db2.get(`pix.qrcode`)}`)
                ]
              })
            }
            if(interaction.customId === "pixpay") {
              interaction.reply({
                content:`${interaction.user}`,
                ephemeral:true,
                embeds:[
                  new EmbedBuilder()
                  .setDescription(`${await db2.get(`pix.chave_pix`)}`)
                ]
              })
            }
        
            if(interaction.customId === "produtoedit_modal") {
              const text = interaction.fields.getTextInputValue("text");
              const dbss = await db1.get(`${interaction.channel.id}_carrinho`);
              const dbss1 = await db.get(`${dbss.produto}`);
              let stock = await db.get(`${dbss.produto}`);
              if(text < 1) {
                return interaction.deferUpdate()
              } 
              if(text > stock.estoque.length) {
                return interaction.deferUpdate()
              }
              await db1.set(`${interaction.channel.id}_carrinho.quantidade`, Number(text));
              
              interaction.update({
                embeds:[
                  new EmbedBuilder()
                  .setTitle(`Produto: ${dbss1.nome}`)
                  .setDescription(`Valor: ${Number(dbss1.valor).toFixed(2)} \n Quantidade: ${text} \n Estoque: ${dbss1.estoque.length} \n\n Total a Pagar: ${Number(dbss1.valor) * text}`)
                ],
                components:[
                  new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_removerprod`)
                    .setEmoji("➖")
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_editprod`)
                    .setEmoji("✏")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_adicionarprod`)
                    .setEmoji("➕")
                    .setStyle(3),
                  )
                ]
              })
              
        
        
            }
            if(customId.endsWith("_adicionarprod")) {
        
              const userid = customId.split("_")[0];
              if(interaction.user.id !== userid) return interaction.deferUpdate();
              const dbss = await db1.get(`${interaction.channel.id}_carrinho`);
              const dbss1 = await db.get(`${dbss.produto}`);
              let quantia = Number(dbss.quantidade) + 1;
              if(quantia > dbss1.estoque.length) {
                return interaction.deferUpdate()
              }
              await db1.set(`${interaction.channel.id}_carrinho.quantidade`, quantia);
              
              interaction.update({
                embeds:[
                  new EmbedBuilder()
                  .setTitle(`Produto: ${dbss1.nome}`)
                  .setDescription(`Valor: ${Number(dbss1.valor).toFixed(2)} \n Quantidade: ${quantia} \n Estoque: ${dbss1.estoque.length} \n\n Total a Pagar: ${Number(dbss1.valor) * quantia}`)
                ],
                components:[
                  new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_removerprod`)
                    .setEmoji("➖")
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_editprod`)
                    .setEmoji("✏")
                    .setStyle(2),
                    new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}_adicionarprod`)
                    .setEmoji("➕")
                    .setStyle(3),
                  )
                ]
              })
              
        
            }
          }
          if(interaction.customId === "termos") {
            interaction.reply({
              embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Termos`)
                .setDescription(`${await db2.get(`termos`)}`)
              ],
              ephemeral:true,
            })
          }
          if(interaction.customId === "testardm") {
            interaction.reply({
              content:"Verificando sua **DM** Aguarde...",
              ephemeral:true
            })
            await interaction.user.send({
              embeds:[
                new EmbedBuilder()
                .setDescription(`Olá ${interaction.user}, parece que sua DM está aberta!\n Continue com sua compra, mas antes Verifique os nossos termos!`)
              ],
              components:[
                new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                  .setCustomId("sadna7siydb23812")
                  .setLabel("Mensagem Automatica")
                  .setStyle(2)
                  .setDisabled(true)
                )
              ]
            }).then(() => {
              interaction.editReply({
                content:"Sua **DM** está aberta!",
                ephemeral:true
              })
            }).catch(() => {
              interaction.reply({
                content:`Sua **DM** está fechada, abra ela ou me desbloqueie para podê continuar com a compra!`,
                ephemeral:true
              })
            })
          }
    }
}