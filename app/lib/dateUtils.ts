export function formatDateToMMDDYYYY(dateString: string | Date): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      // Try to parse as MM/DD/YYYY if it's already in that format or similar non-standard string
      const parts =
        typeof dateString === "string" ? dateString.split(/[-/]/) : [];
      if (parts.length === 3) {
        let month, day, year;
        // Attempt to determine if it's YYYY-MM-DD or MM-DD-YYYY or similar
        if (parseInt(parts[0], 10) > 12 && parseInt(parts[1], 10) <= 12) {
          // Likely YYYY/MM/DD
          year = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
          day = parseInt(parts[2], 10);
        } else {
          // Assume MM/DD/YYYY or MM-DD-YYYY
          month = parseInt(parts[0], 10);
          day = parseInt(parts[1], 10);
          year = parseInt(parts[2], 10);
        }
        // If year is two digits, try to infer century (this is heuristic)
        if (year < 100) {
          year += year + 2000 <= new Date().getFullYear() + 50 ? 2000 : 1900;
        }
        const reconstructedDate = new Date(year, month - 1, day);
        if (!isNaN(reconstructedDate.getTime())) {
          const formattedMonth = (reconstructedDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const formattedDay = reconstructedDate
            .getDate()
            .toString()
            .padStart(2, "0");
          const formattedYear = reconstructedDate.getFullYear();
          return `${formattedMonth}/${formattedDay}/${formattedYear}`;
        }
      }
      console.warn(
        `Invalid date string provided to formatDateToMMDDYYYY: ${dateString}`
      );
      return typeof dateString === "string" ? dateString : ""; // Return original string or empty if not string
    }

    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // getUTCMonth is 0-indexed
    const day = date.getUTCDate().toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error(`Error formatting date string: ${dateString}`, error);
    return typeof dateString === "string" ? dateString : ""; // Fallback to original string or empty
  }
}
