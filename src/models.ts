// Core data models for NoteFlow

export interface Video {
  id: string;
  url: string;
  title: string;
  tags: string[];
  slices: Slice[];
}

export interface MusicTrack {
  id: string;
  url: string;
  title: string;
  duration: number; // seconds
  tags: string[];
}

export interface Slice {
  video_id: string;
  music_track_id: string;
  start: number; // seconds
  end: number; // seconds
  assigned_music: string;
  assigned_tags: string[];
}

export interface Note {
  id: string;
  video_id: string;
  timestamp: number;
  text: string;
  tags: string[];
}

export interface Bookmark {
  id: string;
  video_id: string;
  timestamp: number;
  label?: string;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
  type: "video" | "note" | "bookmark";
}

export interface Transcript {
  video_id: string;
  segments: { start: number; end: number; text: string }[];
}

export interface Analytics {
  [key: string]: any;
}
