require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Kahoot = require("@venixthedev/kahootjs");

const KahootClient = new Kahoot();
const Chance = require('chance');

const chance = new Chance();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.on('ready', () => {
    console.log(`${client.user.username}#${client.user.discriminator} is now online!`)
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'start') {
        const pin = interaction.options.getString("pin")
        const botAmount = interaction.options.getString("bots")

        const baseEmbed = new EmbedBuilder()
          .setFooter({ text: 'Kahoot Bot' })
          .setColor('Purple')
        let msg = await interaction.reply({ embeds: [baseEmbed.setDescription(`Trying to send ${botAmount} bots to **${pin}**`)] });

        [...Array(parseInt(botAmount)).keys()].map(() => {
            const bots = new Kahoot();
            const name = chance.name();

            bots.join(pin, name).catch(err =>  { return; })

            bots.on("Joined", () => {
                console.log(`${pin}: ${name} Joined successfully`)
            })

            bots.on("Disconnect", reason => {
                console.log(`${pin}: ${name} Disconnected from the game for reason ${reason}`)
            })
            return bots;
        });

        KahootClient.join(pin, chance.name()).catch(err => {
            interaction.editReply({ embeds: [baseEmbed.setDescription(`**[${pin}]** The pin seems to be invalid or the game was ended.`)] })
        })

        KahootClient.on("QuizEnd", () => {
            interaction.editReply({ embeds: [baseEmbed.setDescription(`**[${pin}]** The quiz has ended.`)] })
        });
    }
});

client.login(process.env.TOKEN);
