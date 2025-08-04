import { ChatInputCommandInteraction, Interaction, Role, SlashCommandBuilder } from "discord.js";
import * as config from "../config";

export const data = new SlashCommandBuilder()
  .setName("giveroles")
  .setDescription("Gives roles to a user")

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  let roles: Role[] = [];

  //TODO: Rebuild to be based on the website database
  
  const uid = interaction.user.id;

  let req = await fetch(`https://api.vatsim.net/v2/members/discord/${uid}`)
  let res = await req.json();
  console.log(res);

  await interaction.editReply("Your roles have been updated!");
}
