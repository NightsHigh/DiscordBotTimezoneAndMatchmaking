const { SlashCommandBuilder } = require('@discordjs/builders');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment-timezone');

const db = new sqlite3.Database('availability.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('view_current_availabile_users')
        .setDescription('View all users who are available at the current time'),

    async execute(interaction) {
        try {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp (seconds)

            // Query the database for users whose availability includes the current time
            db.all(
                'SELECT user_id, end_timestamp, time_zone FROM availability WHERE start_timestamp <= ? AND end_timestamp >= ?',
                [currentTime, currentTime],
                async (err, rows) => {
                    if (err) {
                        console.error('Error retrieving current availability:', err);
                        await interaction.reply({ content: 'There was an error retrieving current availability.', ephemeral: true });
                        return;
                    }

                    if (rows.length === 0) {
                        await interaction.reply({ content: 'No users are currently available.', ephemeral: true });
                        return;
                    }

                    // Fetch user details from Discord and format the availability list
                    const availableUsers = [];
                    for (const row of rows) {
                        try {
                            const user = await interaction.guild.members.fetch(row.user_id);
                            const endTimeFormatted = moment.unix(row.end_timestamp).tz(row.time_zone).format('LLLL');
                            availableUsers.push(`${user.user.username} (available until ${endTimeFormatted})`);
                        } catch (fetchError) {
                            console.error(`Error fetching user ${row.user_id}:`, fetchError);
                        }
                    }

                    if (availableUsers.length === 0) {
                        await interaction.reply({ content: 'No users are currently available.', ephemeral: true });
                        return;
                    }

                    // Format the list of available users
                    const availableUsersList = availableUsers.join('\n');
                    await interaction.reply({ content: `Users currently available:\n${availableUsersList}`, ephemeral: true });
                }
            );

        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
        }
    }
};