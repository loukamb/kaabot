<p align="center">
<br>
<b>﷽</b>
<br><br>
</p>

---

<p align="center">
<img width="80" height="80" align="center" src="./logos/logo.svg"><br><Br>
<b>Kaab'ot</b> is a pretty little Discord bot that provides knowledge related to Islam and from the Holy Quran. Developed as a modern, lightweight replacement to other similar bots. <a href="https://add.kaabot.org"><b>Add now.</b></a><br><br>
<a href="https://discord.kaabot.org"><img src="https://dcbadge.vercel.app/api/server/sXbjZzH5zy?style=flat"></a> <a href=""><img src="https://badgen.net/github/release/mblouka/kaabot?color=000000&labelColor=orange"></a> <a href="LICENSE.md"><img src="https://badgen.net/github/license/mblouka/kaabot?color=000000&labelColor=orange" /></a> <a href="https://alislam.org"><img src="https://badgen.net/static/Ahmadiyya/alislam.org/black?color=000000&labelColor=000000&icon=https://raw.githubusercontent.com/mblouka/kaabot/main/logos/ahmadiyya.svg"></a>
</p>

---

### Table of Contents

- [Features](#features)
- [Usage](#usage)
  - [Self-hosting](#self-hosting)
  - [Library setup](#library-setup)
  - [Geolocalization setup](#geolocalization-setup)
- [Theology](#theology)
  - [About Islam](#about-islam)
  - [Discussion](#discussion)
- [License](#license)

---

> [!NOTE]
> This project has reached maturity. As such, there won't be any new features. The public instance of the bot will continue to be maintained for the foreseeable future (as well as bugfixes and general upkeep of functionality).

## Features

- Cite verses from the Holy Quran with the `/verse` command. Provides English, Arabic, and Urdu translations automatically.

  - Analyze the individual Arabic words of each verse by passing the optional `analyse` parameter.
  - Verses provided from [OpenQuran](https://www.openquran.com/), an easy-to-use Quran search engine.

- Cite hadiths from trusted Muslim scholars with the `/hadith` command.

  - Give it a single book name and verse reference (e.g. `bukhari:6594`) and the bot will post the relevant paragraph into chat.

- Retrieve interesting commentary of the Holy Quran with the `/5v` command. Sources commentary from the [Five Volume Commentary](https://www.booksonislam.org/products/five-volume-commentary) collection (thus `5v`).

  - Give it a single verse (e.g. `1:1`) and the bot will post the relevant page of the verse into chat.

- On-demand retrieval of Salat timings with the `/salat` command, as well as an opt-in notifier/reminder for prayers with configurable location(s).

  - Uses [Nominatim](https://github.com/osm-search/Nominatim) for geolocalization. If you are hosting Kaab'ot yourself, you will also have to host your own Nominatim instance.
  - **Experimental feature.** Must be manually enabled by administrators of self-hosted bots.

- Fetch Friday Sermons from [Muslim Television Ahmadiyya International](https://beta.mta.tv/).

  - Provides both a permalink on MTA **and** a direct download link to a 1920x1080 (full HD) MP4 of the sermon.
  - Pass `list` parameter to retrieve the last 10 Friday sermons.

- Retrieval of the Bai'at (initiation into Islam) form, as well as the Conditions of Bai'at, with the `/baiat` command.

  - Give it a single index from 1 until 10 and the bot will post the relevant Condition of Bai'at. If no index is provided, it will provide an explanation of Bai'at and a link to the form.

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

## Usage

You can add this Discord bot to your guild with [this link](https://add.kaabot.org). If you'd like to try the bot before inviting it to your guild, you can join the official [Discord server](https://discord.kaabot.org) first.

### Self-hosting

This project requires [Node.js](https://nodejs.org/en) 20 or above. [Create a Discord bot first, making sure to invite it to your guild(s) immediately after.](https://discord.com/developers/docs/getting-started#step-1-creating-an-app) Then, clone this repository into an empty folder, and create a `.env` file with the following values:

```shell
# Insert your bot's client ID here.
DISCORD_BOT_CLIENT="..."

# Insert your bot's token here.
DISCORD_BOT_SECRET="..."
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

To enable use of `/salat` commands (and anything else that supports geolocalization queries), you have to provide a URL to a [Nominatim](https://github.com/osm-search/Nominatim) backend as the `geolocalizationUrl` field of your `settings.json` file. The bot will automatically detect the setting and enable the relevant commands.

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
