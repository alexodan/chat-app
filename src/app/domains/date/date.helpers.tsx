export function parseTime(inputTime: string) {
  const currentTime = new Date()
  const inputDate = new Date(inputTime)

  // Calculate the time difference in milliseconds
  const timeDifference = currentTime.getTime() - inputDate.getTime()

  // Define a function to format the date in "dd/mm/yyyy" format
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Check the conditions and return the appropriate format
  if (timeDifference < 86400000) {
    // Within the same day
    const hours = inputDate.getHours().toString().padStart(2, '0')
    const minutes = inputDate.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } else if (timeDifference < 172800000) {
    // Previous day
    return 'yesterday'
  } else if (timeDifference < 604800000) {
    // Within a week, output the day of the week
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const dayOfWeek = daysOfWeek[inputDate.getDay()]
    return dayOfWeek.toLowerCase()
  }
  // Older than a week, output in "dd/mm/yyyy" format
  return formatDate(inputDate)
}
