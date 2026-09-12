import dayjs from './index';

/**
 * The timezone the service operates in. Pickup times are wall-clock times in
 * this zone, never in the booker's local zone: a coordinator working from
 * Central must still book a 1:00 PM Eastern pickup by entering "1:00 PM".
 *
 * Keep in sync with DEFAULT_TIMEZONE on the backend.
 */
export const BUSINESS_TIMEZONE = 'America/Toronto';

/**
 * Interpret a date + time the user picked as a wall-clock time in
 * BUSINESS_TIMEZONE.
 *
 * `new Date('2026-08-07T13:00')` parses in the *browser's* zone, so booking
 * from a Central machine silently shifted every pickup by an hour. Parsing
 * through dayjs.tz pins the entry to the business zone regardless of where the
 * booker sits.
 */
export function businessDateTime(date: string, time?: string) {
  const trimmedDate = date?.trim();
  if (!trimmedDate) return null;

  const trimmedTime = time?.trim();
  const stamp = trimmedTime ? `${trimmedDate} ${trimmedTime}` : trimmedDate;

  const parsed = dayjs.tz(stamp, BUSINESS_TIMEZONE);
  return parsed.isValid() ? parsed : null;
}

/**
 * Build the UTC ISO string the API expects from a picked date + time.
 * Returns null when the pieces are missing or unparseable.
 */
export function businessDateTimeToIso(
  date: string,
  time?: string
): string | null {
  return businessDateTime(date, time)?.toISOString() ?? null;
}
