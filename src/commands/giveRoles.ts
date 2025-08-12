import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { User } from 'vatusa-api-types';
import { config } from "../config";

export const data = new SlashCommandBuilder()
  .setName("giveroles")
  .setDescription("Gives roles to a user")

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

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

  let member = await interaction.guild?.members.fetch(uid);

  let req = await fetch(`https://api.vatusa.net/v2/user/${cid}`);
  if (req.status == 404) {
    // One of many ways to detect a pilot
    await member.roles.add(config.pilot);
    await interaction.editReply("Your roles have been updated!");
    return;
  }

  let res = await req.json() as User;
  console.log(res);

  await member.roles.add(config.controller);

  switch (res.data.rating) { 
    case 1: {
      await member.roles.add(config.OBS);
      break;
    }
    case 2: {
      await member.roles.add(config.S1);
      break;
    }
    case 3: {
      await member.roles.add(config.S2);
      break;
    }
    case 4: {
      await member.roles.add(config.S3);
      break;
    }
    case 5: {
      await member.roles.add(config.C1);
      break;
    }
    //6 = C2, not used for VATSIM
    case 7: {
      await member.roles.add(config.C3);
      break;
    }
    case 8: {
      await member.roles.add(config.I1);
      break;
    }
    //9 = I2, not used for VATSIM
    case 10: {
      await member.roles.add(config.I3);
      break;
    }
    case 11: {
      await member.roles.add(config.SUP);
      break;
    }
    case 12: {
      await member.roles.add(config.ADM);
      break;
    }
  }

  await member.setNickname(`${res.data.fname} ${res.data.lname} | ${res.data.facility}`)
  if (res.data.facility == "ZJX") {
    await member.roles.add(config.home);
  } else {
    for (let visitingFacility of res.data.visiting_facilities) {
      if (visitingFacility.facility == "ZJX") {
        await member.roles.add(config.visitor);
        break;
      }
    }
  }

  await interaction.editReply("Your roles have been updated!");
}
