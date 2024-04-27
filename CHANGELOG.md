# Changelog

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
