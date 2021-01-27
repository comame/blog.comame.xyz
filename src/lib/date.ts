type date = { year: number, month: number, date: number }

export function compareByDate(a: date, b: date) {
    if (a.year != b.year) return b.year - a.year
    if (a.month != b.month) return b.month - a.month
    return b.date - a.date
}

export function toStringMonthAndDate(date: date): string {
    return ('0' + date.month).slice(-2) + '-' + ('0' + date.date).slice(-2)
}

export function toString(date: date): string {
    return date.year + '-' + toStringMonthAndDate(date)
}
