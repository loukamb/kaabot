# Changelog

## Kaab'ot 1.3.3

### User

- Added link to Sunnah in hadith outputs.

### Technical

- Improved fault tolerance of `/hadith` queries.

## Kaab'ot 1.3.2

### User

- **`/baiat` is a command for retrieving the Conditions of Bai'at.**
  - Give it a single index from 1 until 10 and the bot will post the relevant Condition of Bai'at. If no index is provided, it will provide an explanation of Bai'at and a link to the form.

### Technical

- Added Ahmadiyya logo to embed.
- Added additional link to Holy Quran in verse outputs in the title embed (compatibility fix with older Discord clients, e.g. Aliucord).
- Changed default color of embed from green to black in concordance with Ahmadiyya logo.
- Removed useless dependencies.

## Kaab'ot 1.3.1

### User

- **`/hadith` is a command for retrieving hadiths.**
  - Give it a single book name and verse reference (e.g. `bukhari:6594`) and the bot will post the relevant paragraph into chat.

### Technical

No changes.

## Kaab'ot 1.3.0

### User

- **`/5v` is a command that can be used to retrieve Holy Quran commentary from the [Five Volume Commentary](https://www.booksonislam.org/products/five-volume-commentary) collection.**
  - Give it a single verse (e.g. `1:1`) and the bot will post the relevant page of the verse into chat.
- **`/salat` is a command that can be used to retrieve Salat timings.** (experimental)
  - Salat timings are computed from the provided location (city name or precise address).
  - An optional date can be provided to retrieve Salat timings for a specific day.
  - Requires a Nominatim instance to be setup. See Technical section for details.
  - **Experimental feature.** It must be manually enabled by bot administrators.
- `/verse` now accepts the `translations` parameter, which is a comma-separated list of translations to include in the output.
  - Currently only supports `en`, `ar`, and `ur`.
- Translated name of chapter now included in `/verse` outputs.

### Technical

- Bot can now use a Nominatim instance to enable geolocalization features. This feature is experimental, and not enabled by default. **Without a Nominatim instance, the `/salat` command (and other geolocalization features) will be disabled.**
  - Address to the Nominatim instance must be provided as the `geolocalizationUrl` field in `settings.json`.
  - Read [here](https://github.com/mediagis/nominatim-docker/tree/master/4.4) to learn how to self-host a Nominatim instance within a Docker container. Do note that you need _plenty_ of storage space to store all the data.
- A cache engine is now implemented to memoize lookups wherever possible. Set `cache` to false in `settings.json` if you want to disable this for some reason.
- Console outputs are now more readable.
- Fixed bug with verse numbering.

## Kaab'ot 1.2.0

### User

- Adjusted embed color to a more earthly tone.
- `/verse` now accepts more flexible queries.
  - Instead of specifying a chapter and verse in distinct options, you can simply input `chapter:verse` (e.g. `1:1`).
  - Multiple verses can also be retrieved with an optional range parameter (e.g. `1:1-3`).

### Technical

No changes.

## Kaab'ot 1.1.2

### User

- An `Open in Quran` button is now displayed below verse outputs.

### Technical

No changes.

## Kaab'ot 1.1.1

### User

- Added version to response prompts.

### Technical

- Added support for nightly mode.

## Kaab'ot 1.1.0

### User

- Response prompts now list Kaab'ot's name and version.

### Technical

- Added configurable settings file, `settings.json`
  - Logging can now be turned off to prevent console pollution.
  - Bismillah counting can now be configured globally for self-hosted instances of the bot.

## Kaab'ot 1.0.1

### User

- Added `disregard-bismillah` option to `/verse` for ayat indexing without the Bismillah counted.

### Technical

- Multi-guild support instead of built-in.

## Kaab'ot 1.0.0

### User

- First versioned release.
- Now publicly available. Add from https://kaabot.org

### Technical

No changes.
