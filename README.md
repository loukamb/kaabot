<img width="64" height="64" align="right" src="logo.svg">
<h1>Kaab'ot</h1>

Pretty little Discord bot that provides knowledge on Islam, the Holy Quran, and various information sourced from the Ahmadiyya Muslim Jama'at.

[![](https://dcbadge.vercel.app/api/server/sXbjZzH5zy?style=flat)](https://discord.gg/sXbjZzH5zy)

### Features

- Cite verses from the Holy Quran with the `/verse` command. Provides English, Arabic, and Urdu translations automatically.
  - Analyze the individual Arabic words of each verse by passing the optional `analyse` parameter.
  - Verses provided from [OpenQuran](https://www.openquran.com/), an Ahmadi project.
- Fetch the latest Friday Sermon from [Muslim Television Ahmadiyya International](https://beta.mta.tv/).
  - Provides both a permalink on MTA **and** a direct download link to a 1920x1080 (full HD) MP4 of the sermon.
  - Pass `list` parameter to retrieve the last 10 Friday sermons.
- Access hundreds of selected writings and books from Ahmadi scholars, caliphs and Hazrat Mirza Ghulam Ahmad (a.s.).
  - Local library can be built from alislam.org with the `npm run books` command. Automatically downloads all PDF files too.
  - Search results can be curated with `skip` and `limit` parameters to prevent listing of 100+ books all at once in a single message.
  - `/library search` to search through the library with a keyword (e.g., 'jesus').
  - `/library get` retrieves a book from its unique identifier. Displays a description, author information, and a download link to an English PDF.
  - `/library download` uploads a PDF of the book directly into the Discord channel.
  - `/library author` searches for, and displays information about, an author.
  - `/library list-books` lists the books from an author.
  - `/library list-authors` lists all currently indexed authors.
- Convert between Gregorian and Hijri dates using `/calendar`, understands both precise (e.g., "March 10, 2024") **and** imprecise/relative (e.g., "next friday", "2 weeks from now", etc.) inputs.

### Upcoming features

- On-demand retrieval of Salat timings, as well as an opt-in notifier/reminder for prayers with configurable location(s).
  - **TODO:** Reverse engineer endpoints on alislam.org's Adhan pages ([1](https://www.alislam.org/adhan/calendar), [2](https://www.alislam.org/adhan)) **or** find out the Dhuhr and Fajr/Isha angles used by AMJ. Scraping not doable due to the pages immediately defaulting to your IP geolocation.
- Arabic translator and/or word look-up.
- Embeddable Friday sermons (so they display in Discord channels)
  - A prototype video embedder is setup as a Cloudflare Worker at [syn.tv](https://github.com/mblouka/syntv) and while it _does_ embed, it breaks after a few seconds due to the size of the video.
  - **TODO:** Figure out how a lower-quality version of the sermon can be retrieved for embeds exclusively. Probably by parsing the m3u8 playlist.
- Retrieval of translations & subtitles for Friday sermons (when available).
  - **TODO:** Reverse engineer the confusing Akamai video formats used by MTA.
- Search, browse, and embed programs streamed right from MTA.
  - **TODO:** See if it's possible to implement some kind of search functionality.
- Hijri → Gregorian conversion. Sadly the libraries used do not easily parse Hijri dates, only Gregorian dates. Gregorian → Hijri however works perfectly.
- Implement `/library download`.
  - **TODO:** Check against permissions to see if bot is allowed to upload files first. If not, disable command.
- User suggestions (if any).

## Usage

This project requires [Node.js](https://nodejs.org/en) 20 or above. **There is currently no (official) publicly usable instance of the bot** (other than the one available in the [Discord server](https://discord.gg/sXbjZzH5zy), but it is hosted for that server exclusively). For now, you will have to host it yourself.

### Hosting

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

npm run books
# Optional, see below!

npm run start
# or "pnpm start" if you have pnpm.
```

### Library setup

To enable use of `/library` commands, you need to run `npm run books` after installing dependencies. The `books` command will automatically fetch most writings from alislam.org's online library and cache them into the `library` folder, as to prevent users from constantly making requests to alislam.org through the bot. **The resulting library will be quite large, around ~1 GB.**

Not all writings will be retrieved (as not all books are available in PDF format), and building the library is entirely optional, especially if you are not comfortable with scraping the website. However, the `/library` command will not be available if you do not do so.

## Theology

This repository and its facilities (i.e., discussions and issues) are **not** places for theological discussion or debate. All communication done on this repository is for <ins>technical</ins> purposes only. Keep religious discussion and debate out of the repository. You may discuss religious matters in the off-topic sections of the [Discord server](https://discord.gg/sXbjZzH5zy), however. If you dislike what this bot does or where it comes from, simply do not use it or choose an alternative.

## License

This work is licensed under the GNU Affero General Public License (AGPL) Version 3. For more information, consult [the license file.](/LICENSE)
