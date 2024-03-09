/**
 *  Copyright (C) 2024 Louka Ménard Blondin
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { parse } from "node-html-parser"

// Generated with https://jvilk.com/MakeTypes/.
// Not necessarily the best looking types.
export interface MTA {
  pageProps: PageProps
  __N_SSG: boolean
}
export interface PageProps {
  similar?: SimilarEntity[] | null
  brand: Brand
  seo: Seo
  currentYear: number
  years: Years
}
export interface SimilarEntity {
  revisionId: number
  noIndex: boolean
  availableFrom: string
  availableFrom_timestamp: number
  upid: number
  pid: string
  teaserImage: TeaserImage
  permalink: string
  isPromo: boolean
  isLiveEvent: boolean
  liveEventEndAt?: null
  liveEventEndAt_timestamp: number
  brandId: number
  brand: string
  categories?: string[] | null
  categories_hierarchical: CategoriesHierarchical
  recordDate: string
  recordDate_timestamp: number
  recordedYear: number
  recordedMonth: number
  recordedDay: number
  tags: TagsOrTagsStrict
  tags_strict: TagsOrTagsStrict
  redirects?: null[] | null
  updatedAt: string
  title_eng: string
  titleShort_eng: string
  description_eng: string
  content_eng: string
  keywords_eng?: null
  encodingProfile: number
  playback: Playback
  permalink_legacy?: string | null
  teaser_image_legacy?: string | null
  redirects_legacy?: string[] | null
  objectID: string
  _highlightResult: HighlightResult
  durationSeconds?: number | null
}
export interface TeaserImage {
  "16x9"?: string | null
}
export interface CategoriesHierarchical {
  lvl0?: string[] | null
  lvl1?: string[] | null
}
export interface TagsOrTagsStrict {
  lvl0?: string[] | null
  lvl1?: string[] | null
  lvl2?: string[] | null
}
export interface Playback {
  legacytv: string
  akamaiHlsTvUrl: string
  akamaiDashUrl: string
  akamaiDashTvUrl: string
  default: string
  mp4?: string[] | null
}
// Mein gott.
export interface HighlightResult {
  availableFrom_timestamp: Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile
  pid: Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile
  permalink: Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile
  brand: Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile
  recordDate_timestamp: Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile
  recordedYear: Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile
  tags: TagsOrTagsStrict1
  tags_strict: TagsOrTagsStrict1
  title_eng: Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile
  encodingProfile: Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile
  redirects_legacy?:
    | Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile[]
    | null
}
export interface Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile {
  value: string
  matchLevel: string
  matchedWords?: null[] | null
}
export interface TagsOrTagsStrict1 {
  lvl0?:
    | Lvl0EntityOrRedirectsLegacyEntityOrAvailableFromTimestampOrPidOrPermalinkOrBrandOrRecordDateTimestampOrRecordedYearOrTitleEngOrEncodingProfile[]
    | null
}
export interface Brand {
  type: string
  id: string
  filter: string
  templateId: string
  title_eng: string
  description_eng: string
  teaserImage: TeaserImage1
  permalink: string
  redirects_legacy?: string[] | null
  redirects?: null[] | null
  objectID: string
}
export interface TeaserImage1 {
  "16x9": string
  "9x13": string
}
export interface Seo {
  title: string
  description: string
  permalink: string
}
export interface Years {
  2002: number
  2010: number
  2011: number
  2012: number
  2013: number
  2014: number
  2015: number
  2016: number
  2017: number
  2018: number
  2019: number
  2020: number
  2021: number
  2022: number
  2023: number
  2024: number
}

interface MTAEpisode {
  /**
   * Permalink.
   */
  readonly uri: string

  /**
   * Direct link to episode (if available).
   */
  readonly raw?: string

  /**
   * Title of episode.
   */
  readonly title: string

  /**
   * Description of episode.
   */
  readonly description: string

  /**
   * Thumbnail of episode (if provided).
   */
  readonly thumbnail?: string
}

// TODO: Write a more universal function for searching MTA content.
async function search(query: string) {
  throw new Error("Unimplemented")
}

/**
 * Retrieve the ten last Friday sermons from MTA.
 */
export async function sermons() {
  // Fetch the MTA webpage for the friday ermons.
  const sermonPage = await (
    await fetch("https://beta.mta.tv/brand/2/friday-sermon")
  ).text()

  // Parse the HTML.
  const sermonHtml = parse(sermonPage)

  // Locate the MTA endpoint to retrieve latest shows.
  const scriptTags = sermonHtml.querySelectorAll("script")
  const relevantScriptTag = scriptTags.find((tag) =>
    tag.attributes.src?.includes("_ssgManifest")
  )
  const [, , , nextJsBuildHash] = relevantScriptTag!.attributes.src.split("/")
  const endpoint = `https://beta.mta.tv/_next/data/${nextJsBuildHash}/brand/2/friday-sermon.json`

  // Retrieve the friday sermon data.
  const sermonData = (await (await fetch(endpoint)).json()) as MTA

  // Parse entries into more idiomatic objects.
  const entries = sermonData.pageProps.similar
  if (entries) {
    return entries.map((entry) => ({
      uri: `https://beta.mta.tv${entry.permalink}`,
      title: entry.title_eng,
      description: entry.description_eng,
      thumbnail:
        entry.teaserImage["16x9"] ??
        "https://upload.wikimedia.org/wikipedia/commons/5/50/Mta_Logo.png",
      raw: entry.playback.mp4?.[0],
    })) as MTAEpisode[]
  }

  return [] as MTAEpisode[]
}
