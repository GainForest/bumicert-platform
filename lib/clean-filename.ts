/**
 * Cleans a filename into a human-friendly name for display.
 * Examples:
 *   "morning_birds_2024.mp3" → "Morning birds 2024"
 *   "recording-at-site-A.wav" → "Recording at site A"
 *   "my.audio.file.flac" → "My audio file"
 */
export function cleanFilename(filename: string): string {
  // Remove the file extension (everything after and including the last dot,
  // but only if there is content before the dot)
  let name = filename;
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex >= 0) {
    const stem = filename.slice(0, lastDotIndex);
    if (stem.length > 0) {
      name = stem;
    } else {
      // Nothing before the dot (e.g. ".mp3") — treat as empty
      name = "";
    }
  }

  // Replace underscores, hyphens, and dots with spaces
  name = name.replace(/[_\-.]/g, " ");

  // Trim whitespace
  name = name.trim();

  // If the result is empty after processing, return "Untitled"
  if (name.length === 0) {
    return "Untitled";
  }

  // Capitalize the first letter of the result
  return name.charAt(0).toUpperCase() + name.slice(1);
}
