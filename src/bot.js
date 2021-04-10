//ad bot to server: https://discord.com/oauth2/authorize?client_id=758234874661306368&scope=bot
require('dotenv').config();
const Discord = require('discord.js');
const DisTube = require('distube');
const client = new Discord.Client();
config = {
    prefix: "$",
    token: process.env.Discordbottoken
};
const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });
client.on('ready', () => {
    console.log(`🟢 Bot is online!`);
});

client.on('message', (message) => {
    let msg = message.content;
    console.log(msg)
        // if (message.author.bot) return
    if (message.content.startsWith(config.prefix)) {
        let [commando, ...args] = message.content.trim().substring(config.prefix.length).split(/\s+/);
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
        }
        if (commando === "spam") {
            if (args.length === 0) return message.reply(`${config.prefix}Spam [link a spamear] [numero de bueltas]`);
            let n = args[args.length - 1]
            for (let i = 0; i < n; i++) {
                args = args.filter(item => item !== n)
                message.channel.send(`${args.join(' ')} Spam no: ${i+1}`)
            }
        }

        if (command == "jump")
            distube.jump(message, parseInt(args[0]))
            .catch(err => message.channel.send("Invalid song number."));

        if (commando == "queue" || commando == "q") {
            let queue = distube.getQueue(message);
            if (queue) {
                message.channel.send('\`Current queue:\n' + queue.songs.map((song, id) =>
                    `**${id + 1}**. ${song.name} - ${song.formattedDuration}\``
                ).slice(0, 10).join("\n"));
            } else {
                message.channel.send(`\`My dear ${message.author.tag} queue is empty...\``)
            }
        }
        if (commando === "help" || commando == "h") {
            message.reply(`\`Comandos: \n ${config.prefix}spam [link a spamear] [numero de bueltas] \n ${config.prefix}kick [User] [Reason]\``)
            message.channel.send(`\`My dear ${message.author.tag} queue is empty...\``)
        }
        if (commando == "play" || commando == "p") {
            if (args.length === 0) return message.reply(`\`${config.prefix}play [music lick or search] - Play or search a song\``);
            distube.play(message, args.join(" "));
        }

        if (["repeat", "loop", "lp"].includes(commando)) {
            distube.setRepeatMode(message, parseInt(args[0]));

        }
        if (commando == "stop" || commando == "s") {
            distube.stop(message);
            message.channel.send("\`Stopped the music!\`");

        }
        if (commando == "skip" || commando == "n") {

            distube.skip(message);

        }
        if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(commando)) {
            let filter = distube.setFilter(message, commando);
            message.channel.send("\`Current queue filter: \`" + (filter || "Off"));

        }
    }

});
const status = (queue) => `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\n\nRequested by: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} -  \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` => \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
            let i = 0;
            message.channel.send(`🎵 **Choose an option from below** 🎵\n\n${result.map(song => ` \n ${++i} ) ${song.name} - ${song.formattedDuration}`).join("\n")} \n **Enter anything else or wait 60 seconds to cancel** `);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
    });


client.login(process.env.Discordbottoken);