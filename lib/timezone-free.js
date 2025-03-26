import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { startOfDay, endOfDay } from 'date-fns'

const TIMEZONE = 'Asia/Ho_Chi_Minh'

// These functions to handle time shifting when client and server run on 2 different timezones

export const tzNow = () => {
  return toZonedTime(new Date(), TIMEZONE)
}

export const tzfStartOfDay = (date) => {
  return fromZonedTime(startOfDay(new Date(date)), TIMEZONE)
}

export const tzfEndOfDay = (date) => {
  return fromZonedTime(endOfDay(new Date(date)), TIMEZONE)
}
