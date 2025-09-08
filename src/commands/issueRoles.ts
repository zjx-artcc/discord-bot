import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { User } from 'vatusa-api-types';

export const data = new SlashCommandBuilder()
	.setName('issueroles')
	.setDescription('Used by staff to issue roles to a user')
	.addUserOption((option) =>
		option
			.setName('userid')
			.setDescription('The ID of the user to issue roles to')
			.setRequired(true)
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers); //Allow mentors and higher to use this command

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply();

	const uid = interaction.options.getUser('userid')?.id;

	let cid: string;

	try {
		let req = await fetch(`https://api.vatsim.net/v2/members/discord/${uid}`);
		let res: { id: string; user_id: string } = await req.json();
		cid = res.user_id;
	} catch (error) {
		await interaction.editReply(
			'You are not linked to a VATSIM account! Please link your account at https://community.vatsim.net/ then try again!'
		);
		return;
	}

	let member = await interaction.guild?.members.fetch(uid);

	let req = await fetch(`https://api.vatusa.net/v2/user/${cid}`);
	if (req.status == 404) {
		// One of many ways to detect a pilot
		await member.roles.add(
			interaction.guild?.roles.cache.find((role) => role.name === 'Community Member')
		);
		await interaction.editReply('Your roles have been updated!');
		return;
	}

	let res = (await req.json()) as User;
	console.log(res);

	await member.roles.add(
		interaction.guild?.roles.cache.find((role) => role.name === 'VATSIM Controller')
	);

	switch (res.data.rating) {
		case 1: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'OBS'));
			break;
		}
		case 2: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'S1'));
			break;
		}
		case 3: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'S2'));
			break;
		}
		case 4: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'S3'));
			break;
		}
		case 5: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'C1'));
			break;
		}
		//6 = C2, not used for VATSIM
		case 7: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'C3'));
			break;
		}
		case 8: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'I1'));
			break;
		}
		//9 = I2, not used for VATSIM
		case 10: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'I3'));
			break;
		}
		case 11: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'SUP'));
			break;
		}
		case 12: {
			await member.roles.add(interaction.guild?.roles.cache.find((role) => role.name === 'ADM'));
			break;
		}
	}

	await member.setNickname(`${res.data.fname} ${res.data.lname} | ${res.data.facility}`);
	if (res.data.facility == 'ZJX') {
		await member.roles.add(
			interaction.guild?.roles.cache.find((role) => role.name === 'ZJX Controller')
		);
	} else {
		for (let visitingFacility of res.data.visiting_facilities) {
			if (visitingFacility.facility == 'ZJX') {
				await member.roles.add(
					interaction.guild?.roles.cache.find((role) => role.name === 'Visiting Controller')
				);
				break;
			}
		}
	}

	await interaction.editReply('Your roles have been updated!');
}
