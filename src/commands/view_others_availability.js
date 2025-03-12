const { SlashCommandBuilder } = require('@discordjs/builders');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('availability.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('view_others_availability')
        .setDescription('View another user\'s availability')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose availability you want to view')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('user');
            const userId = targetUser.id;

            // Retrieve the target user's availability from the database
            db.all(
                'SELECT start_timestamp, end_timestamp FROM availability WHERE user_id = ?',
                [userId],
                (err, rows) => {
                    if (err) {
                        console.error('Error retrieving availability:', err);
                        interaction.reply({ content: 'There was an error retrieving availability.', ephemeral: true });
                    } else if (rows.length === 0) {
                        interaction.reply({ content: 'This user has no availability recorded.', ephemeral: true });
                    } else {
                        const availabilityList = rows.map(row => {
                            return `<t:${row.start_timestamp}:F> to <t:${row.end_timestamp}:F>`;
                        }).join('\n');

                        interaction.reply({ content: `Availability for ${targetUser.username}:\n${availabilityList}`, ephemeral: true });
                    }
                }
            );

        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
        }
    }
};