const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    // Setup how the command looks in the chat
    data: new SlashCommandBuilder()
        .setName('timezone')
        .setDescription('Sends a message where users can react to select their timezone.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only admins can use this command

    async execute(interaction) {
        try {
            // Defer the reply to acknowledge the interaction
            await interaction.deferReply({ ephemeral: true }); //  ephemeral: true } = Only the user who used the command can see the confirmation message

            // Send the message where users can react
            const timezoneMessage = await interaction.channel.send(
                'React to choose your timezone:\n' +
                '🇺🇸 - EST (UTC-5)\n' +
                '🇨🇦 - CST (UTC-6)\n' +
                '🇲🇽 - MST (UTC-7)\n' +
                '🇺🇲 - PST (UTC-8)\n' +
                '🇬🇧 - GMT (UTC+0)\n' +
                '🌍 - UTC (UTC+0)\n' +
                '🇪🇺 - CET (UTC+1)\n' +
                '🇫🇷 - CEST (UTC+2)\n' +
                '🇿🇦 - SAST (UTC+2)\n' +
                '🇷🇺 - MSK (UTC+3)\n' +
                '🇮🇳 - IST (UTC+5:30)\n' +
                '🇨🇳 - CST (UTC+8)\n' +
                '🇯🇵 - JST (UTC+9)\n' +
                '🇦🇺 - AEDT (UTC+11)'
            );

            console.log('Timezone message sent with ID:', timezoneMessage.id);

            // Add reaction options
            const emojiRoleMap = {
                '🇺🇸': 'EST (UTC-5)',
                '🇨🇦': 'CST (UTC-6)',
                '🇲🇽': 'MST (UTC-7)',
                '🇺🇲': 'PST (UTC-8)',
                '🇬🇧': 'GMT (UTC+0)',
                '🌍': 'UTC (UTC+0)',
                '🇪🇺': 'CET (UTC+1)',
                '🇫🇷': 'CEST (UTC+2)',
                '🇿🇦': 'SAST (UTC+2)',
                '🇷🇺': 'MSK (UTC+3)',
                '🇮🇳': 'IST (UTC+5:30)',
                '🇨🇳': 'CST (UTC+8)',
                '🇯🇵': 'JST (UTC+9)',
                '🇦🇺': 'AEDT (UTC+11)'
            };

            // React to the message with the emojis from the emoji-role map
            for (const emoji of Object.keys(emojiRoleMap)) {
                await timezoneMessage.react(emoji);
                console.log(`Reacted with ${emoji}`);
            }

            // Create reaction collector to listen for reactions
            const filter = (reaction, user) => !user.bot && emojiRoleMap[reaction.emoji.name];
            const collector = timezoneMessage.createReactionCollector({ filter });

            console.log('Reaction collector created for message:', timezoneMessage.id);

            collector.on('collect', async (reaction, user) => {
                console.log(`Reaction collected: ${reaction.emoji.name} from ${user.tag}`);

                const guild = reaction.message.guild;
                const member = await guild.members.fetch(user.id);
                console.log(`Fetched member: ${member.user.tag}`);

                // Remove any existing timezone role
                const existingRole = member.roles.cache.find(role => Object.values(emojiRoleMap).includes(role.name));
                if (existingRole) {
                    console.log(`Removing existing role: ${existingRole.name}`);
                    await member.roles.remove(existingRole);
                }

                // Assign the new timezone role
                const roleName = emojiRoleMap[reaction.emoji.name];
                console.log(`Looking for role: ${roleName}`);

                const role = guild.roles.cache.find(r => r.name === roleName);
                if (role) {
                    console.log(`Assigning role: ${role.name} to ${member.user.tag}`);
                    await member.roles.add(role);
                    console.log(`Role assigned successfully.`);
                } else {
                    console.error(`Role "${roleName}" not found.`);
                }
            });

            collector.on('end', () => {
                console.log('Reaction collector ended.');
            });

            collector.on('error', (error) => {
                console.error('Error in reaction collector:', error);
            });

            // Edit the deferred reply to confirm
            await interaction.editReply({ content: 'Timezone selection message sent!', flags: 64 });

        } catch (error) {
            console.error('Error executing command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'There was an error executing this command!', flags: 64 });
            } else {
                await interaction.editReply({ content: 'There was an error executing this command!', flags: 64 });
            }
        }
    }
};