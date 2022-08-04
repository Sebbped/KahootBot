require("dotenv").config();
const { SlashCommandBuilder, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

if (!process.env.TOKEN) throw new Error("No token supplied in .env");
if (!process.env.CLIENT_ID) throw new Error("No Client ID supplied in .env");
if (!process.env.GUILD_ID) throw new Error("No Guild ID supplied in .env");

const commands = [
  new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start a Kahoot bot raid")
    .addStringOption((option) =>
      option
        .setName("pin")
        .setDescription("The kahoot round pin")
        .setMaxLength(7)
        .setMinLength(6)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("bots")
        .setDescription("The amount of kahoot bots")
        .setMaxLength(3)
        .setMinLength(1)
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
rest
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  )
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
