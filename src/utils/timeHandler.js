// -------------------------------------------------------------------------------------------------

import { DateTime } from 'luxon'

// -------------------------------------------------------------------------------------------------

export function convertTimeInterval(timeInterval) {
  switch (timeInterval) {
    case 'minutely':
      return 'm';

    case 'hourly':
      return 'h';

    case 'daily':
    default:
      return 'd';
  }
}

// -------------------------------------------------------------------------------------------------

// REF: https://moment.github.io/luxon/docs/manual/formatting.html
function _dateTime({ date, offset, zone = 'UTC' }) {
  const dateTime = date ? DateTime.fromMillis(date, { zone }) : DateTime.local()
  return offset ? dateTime.plus({ seconds: offset }) : dateTime
}

export function dateTimeToISODate({ date, offset, zone = 'UTC' }) {
  return _dateTime({ date, offset, zone }).toISODate()
}

export function dateTimeToISODateTime({ date, offset, zone = 'UTC' }) {
  return _dateTime({ date, offset, zone }).toISO()
}

export function dateTimeToFormat({ date, offset, format, zone = 'UTC' }) {
  // return _dateTime({ date, offset, zone }).toFormat(format)
  return _dateTime({ date, offset, zone }).toMillis()
}

export function isoToDateTime(iso) {
  return DateTime.fromISO(iso)
}

// -------------------------------------------------------------------------------------------------
