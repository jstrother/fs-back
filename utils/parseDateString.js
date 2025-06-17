/**
 * Parses a date string (expected format "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DD")
 * into year, month (0-indexed), and day components.
 *
 * @param {string|null|undefined} dateString - The date string to parse.
 * @returns {number[]} An array containing [year, month (0-indexed), day],
 * or default values if the dateString is invalid or null/undefined.
 */
export default function parseDateString(dateString) {
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    // If dateString is null, undefined, or not a string, return default values
    return [1970, 0, 1]; // Default to January 1, 1970
  }
  const parts = dateString.split('-'); // Splits "YYYY-MM-DD" into ["YYYY", "MM", "DD"]
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date (0 = January, 11 = December)
  const day = parseInt(parts[2], 10);
  
  return [year, month, day];
}