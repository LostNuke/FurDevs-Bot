const {
  usernameResolver
} = require("./../../utils/resolvers/username");
const MembersConfig = require('./../../database/models/MembersConfig')
const { MessageEmbed } = require('discord.js')


exports.run = async (client, message, args) => {
  await message.delete();
  const guildSettings = await message.guild.settings()
  if (
    message.member.hasPermission("MANAGE_GUILD") ||
    guildSettings.staffMembers.includes(message.author.id)
  ) {


    if (!args[0]) {
      throw new Error("Please specify a user by providing the name, mention, or userID of that user ")
    } else if (!args[1]) {
      args[1] = 1
    } else if (args[1]) {
      if (isNaN(args[1])) {
        throw new Error("That's not a number!")
      }
    }
    var user = await usernameResolver(message, args[0]);
    var repsRemove = parseInt(args[1]);
    var settings = await message.guild.members.cache.get(user.id).settings();
    var newReps = settings.reps - repsRemove
    console.log(newReps)
    await MembersConfig.updateOne({
      _id: settings._id
    }, {
      reps: newReps
    });
  } else {
    throw new Error("Hey! You're not a Staff Member nor you have permission `MANAGE_GUILD`!")
  }
  const embed = new MessageEmbed()
  .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
  .setTitle(`Removed a ${repsRemove} Reps from ${user.username}!`)
  .addField(`Reps Then`, `${settings.reps}`)
  .addField(`Reps Now`, `${newReps}`)
  .setThumbnail(`https://cdn.discordapp.com/emojis/732716713820553227.png?v=1`)
  .setColor(`#8800FF`)
  message.channel.send(embed)
};

exports.help = {
  name: "removerep",
  description: "Remove reps in bulk",
  usage: "< Username | ID | Metion > [ number( default = 1) ]",
  aliases: [""],
};