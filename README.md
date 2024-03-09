<img width="64" height="64" align="right" src="logo.svg">
<h1>Kaab'ot</h1>

Pretty little Discord bot that provides knowledge on Islam, the Holy Quran, and various information sourced from the Ahmadiyya Muslim Jama'at.

### Features

- Cite verses from the Holy Quran with the `/verse` command. Provides English, Arabic, and Urdu translations automatically.
  - Analyze the individual Arabic words of each verse by passing the optional `analyse` parameter.
  - Verses provided from [OpenQuran](https://www.openquran.com/), an Ahmadi project.
- Fetch the latest Friday Sermon from [Muslim Television Ahmadiyya International](https://beta.mta.tv/).
  - Provides both a permalink on MTA **and** a direct download link to a 1920x1080 (full HD) MP4 of the sermon.
  - Pass `list` parameter to retrieve the last 10 Friday sermons.
- Convert between Gregorian and Hijri dates using `/calendar`, understands both precise (e.g., "March 10, 2024") **and** imprecise/relative (e.g., "next friday", "2 weeks from now", etc.) inputs.

### Upcoming features

- On-demand retrieval of Salat timings, as well as an opt-in notifier/reminder for prayers with configurable location(s).
  - **TODO:** Reverse engineer endpoints on alislam.org's Adhan pages ([1](https://www.alislam.org/adhan/calendar), [2](https://www.alislam.org/adhan)) **or** find out the Dhuhr and Fajr/Isha angles used by AMJ. Scraping not doable due to the pages immediately defaulting to your IP geolocation.
- Arabic translator and/or word look-up.
- Built-in index of the writings of Hazrat Mirza Ghulam Ahmad (a.s.) with links to PDFs and their translations.
  - **TODO:** This index need to be manually built as these writings are not centralized on alislam.org. Will do eventually.
  - **TODO:** Also do this for the Khalifas.
- Embeddable Friday sermons (so they display in Discord channels)
  - A prototype video embedder is setup as a Cloudflare Worker at [syn.tv](https://github.com/mblouka/syntv) and while it _does_ embed, it breaks after a few seconds due to the size of the video.
  - **TODO:** Figure out how a lower-quality version of the sermon can be retrieved for embeds exclusively. Probably by parsing the m3u8 playlist.
- Retrieval of translations & subtitles for Friday sermons (when available).
  - **TODO:** Reverse engineer the confusing Akamai video formats used by MTA.
- Search, browse, and embed programs streamed right from MTA.
  - **TODO:** See if it's possible to implement some kind of search functionality.
- Hijri → Gregorian conversion. Sadly the libraries used do not easily parse Hijri dates, only Gregorian dates. Gregorian → Hijri however works perfectly.
- User suggestions (if any).

## Usage

This project requires [Node.js](https://nodejs.org/en) 20 or above. **There is currently no (official) public instance of the bot.** For now, you will have to host it yourself.

[Create a Discord bot first, making sure to invite it to your guild(s) immediately after.](https://discord.com/developers/docs/getting-started#step-1-creating-an-app) Then, clone this repository into an empty folder, and create a `.env` file with the following values:

```shell
# Insert your bot's client ID here.
DISCORD_BOT_CLIENT="..."

# Insert your bot's token here.
DISCORD_BOT_SECRET="..."

# Insert the guild IDs here, separated by commas.
GUILDS="123456789,123456789,123456789"
```

Afterwards, run the following commands and the bot will launch automatically:

```shell
npm run build
# or "pnpm build" if you have pnpm.

npm run start
# or "pnpm start" if you have pnpm.
```

## License

This work is licensed under the GNU Affero General Public License (AGPL) Version 3. For more information, consult [the license file.](/LICENSE)
