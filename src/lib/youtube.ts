/** Extract a YouTube video id from common watch / embed / short URLs. */
export function youtubeId(url?: string | null): string | null {
  if (!url?.trim()) return null;
  const value = url.trim();
  const embed = value.match(/youtube\.com\/embed\/([^?&/]+)/i);
  if (embed?.[1]) return embed[1];
  const watch = value.match(/[?&]v=([^&]+)/i);
  if (watch?.[1]) return watch[1];
  const short = value.match(/youtu\.be\/([^?&/]+)/i);
  return short?.[1] || null;
}
