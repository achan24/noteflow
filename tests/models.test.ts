import { Video, MusicTrack, Slice, Note, Bookmark, Tag, Transcript, Analytics } from "../src/models";

describe("Model Creation", () => {
  test("should create a Video object", () => {
    const video: Video = {
      id: "vid1",
      url: "https://youtube.com/watch?v=abc",
      title: "Test Video",
      tags: ["learning"],
      slices: [],
    };
    expect(video.id).toBe("vid1");
    expect(video.url).toContain("youtube.com");
    expect(video.tags).toContain("learning");
    expect(video.slices).toEqual([]);
  });

  test("should create a MusicTrack object", () => {
    const track: MusicTrack = {
      id: "track1",
      url: "https://music.youtube.com/track1",
      title: "Test Track",
      duration: 180,
      tags: ["focus"],
    };
    expect(track.duration).toBeGreaterThan(0);
    expect(track.tags).toContain("focus");
  });

  test("should create a Slice object", () => {
    const slice: Slice = {
      video_id: "vid1",
      music_track_id: "track1",
      start: 0,
      end: 30,
      assigned_music: "track1",
      assigned_tags: ["focus"],
    };
    expect(slice.start).toBe(0);
    expect(slice.end).toBe(30);
    expect(slice.assigned_music).toBe("track1");
  });

  test("should create a Note object", () => {
    const note: Note = {
      id: "note1",
      video_id: "vid1",
      timestamp: 15,
      text: "Interesting point",
      tags: ["important"],
    };
    expect(note.video_id).toBe("vid1");
    expect(note.timestamp).toBe(15);
    expect(note.text).toBe("Interesting point");
    expect(note.tags).toContain("important");
  });

  test("should create a Bookmark object", () => {
    const bookmark: Bookmark = {
      id: "bm1",
      video_id: "vid1",
      timestamp: 20,
      label: "Start of section",
      tags: ["review"],
    };
    expect(bookmark.label).toBe("Start of section");
    expect(bookmark.tags).toContain("review");
  });

  test("should create a Tag object", () => {
    const tag: Tag = {
      id: "tag1",
      name: "learning",
      type: "video",
    };
    expect(tag.name).toBe("learning");
    expect(["video", "note", "bookmark"]).toContain(tag.type);
  });

  test("should create a Transcript object", () => {
    const transcript: Transcript = {
      video_id: "vid1",
      segments: [
        { start: 0, end: 10, text: "Hello world" },
        { start: 10, end: 20, text: "More text" },
      ],
    };
    expect(transcript.segments.length).toBe(2);
    expect(transcript.segments[0].text).toBe("Hello world");
  });

  test("should create an Analytics object", () => {
    const analytics: Analytics = {
      totalClipsWatched: 10,
      notesPerTag: { important: 3 },
      streak: 5,
    };
    expect(analytics.totalClipsWatched).toBe(10);
    expect(analytics.notesPerTag.important).toBe(3);
    expect(analytics.streak).toBe(5);
  });
});
