export const getCurrentWeek = () => {
  const now = new Date()
  const dayOfWeek = now.getDay() // Sunday = 0, Saturday = 6
  const currentTime = now.getHours() * 60 + now.getMinutes() // current time in minutes (hours * 60 + minutes)

  const minutesOf19Hours = 1140 // 19 * 60

  // If it's after 7:00 PM on Saturday, we move to next week
  if (currentTime >= minutesOf19Hours && dayOfWeek == 6) {
    now.setDate(now.getDate() + 1) // Move to Sunday of the next week
  }

  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - dayOfWeek) // Set to last Sunday

  // Calculate the end of the week (Saturday)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Add 6 days to Sunday to get Saturday

  // Return the start and end dates
  return {
    start: startOfWeek.toISOString().split('T')[0], // Format as YYYY-MM-DD
    end: endOfWeek.toISOString().split('T')[0], // Format as YYYY-MM-DD
  }
}

export const generateDateArray = (dateFrom, dateTo) => {
  const dates = []
  for (let d = new Date(dateFrom); d <= new Date(dateTo); d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export const isSameDate = (date1, date2) => {
  const date1Obj = new Date(date1)
  const date2Obj = new Date(date2)
  return (
    date1Obj.getFullYear() === date2Obj.getFullYear() &&
    date1Obj.getMonth() === date2Obj.getMonth() &&
    date1Obj.getDate() === date2Obj.getDate()
  )
}

export const getStartOfDate = (date) => {
  const startOfDate = new Date(date)
  startOfDate.setHours(0, 0, 0, 0)

  return startOfDate
}

export const getEndOfDate = (date) => {
  const endOfDate = new Date(date)
  endOfDate.setHours(23, 59, 59, 999)

  return endOfDate
}
