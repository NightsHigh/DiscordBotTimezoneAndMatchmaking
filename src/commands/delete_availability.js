const { SlashCommandBuilder } = require('@discordjs/builders');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('availability.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_availability')
        .setDescription('Delete your availability'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;

            // Delete the user's availability from the database
            db.run(
                'DELETE FROM availability WHERE user_id = ?',
                [userId],
                (err) => {
                    if (err) {
                        console.error('Error deleting availability:', err);
                        interaction.reply({ content: 'There was an error deleting your availability.', ephemeral: true });
                    } else {
                        interaction.reply({ content: 'Your availability has been deleted.', ephemeral: true });
                    }
                }
            );

        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
        }
    }
};