//ad bot to server: https://discord.com/oauth2/authorize?client_id=758234874661306368&scope=bot
require('dotenv').config();
const Discord = require('discord.js');
const DisTube = require('distube');
// const SpotifyPlugin = require("@distube/spotify");
const client = new Discord.Client();
var color = 0xc1f68a
config = {
    prefix: "t", 
    token: process.env.Discordbottoken,
};
// const distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true, plugins: [new SpotifyPlugin({ parallel: true })] });
const distube = new DisTube(client, {
    searchSongs: 10,
    searchSongs: false,
    emitNewSongOnly: true
})
client.on('ready', () => {
    console.log(`🟢 Bot is online!`);
});

client.on('message', (message) => {
    let msg = message.content;
    console.log(msg)
        // if (message.author.bot) return
    if (message.content.startsWith(config.prefix)) {
        let [commando, ...args] = message.content
            .toLowerCase()
            .trim()
            .substring(config.prefix.length)
            .split(/\s+/);
        if (commando === "kick") {
            if (args.length === 0) return message.reply(`${config.prefix}kick [User] [Reason]`)
            const usr = message.guild.members.cache.get(args[0])
            if (usr) {
                usr.kick()
                    .then((usr) => message.channel.send(`${usr} fue expulsado.`))
                    .catch((err) => message.channel.send(`${message.author.tag} necesito permisos`))
            } else {
                message.reply('Usuario no encontrado')
            }
        } else if (commando === "spam") {
            if (args.length === 0) return message.reply(`${config.prefix}Spam [link a spamear] [numero de vueltas]`);
            let n = args[args.length - 1]
            for (let i = 0; i < n; i++) {
                args = args.filter(item => item !== n)
                message.channel.send(`${args.join(' ')} Spam no: ${i+1}`)
            }
        } else if (commando == "queue" || commando == "q") {

            let queue = distube.getQueue(message);
            if (queue) {
                message.channel.send( new Discord.MessageEmbed()
    .setColor(color)
    .setTitle('Song queue')
    .setDescription(`\`\`\`css
Current queue: \n\n` + queue.songs.map((song, id) => `${id + 1}. ${song.name} - [${song.formattedDuration}]`).slice(0, 10).join("\n") + `\`\`\``))
            } else {
                message.channel.send( new Discord.MessageEmbed()
    .setColor(color)
    .setTitle('Queue empty')
    .setDescription(`
[queue is empty...] \`add a song with ${config.prefix}play`))
            }
        } else
        if (commando === "help" || commando == "h") {
            message.reply(`\`Bot commands:\n ${config.prefix}kick [User] [Reason]\n ${config.prefix}Spam [link a spamear] [numero de bueltas] \n ${config.prefix}play or p [music lick or search] - Play or search a song \n ${config.prefix}loop or lp - Loop mode [on / off]\n ${config.prefix}stop or s - Stop the queue \n ${config.prefix}skip or n - Skip the current song \n ${config.prefix}3d, bassboost, echo, karaoke, nightcore, vaporwave - set an efect to the song \n ${config.prefix}queue or q - Show queue song\n\``)
        } else
        if (commando == "play" || commando == "p") {
            if (args.length === 0) return message.channel.send(`${message.author.tag} try with:  \`\`\`bash
"${config.prefix}play [music lick or search] - Play or search a song" \`\`\``);
            distube.play(message, args.join(""));
        } else

        if (["repeat", "loop", "lp"].includes(commando)) {
            distube.setRepeatMode(message, parseInt(args[0]));

        } else
        if (commando == "stop" || commando == "s") {
            distube.stop(message);
            message.channel.send("\`Stopped the music!\`");

        } else
        if (commando == "skip" || commando == "n") {

            distube.skip(message);

        } else
        if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(commando)) {
            let filter = distube.setFilter(message, commando);
            message.channel.send("\`Current queue filter: \`" + (filter || "Off"));

        }else if(commando == "prefix"){
            if (args.length === 0) return message.reply(`\`${config.prefix}pref [music lick or search] - Set the current argument as new prefix\``);
            let n = args[args.length - 1]
            if(args > 1){
                message.reply(`\`${config.prefix}pref [music lick or search] - Set the current argument as new prefix\``);
            }else if(n.length >1){
                message.channel.send(`cold not be more then 1 char`)
            }else{
                message.channel.send(`The new prefix of the bot is \`${n}command argument\``)
                config.prefix = n;
            }
            
        }else if(commando == "test"){
            message.channel.send(`\`\`\`diff
            -Type anything after the dash and it should turn red\`\`\``)
            message.channel.send(`\`\`\`css
            [Type anything within brackets and it should turn orange] \`\`\``)
            message.channel.send(`\`\`\`fix
            You won’t need to use any special characters to turn this text yellow.\`\`\``)
            message.channel.send(`\`\`\`bash
            "You will need to type your dark green text within quotation marks"\`\`\``)
            message.channel.send(`\`\`\`json
            "You will need to type your dark green text within quotation marks"\`\`\``)
            message.channel.send(`\`\`\`css
            [You will need to type your light green text within quotation marks]\`\`\``)
            message.channel.send(`\`\`\`css
            "You will need to type your light green text within quotation marks"\`\`\``)
            message.channel.send(`\`\`\`ini
            [Type anything within brackets and it should turn blue]\`\`\``)
            message.channel.send(`\>\>\> [Type anything within brackets and it should turn blue]`)
            
        }else if(commando =="embed"){
            let a = args[0]
            let color;
            message.channel.send(args[0]);
            if(a === 'red'){
                color = 0xff0000
            }else{
                color = 0xc1f68a
            }
            let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`\`\`\`css
Playing [${song.name}] - [${song.formattedDuration}]\n\n\tRequested by: [${song.user.tag}]\n\t${status(queue)}\`\`\``)
            message.channel.send(embed);
        }else if(commando == "volume"){
        const volume = parseInt(args[0])
        if (isNaN(volume)) return message.channel.send(`${client.emotes.error} | Please enter a valid number!`)
        client.distube.setVolume(message, volume)
        }
    }

});

const status = (queue) => `Volume: ${queue.volume}% | Filter: ${queue.filter || "Off"} | Loop: ${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"} | Autoplay: ${queue.autoplay ? "On" : "Off"}`;

distube.on("playSong", async (message, queue, song) =>
            message.channel.send(new Discord.MessageEmbed()
            .setColor(color)
            .setTitle('Playing:')
            .setDescription(`\`\`\`css
[${song.name}] - [${song.formattedDuration}]\nRequested by: [${song.user.tag}]\n${status(queue)}\`\`\``))
       )
    distube.on("addSong", async (message, queue, song) =>
     message.channel.send(new Discord.MessageEmbed()
        .setTitle('Song added')
        .setColor(color)
        .setDescription(
`Added ${song.name} -  \`${song.formattedDuration}\` to the queue`)))
    .on("playList", async (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\n Requested by: ${song.user}\nNow playing \`${song.name}\` => \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", async (message, queue, playlist) => 
            message.channel.send(new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(
`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)} values: |${message}|${queue}|${song}|`
            )))
    .on("searchResult", async(message, result) => {
            //let i = 0;
           //message.channel.send(`🎵 **Choose an option from below** 🎵\n${result.map(song => ` \n ${++i} ) ${song.name} - ${song.formattedDuration}`).join("")} \n **Enter anything else or wait 60 seconds to cancel** `);
           // message.channel.send(`🎵 Aloha`);
    })
    .on("searchCancel",async (message) => message.channel.send(`Searching canceled`))
    .on("error",async (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
    });


client.login(process.env.Discordbottoken);