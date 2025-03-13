const { SlashCommandBuilder } = require('@discordjs/builders');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('availability.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('availability')
        .setDescription('Post your availability in the format <t:START_TIMESTAMP:F> to <t:END_TIMESTAMP:F>')
        .addStringOption(option =>
            option.setName('time_range')
                .setDescription('Your availability in the format <t:START_TIMESTAMP:F> to <t:END_TIMESTAMP:F>')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time_zone')
                .setDescription('Your time zone (e.g., America/New_York, Europe/London)')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const timeRange = interaction.options.getString('time_range');
            const timeZone = interaction.options.getString('time_zone');
            const regex = /^<t:(\d+):F> to <t:(\d+):F>$/;
            const match = timeRange.match(regex);

            if (!match) {
                await interaction.reply({ content: 'Invalid format. Please use `<t:START_TIMESTAMP:F> to <t:END_TIMESTAMP:F>`.', ephemeral: true });
                return;
            }

            const startTimestamp = parseInt(match[1], 10);
            const endTimestamp = parseInt(match[2], 10);

            if (endTimestamp <= startTimestamp) {
                await interaction.reply({ content: 'End timestamp must be after start timestamp.', ephemeral: true });
                return;
            }

            const userId = interaction.user.id;
            db.run(
                'INSERT INTO availability (user_id, start_timestamp, end_timestamp, time_zone) VALUES (?, ?, ?, ?)',
                [userId, startTimestamp, endTimestamp, timeZone],
                (err) => {
                    if (err) {
                        console.error('Error storing availability:', err);
                        interaction.reply({ content: 'There was an error storing your availability.', ephemeral: true });
                    } else {
                        interaction.reply({ content: `Your availability has been recorded: ${timeRange} (Time Zone: ${timeZone})`, ephemeral: true });
                    }
                }
            );

        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
        }
    }
};