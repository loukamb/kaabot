<p align="center">
<br>
<b>﷽</b>
<br><br>
</p>

---

<p align="center">
<img width="80" height="80" align="center" src="./logos/logo.svg"><br><Br>
<b>Kaab'ot</b> is a pretty little Discord bot that provides knowledge related to Islam and from the Holy Quran. Developed as a modern, lightweight replacement to other similar bots. <a href="https://add.kaabot.org"><b>Add now.</b></a><br><br>
<a href="https://discord.kaabot.org"><img src="https://dcbadge.vercel.app/api/server/sXbjZzH5zy?style=flat"></a> <a href=""><img src="https://badgen.net/github/release/mblouka/kaabot"></a> <a href="LICENSE.md"><img src="https://badgen.net/github/license/mblouka/kaabot" /></a> 
</p>

---

### Features

- Cite verses from the Holy Quran with the `/verse` command. Provides English, Arabic, and Urdu translations automatically.
  - Analyze the individual Arabic words of each verse by passing the optional `analyse` parameter.
  - Verses provided from [OpenQuran](https://www.openquran.com/), an easy-to-use Quran search engine.
- On-demand retrieval of Salat timings with the `/salat` command, as well as an opt-in notifier/reminder for prayers with configurable location(s).
  - Uses [Nominatim](https://github.com/osm-search/Nominatim) for geolocalization. If you are hosting Kaab'ot yourself, you will also have to host your own Nominatim instance.
  - **Work in progress.** Currently only available in the nightly version of the bot.
- Fetch Friday Sermons from [Muslim Television Ahmadiyya International](https://beta.mta.tv/).
  - Provides both a permalink on MTA **and** a direct download link to a 1920x1080 (full HD) MP4 of the sermon.
  - Pass `list` parameter to retrieve the last 10 Friday sermons.
- Access hundreds of selected writings and books from scholars, caliphs and Hazrat Mirza Ghulam Ahmad (a.s.).
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

#### Languages

- Built-in Arabic translator and dictionary.
- Additional translations for the `/verse` and `/library` commands. Currently, only English, Arabic, and Urdu are supported.

#### Friday sermons

- Implement a better way of retrieving Friday sermons.
  - Currently, the MTA page is scrapped to obtain Next.js bundle metadata necessary for fetching Friday sermon data, and _even then_ the retrieved sermon data is only a cached (and not fresh) copy.
- Embeddable Friday sermons (so they display in Discord channels)
  - A prototype video embedder is setup as a Cloudflare Worker at [syn.tv](https://github.com/mblouka/syntv) and while it _does_ embed, it breaks after a few seconds due to the size of the video.
  - **TODO:** Figure out how a lower-quality version of the sermon can be retrieved for embeds exclusively. Probably by parsing the m3u8 playlist.
- Retrieval of translations & subtitles for Friday sermons (when available).
  - **TODO:** Reverse engineer the confusing Akamai video formats used by MTA.

#### Library

- Implement `/library download`.
  - **TODO:** Check against permissions to see if bot is allowed to upload files first. If not, disable command.

#### Other

- `/hadith` command to lookup ahadith.
- Hijri → Gregorian conversion. Sadly the libraries used do not easily parse Hijri dates, only Gregorian dates. Gregorian → Hijri however works perfectly.
- User suggestions (if any).

### Nightly distribution

If you want to test experimental or otherwise work-in-progress features, you can try them over at the [official Kaab'ot support server.](https://discord.kaabot.org) Simply use the `nightly-*` commands offered by Kaab'ot Nightly instead of the standard ones. At this moment, it's not possible to add the nightly distribution of the bot to third party servers.

## Usage

You can add this Discord bot to your guild with [this link](https://add.kaabot.org). If you'd like to try the bot before inviting it to your guild, you can join the official [Discord server](https://discord.kaabot.org) first.

### Self-hosting

This project requires [Node.js](https://nodejs.org/en) 20 or above. [Create a Discord bot first, making sure to invite it to your guild(s) immediately after.](https://discord.com/developers/docs/getting-started#step-1-creating-an-app) Then, clone this repository into an empty folder, and create a `.env` file with the following values:

```shell
# Insert your bot's client ID here.
DISCORD_BOT_CLIENT="..."

# Insert your bot's token here.
DISCORD_BOT_SECRET="..."

# (optional) Nominatim URL for geolocalization.
NOMINATIM_URL="..."
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

### Geolocalization setup

To enable use of `/salat` commands (and anything else that supports geolocalization queries), you have to provide a URL to a [Nominatim](https://github.com/osm-search/Nominatim) backend as an environment variable (`NOMINATIM_URL`). The bot will automatically detect the environment variable and enable the relevant commands.

The public instance of Kaab'ot uses its own self-hosted backend, but it is _exclusively_ for the use of the public instance (as to avoid overuse from other bots). You will have to host your own if you want to self-host Kaab'ot. If you want to avoid this, just [add](https://add.kaabot.org) the public instance of the bot to your server instead.

[**If you want to self-host Nominatim, please read this guide.**](https://github.com/mediagis/nominatim-docker/tree/master/4.4) I highly recommend using a Docker container on a cheap VPS with a lot of storage so you can import the most geolocalization data possible with minimal setup.

**Alternatively**, you may use [OpenStreetMap's public Nominatim backend](https://nominatim.openstreetmap.org/) for your own self-hosted bot, but do note that it is subject to **strict** rate limits and you will have to display attribution somewhere in your server, which may not be ideal. For more information, read their [usage policy](https://operations.osmfoundation.org/policies/nominatim/).

## Theology

### About Islam

**Want to learn more about Islam?** Feel free to consult these free, simple resources on the religion of Islam:

- [**What is Islam?**](https://www.alislam.org/islam/)
  - A short summary of the religion of Islam.
- [**Why believe Islam?**](https://www.alislam.org/articles/why-i-believe-in-islam/)
  - A personal, emotional testimony of why one may come to believe in Islam.
- [**Have questions about Islam?**](https://www.alislam.org/askislam/)
  - A well organized collection of questions and answers on Islam.
- [**Do muslims believe in peace?**](https://www.muslimsforpeace.org/peace/)
  - Answering the age-old question of the relationship between peace and Islam. Short answer: **of course!**
- [**Read the Holy Quran**](https://alislam.org/quran/app/1)
  - Use this free and quite nifty web application to read the Quran.

### Discussion

This repository and its facilities (i.e., discussions and issues) are **not** places for theological discussion or debate. All communication done on this repository is for <ins>technical</ins> purposes only. Keep religious discussion and debate out of the repository. You may discuss religious matters in the off-topic sections of the [Discord server](https://discord.kaabot.org), however. If you dislike what this bot does or where it comes from, simply do not use it or choose an alternative.

## License

This work is licensed under the GNU Affero General Public License (AGPL) Version 3. For more information, consult [the license file.](/LICENSE)
