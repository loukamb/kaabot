import { promises as fs, existsSync as exists } from "node:fs"
import path from "node:path"

export interface KaabotSettings {
  /**
   * URL to Nominatim instance for geolocalization features. Experimental.
   * Defaults to `undefined`.
   */
  readonly geolocalizationUrl?: string

  /**
   * Whether to enable the caching engine. Enabling this reduces hits to alislam.org.
   * Defaults to `true`.
   */
  readonly cache: boolean

  /**
   * Whether the bismillah should be counted as part of the verse numbering.
   * Defaults to `true`. User can manually turn this off as part of their queries.
   */
  readonly countBismillah: boolean

  /**
   * Logging options, for usage analysis & development.
   * Defaults with everything enabled.
   */
  readonly logging?: {
    /**
     * Whether certain errors should be logged to the console output.
     * All fields defaults to true.
     */
    readonly logErrors?: {
      /**
       * Whether errors arising at command runtime should be logged.
       */
      readonly commandRuntime: boolean

      /**
       * Whether errors arising at command registration should be logged.
       */
      readonly commandRegistration: boolean
    }

    /**
     * Whether command executions should be logged to the console output.
     * Defaults to `true`.
     */
    readonly logCommandInvocations: boolean
  }
}

const defaultSettings = {
  cache: true,
  countBismillah: true,
  logging: {
    logErrors: {
      commandRuntime: true,
      commandRegistration: true,
    },
    logCommandInvocations: true,
  },
} satisfies KaabotSettings

let _settingsCache: KaabotSettings | undefined
export default async function settings() {
  if (_settingsCache) {
    return _settingsCache
  }

  const settingsPath = path.join(".", "settings.json")
  if (exists(settingsPath)) {
    try {
      const loadedSettings = JSON.parse(
        await fs.readFile(settingsPath, "utf-8")
      ) as Partial<KaabotSettings>
      _settingsCache = Object.assign({ ...defaultSettings }, loadedSettings)
    } catch (e) {
      console.error(
        "An error was encountered while loading settings. Using defaults."
      )
      console.error(e)
      _settingsCache = defaultSettings
    }
  } else {
    console.log('No "settings.json" file found. Using defaults.')
    _settingsCache = defaultSettings
  }

  if (!_settingsCache.geolocalizationUrl) {
    console.warn(
      "Geolocalization features are disabled. Check README.md for more information."
    )
  } else {
    console.log(
      `Geolocalization features are enabled. Using Nominatim instance at ${_settingsCache.geolocalizationUrl}.`
    )
  }

  return _settingsCache
}
