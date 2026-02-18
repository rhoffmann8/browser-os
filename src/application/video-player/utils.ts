export type Video = {
  videoId?: string | null;
  playlistId?: string | null;
  params?: any;
};

export function extractVideoFromUrl(urlOrVideoId: string): Video | null {
  let videoId: string | null = null;
  let listId: string | null = null;

  try {
    const parsedUrl = new URL(urlOrVideoId);
    videoId = parsedUrl.searchParams.get("v");
    listId = parsedUrl.searchParams.get("list");
  } catch {
    if (urlOrVideoId.length === 11) {
      videoId = urlOrVideoId;
    } else {
      listId = urlOrVideoId;
    }
  }

  return { videoId, playlistId: listId };
}

export function createVideoUrl(video: Video | undefined) {
  if (!video) return undefined;

  if (video.videoId) {
    const url = new URL(`https://www.youtube.com/watch`);
    url.searchParams.set("v", video.videoId);
    if (video.playlistId) {
      url.searchParams.set("list", video.playlistId);
    }

    return url.toString();
  } else if (video.playlistId) {
    const url = new URL(`https://www.youtube.com/playlist`);
    url.searchParams.set("list", video.playlistId);
    return url.toString();
  }
}
