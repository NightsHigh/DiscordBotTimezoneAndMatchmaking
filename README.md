# Timezone Role Selector Discord Bot

## Description
A Discord bot that allows users to select their timezone by reacting to a message. The bot assigns a corresponding role based on the reaction.

## Features
- Admin-only command to send a timezone selection message.
- Users can react to choose their timezone.
- Automatically assigns the correct role based on the selected timezone.
- Removes previous timezone roles when a new one is selected.

## Requirements
- Node.js (latest stable version recommended)
- Discord.js v14
- A Discord bot token

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/discordbot-timezone.git
   cd discordbot-timezone
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add your bot token:
   ```env
   DISCORD_TOKEN=your-bot-token
   ```
4. Start the bot:
   ```sh
   npm start
   ```

## Setup
1. Invite the bot to your server with the necessary permissions.
2. Ensure the bot has permission to **manage roles** and **read messages**.
3. Use the `/timezone` command to send the timezone selection message.
4. Create roles corresponding to the timezones in your server settings.

## Available Timezones
| Emoji  | Timezone | UTC Offset |
|--------|---------|------------|
| 🇺🇸 | EST | UTC-5 |
| 🇨🇦 | CST | UTC-6 |
| 🇲🇽 | MST | UTC-7 |
| 🇺🇲 | PST | UTC-8 |
| 🇬🇧 | GMT | UTC+0 |
| 🌍 | UTC | UTC+0 |
| 🇪🇺 | CET | UTC+1 |
| 🇫🇷 | CEST | UTC+2 |
| 🇿🇦 | SAST | UTC+2 |
| 🇷🇺 | MSK | UTC+3 |
| 🇮🇳 | IST | UTC+5:30 |
| 🇨🇳 | CST | UTC+8 |
| 🇯🇵 | JST | UTC+9 |
| 🇦🇺 | AEDT | UTC+11 |

## Troubleshooting
- **Bot does not react to messages:** Ensure the bot has `Add Reactions` and `Read Message History` permissions.
- **Bot does not assign roles:** Make sure the bot’s role is higher than the timezone roles in the server settings.
- **Bot crashes on start:** Check that your `.env` file contains the correct bot token.

## License
This project is open-source and available under the MIT License.

## Contributors
- **NightsHigh** - [GitHub Profile](https://github.com/NightsHigh)

