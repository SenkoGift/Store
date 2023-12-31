const {db, db1, db2, perms, pn} = require("../../DataBase/index");

module.exports = {
   name: "aprovar",
   description: "Aprove uma compra",
   run: async(client, interaction) => {
       const user = perms.get(`${interaction.user.id}_id`)
       if(!user) return interaction.reply({content:"Você não tem permissão para usar está função", ephemeral:true})
        
       const debe = db1.get(`${interaction.channel.id}_carrinho`)
       
       if (!debe) return interaction.reply({ content: `:x: | Você não está em um carrinho!`, ephemeral: true })
       
       if (debe.status == 2) return interaction.reply({ content: `:x: | Essa compra já foi aprovada!`, ephemeral: true })
       
       db1.set(`${interaction.channel.id}_carrinho`, {
         channel: interaction.channel.id,
         user: debe.user,
         produto: debe.produto,
         quantidade: debe.quantidade,
         status: 2
       })
       interaction.reply({ content: "Compra aprovada com sucesso!", ephemeral: true })
   }
}