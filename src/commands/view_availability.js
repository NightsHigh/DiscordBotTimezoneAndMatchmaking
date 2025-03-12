const { SlashCommandBuilder } = require('@discordjs/builders');
const sqlite3 = require('sqlite3').verbose();

// Open the database file
const db = new sqlite3.Database('availability.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('view_availability')
        .setDescription('View your availability'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;

            db.all(
                'SELECT start_timestamp, end_timestamp FROM availability WHERE user_id = ?',
                [userId],
                (err, rows) => {
                    if (err) {
                        console.error('Error retrieving availability:', err);
                        interaction.reply({ content: 'There was an error retrieving your availability.', ephemeral: true });
                    } else if (rows.length === 0) {
                        interaction.reply({ content: 'You have no availability recorded.', ephemeral: true });
                    } else {
                        const availabilityList = rows.map(row => {
                            return `<t:${row.start_timestamp}:F> to <t:${row.end_timestamp}:F>`;
                        }).join('\n');

                        interaction.reply({ content: `Your availability:\n${availabilityList}`, ephemeral: true });
                    }
                }
            );

        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
        }
    }
};