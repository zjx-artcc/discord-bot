import { ChatInputCommandInteraction, Interaction, Role, SlashCommandBuilder } from "discord.js";
import { config } from "../config";

export const data = new SlashCommandBuilder()
  .setName("giveroles")
  .setDescription("Gives roles to a user")

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  let roles: Role[] = [];

  //TODO: Rebuild to be based on the website database
  
  const uid = interaction.user.id;

   let cid: string;

  try {
    let req = await fetch(`https://api.vatsim.net/v2/members/discord/${uid}`)
    let res: { id: string, user_id: string } = await req.json();
    cid = res.user_id;
  } catch (error) {
    await interaction.editReply("You are not linked to a VATSIM account! Please link your account at https://community.vatsim.net/ then try again!")
    return;
  }

  let req = await fetch(`https://api.vatusa.net/v2/user/${cid}`);
  if (req.status == 404) {
    // One of many ways to detect a pilot
    let member = await interaction.guild?.members.fetch(uid);
    member.roles.add(config.pilot);
    await interaction.editReply("Your roles have been updated!");
    return;
  }


  await interaction.editReply("Your roles have been updated!");
}
