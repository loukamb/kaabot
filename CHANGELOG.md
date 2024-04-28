# Changelog

## Kaab'ot 1.3.0 (in progress)

### User

- **`/salat` is a command that can be used to retrieve the Salat timings.**
  - Salat timings are computed from the provided location (city name or precise address).
  - An optional date can be provided to retrieve Salat timings for a specific day.
  - Requires a Nominatim instance to be setup. See Technical section for details.
- `/verse` now accepts the `translations` parameter, which is a comma-separated list of translations to include in the output.
  - Currently only supports `en`, `ar`, and `ur`.
- Translated name of chapter now included in `/verse` outputs.

### Technical

- Bot can now use a Nominatim instance to enable geolocalization features. **Without a Nominatim instance, the `/salat` command (and other geolocalization features) will be disabled.**
  - Address to the Nominatim instance must be provided as the `NOMINATIM_URL` environment variable in `.env`.
  - Read [here](https://github.com/mediagis/nominatim-docker/tree/master/4.4) to learn how to self-host a Nominatim instance within a Docker container. Do note that you need _plenty_ of storage space to store all the data.

The [public instance](https://kaabot.org) of Kaab'ot uses its own hosted Nominatim instance with full global data, so if you don't feel like hosting your own, just [add](https://add.kaabot.org) the public instance of the bot to your Discord server to spare you the trouble.

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
