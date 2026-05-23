export interface Playlist {
  id: string;
  name: string;
  trackCount: number;
  imageUrl: string | null;
}

export interface AllPlaylistsResponse {
  spotify: Playlist[] | null;
  youtube: Playlist[] | null;
  deezer: Playlist[] | null;
  apple: Playlist[] | null;
}
