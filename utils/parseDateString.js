export default function parseDateString(dateString) {
  const parts = dateString.split('-'); // Splits "YYYY-MM-DD" into ["YYYY", "MM", "DD"]
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date (0 = January, 11 = December)
  const day = parseInt(parts[2], 10);
  
  return [year, month, day];
}