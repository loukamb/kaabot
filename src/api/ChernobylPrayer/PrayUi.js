// Extracted from https://www.ahmadiyya.ca/prayertimes/prayui.js
// Heavily modified.

// Forced to install these dependencies because this code from 1953
// depends on it. Could switch to dayjs eventually.
import tzlookup from "tz-lookup"
import moment from "moment-timezone"

import prayTimes from "./PrayTimes"
prayTimes.adjust({
  fajr: 14.5,
  dhuhr: "15 min",
  maghrib: "1 min",
  isha: 12.3,
  highLats: "AngleBased",
})

export default function getPrayerTimes(lat, long, time) {
  const adjustFajrTime = (times) => {
    const fajrTime = times.fajr
    const sunRiseTime = times.sunrise
    let fTime = fajrTime.split(" ")[0].split(":")
    let sTime = sunRiseTime.split(" ")[0].split(":")
    let dateFajr = new Date()
    let dateSunRise = new Date()
    dateFajr.setHours(fTime[0])
    dateFajr.setMinutes(fTime[1])
    dateSunRise.setHours(sTime[0])
    dateSunRise.setMinutes(sTime[1])
    let msDifference = dateSunRise - dateFajr
    let minutesDiff = Math.floor(msDifference / 1000 / 60)
    let _eval = minutesDiff - 85
    if (_eval > 0) {
      let adjustedMinutes = parseInt(fTime[1]) + _eval
      let hours = Math.floor(adjustedMinutes / 60)
      let adjustedHour =
        hours > 0 ? parseInt(fTime[0]) + hours : parseInt(fTime[0])
      adjustedHour = ((adjustedHour + 12 - 1) % 12) + 1
      let minAdjustedTotal = hours > 0 ? adjustedMinutes - 60 : adjustedMinutes
      times.fajr = adjustedHour + ":" + minAdjustedTotal + " am"
    }
    return times
  }

  const getDailyTimes = (date) => {
    let dst = 0
    let tzone = "auto"
    tzone = tzlookup(lat, long)
    tzone = moment(date).tz(tzone).utcOffset() / 60

    return prayTimes.getTimes(date, [lat, long], tzone, dst, "12h")
  }

  const times = getDailyTimes(time ?? new Date())
  return adjustFajrTime(times)
}
