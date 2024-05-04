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

import { BotCommand } from "."
import embed from "../embed"

/** https://www.ahmadiyya.ca/docsrep/DeclarationofInitiation.pdf */
const baiatConditions = [
  "The initiate shall solemnly promise that he/she shall abstain from Shirk (association of any partner with God) right up to the day of his/her death.",
  "That he/she shall keep away from falsehood, fornication, adultery, trespasses of the eye, debauchery, dissipation, cruelty, dishonesty, mischief and rebellion; and will not permit him/her to be carried away by passions, however strong they may be.",
  "That he/she shall regularly offer the five daily prayers in accordance with the commandments of God and the Holy Prophet (peace and blessings of Allah) be upon him; and shall try his/her best to be regular in offering the Tahajjud (pre-dawn supererogatory prayers) and invoking Durood (blessings) on the Holy Prophet (peace and blessings of Allah be upon him); that he/she shall make it his/her daily routine to ask forgiveness for his/her sins, to remember the bounties of God and to praise and glorify Him.",
  "That under the impulse of any passions, he/she shall cause no harm whatsoever to the creatures of Allah in general, and Muslims in particular, neither by his/her tongue nor by his/her hands nor by any other means.",
  "That he/she shall remain faithful to God in all circumstances of life, in sorrow and happiness, adversity and prosperity, in felicity and trials; and shall in all conditions remain resigned to the decree of Allah and keep himself/herself ready to face all kinds of indignities and sufferings in His way and shall never turn away from it at the onslaught of any misfortune; on the contrary, he/she shall march forward.",
  "That he/she shall refrain from following un-Islamic customs and lustful inclinations, and shall completely submit himself/herself to the authority of the Holy Quran; and shall make the Word of God and the Sayings of the Holy Prophet (peace and blessings of Allah be upon him) the guiding principle in every walk of his/her life.",
  "That he/she shall entirely give up pride and vanity and shall pass all his/her life in lowliness, humbleness, cheerfulness, forbearance and meekness.",
  "That he/she shall hold faith, the honor of faith, and the cause of Islam dearer to him/her than his/her life, wealth, honor, children and all other dear ones.",
  "That he/she shall keep himself/herself occupied in the service of God's creatures, for His sake only; and shall endeavor to benefit mankind to the best of his/her God-given abilities and powers.",
  "That he/she shall enter into a bond of brotherhood with this humble servant of God, pledging obedience to me in everything good, for the sake of Allah, and remain faithful to it till the day of his/her death; that he/she shall exert such a high devotion in the observance of this bond as is not to be found in any other worldly relationships and connections demanding devoted dutifulness.",
]

/** https://stackoverflow.com/a/9083076 */
function romanize(num: number) {
  if (isNaN(num)) return NaN
  var digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ],
    roman = "",
    i = 3
  while (i--) roman = (key[+digits.pop()! + i * 10] || "") + roman
  return Array(+digits.join("") + 1).join("M") + roman
}

export default {
  name: "baiat",
  description: "Retrieves the conditions of bai'at (initiation).",
  options: [
    {
      name: "condition",
      description: "Specific condition to retrieve. From 1 to 10. Optional.",
      type: "number",
    },
  ],
  async command(interaction) {
    const condition = interaction.options.getNumber("condition")
    if (condition != null) {
      const text = baiatConditions[condition - 1]
      if (!text) {
        throw new Error("Invalid bai'at condition.")
      }
      interaction.editReply(
        embed({
          title: `Condition ${romanize(condition)}`,
          contents: text,
        })
      )
      return
    }

    interaction.editReply(
      embed({
        title: "Bai'at",
        href: "https://www.ahmadiyya.ca/docsrep/DeclarationofInitiation.pdf",
        buttons: [
          {
            text: "✒️ View Bai'at",
            url: "https://www.ahmadiyya.ca/docsrep/DeclarationofInitiation.pdf",
          },
        ],
        contents: `In 1889, Hazrat Mirza Ghulam Ahmad of Qadian claimed to be the same Promised Messiah and al-Mahdi about whom the Holy Prophet Muhammad(sa) had given glad tidings. The Holy Prophet(sa) had prophesied that the important role of the Promised Messiah and al-Mahdi would be to revive faith and firmly establish the practice of Islamic law.

When the Promised Messiah made his claim and invited all righteous souls to respond to his call, he published 10 conditions of bai'at for all who wished to join him with a covenant of allegiance. It is important for all Ahmadis to familiarize themselves with these 10 conditions.
        
Hazrat Mirza Masroor Ahmad, Khalifatul Masih V (May Allah be his helper) has explained these 10 conditions in the light of the Holy Quran, sayings of the Holy Prophet(sa) and the writings of the Promised Messiah(as) in various Friday sermons and speeches. These are being presented in the format of a book for the guidance of all Ahmadis and all those who want to learn about Ahmadiyyat the true Islam.`,
      })
    )
  },
} as BotCommand
