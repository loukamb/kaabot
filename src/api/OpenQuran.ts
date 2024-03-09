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

import { NodeHtmlMarkdown } from "node-html-markdown"

import QuranChapters from "./OpenQuranChapters"

export interface SearchResult {
  count: number
  input: string
  time: string
  verses?: VersesEntity[] | null
  occurrenceInfo: OccurrenceInfoOrOccurrenceInfoBySize
  occurrenceInfoBySize: OccurrenceInfoOrOccurrenceInfoBySize
  canShowUrdu: boolean
  showUrdu: boolean
  mostFrequentTopics?: string[] | null
  bismillahIncluded: boolean
  wordTree: WordTree
}

export interface VersesEntity {
  id: number
  input: string
  position: number
  positionNonAhmadi: number
  arabicWords: ArabicWordsEntity[]
  english: string
  urdu: string
  translations: TranslationsEntity[]
  topics?: string[] | null
  chapterNum: number
  verseNum: number
  verseNumNonAhmadi: number
  surahInfo: SurahInfo
  hasUrduHighlighted: boolean
  hasArabicHighlighted: boolean
  showUrdu: boolean
  canShowUrdu: boolean
  crossReferencesCount: number
  tafaseerCount: number
  citationCount: number
  isLastVerseInChapter: boolean
  isUthmanic: boolean
}

export interface ArabicWordsEntity {
  id: string
  content: string
  normalContent: string
  rootContent: string
  lexiconPresent: boolean
  translationEn: string
  translationUr: string
  transliterationEn: string
}

export interface TranslationsEntity {
  translatorId: string
  verseNum: number
  marked: string
}

export interface SurahInfo {
  revelation: string
  juz: number
  manzil: number
  ruku: number
  hizb: number
}

export interface OccurrenceInfoOrOccurrenceInfoBySize {
  chapterOccurrence?: number[] | null
  maxOccurrence: number
}

export interface WordTree {
  id: string
  children?: null[] | null
  type: string
}

/**
 * Function to perform a search query on OpenQuran.
 */
export async function search(query: string) {
  const request = await fetch("https://api.openquran.com/express/oq_search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      isUthmanic: false,
      translations: ["en"],
    }),
  })
  return (await request.json()) as SearchResult
}

interface OpenQuranIdiomaticWordInfo {
  translations: {
    english: string
    urdu: string
  }

  transliterations: {
    english: string
  }
}

interface OpenQuranIdiomaticVerse {
  /**
   * Index of the chapter.
   */
  readonly chapter: number

  /**
   * Name of the chapter.
   */
  readonly chapterName: {
    english: string
    arabic: string
    transliteration: string
  }

  /**
   * Index of the verse.
   */
  readonly verse: number

  /**
   * Translations, in easily-printable text.
   */
  readonly translations: {
    readonly english: string
    readonly arabic: string
    readonly urdu: string
  }

  /**
   * Analysis of Arabic text.
   */
  readonly analysis: Record<string, OpenQuranIdiomaticWordInfo | string>
}

/**
 * Same as `search`, but return formatted results that are easier
 * to work with.
 */
export async function idiomaticSearch(query: string) {
  const searchResults = await search(query)

  const formattedResults = [] as OpenQuranIdiomaticVerse[]
  if (searchResults.verses) {
    for (const verse of searchResults.verses) {
      const arabicWords = [] as string[]
      const analysis = {} as Record<string, OpenQuranIdiomaticWordInfo | string>
      for (const word of verse.arabicWords) {
        if (word.normalContent) {
          analysis[word.normalContent] = {
            translations: {
              english: word.translationEn,
              urdu: word.translationUr,
            },
            transliterations: {
              english: word.transliterationEn,
            },
          }
        } else {
          analysis[word.content] = word.content
        }
        arabicWords.push(word.normalContent ?? word.content)
      }

      const arabic = arabicWords.join(" ")
      const chapter = QuranChapters.find(
        (chapter) => chapter.id === verse.chapterNum
      )!

      formattedResults.push({
        verse: verse.id,
        chapter: verse.chapterNum,
        chapterName: {
          arabic: chapter.name,
          english: chapter.translation,
          transliteration: chapter.transliteration,
        },
        translations: {
          english: NodeHtmlMarkdown.translate(verse.english),
          urdu: verse.urdu,
          arabic,
        },
        analysis,
      })
    }
  }

  return formattedResults
}
