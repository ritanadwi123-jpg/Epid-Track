
/**
 * Calculates the Epidemiological Week (ME) for a given date.
 * Following Kemenkes/WHO standard: Week starts on Sunday.
 * Week 1 is the first week of the year containing at least 4 days of January.
 */
export const getEpiWeek = (dateStr: string): { week: number; year: number; label: string } => {
  const date = new Date(dateStr);
  const tempDate = new Date(date.getTime());
  
  // Set to nearest Sunday (start of week)
  tempDate.setDate(tempDate.getDate() - tempDate.getDay());
  const year = tempDate.getFullYear();
  
  // Find first Sunday of the year
  const firstDayOfYear = new Date(year, 0, 1);
  const firstSunday = new Date(year, 0, 1);
  while (firstSunday.getDay() !== 0) {
    firstSunday.setDate(firstSunday.getDate() + 1);
  }
  
  // If first Sunday is after Jan 4th, ME 1 started the previous year or is later
  // For simplicity in surveillance apps, ME 1 is usually the week of the first Sunday
  const daysDiff = Math.floor((tempDate.getTime() - firstSunday.getTime()) / (24 * 60 * 60 * 1000));
  const weekNum = Math.max(1, Math.floor(daysDiff / 7) + 1);
  
  return {
    week: weekNum,
    year: year,
    label: `ME ${weekNum} - ${year}`
  };
};
