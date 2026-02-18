export async function parseAudioMetadata(
  file: File,
): Promise<{ date: string | null; name: string | null }> {
  try {
    const { parseBlob } = await import("music-metadata");
    const metadata = await parseBlob(file);
    const date = metadata.common.date ?? null;
    const name = metadata.common.title ?? null;
    return { date, name };
  } catch {
    return { date: null, name: null };
  }
}
