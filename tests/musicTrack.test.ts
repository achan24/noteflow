import * as SQLite from 'expo-sqlite';
import { MusicTrack } from '../src/models';

describe('MusicTrack Storage CRUD', () => {
  let db: any;

  beforeAll(() => {
    db = SQLite.openDatabase('test.db');
  });

  beforeEach((done: any) => {
    db.transaction((tx: any) => {
      tx.executeSql('DROP TABLE IF EXISTS music_tracks;');
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS music_tracks (id TEXT PRIMARY KEY NOT NULL, url TEXT, title TEXT, duration INTEGER, tags TEXT);',
        [],
        () => done()
      );
    });
  });

  it('should insert a music track', (done: any) => {
    const track: MusicTrack = {
      id: 'track1',
      url: 'https://music.youtube.com/track1',
      title: 'Test Track',
      duration: 180,
      tags: ['focus'],
    };
    db.transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO music_tracks (id, url, title, duration, tags) VALUES (?, ?, ?, ?, ?);',
        [track.id, track.url, track.title, track.duration, JSON.stringify(track.tags)],
        (_: any, result: any) => {
          expect(result.rowsAffected).toBe(1);
          done();
        }
      );
    });
  });

  it('should fetch a music track by id', (done: any) => {
    const track: MusicTrack = {
      id: 'track2',
      url: 'https://music.youtube.com/track2',
      title: 'Another Track',
      duration: 200,
      tags: ['study'],
    };
    db.transaction((tx: any) => {
      tx.executeSql('INSERT INTO music_tracks (id, url, title, duration, tags) VALUES (?, ?, ?, ?, ?);',
        [track.id, track.url, track.title, track.duration, JSON.stringify(track.tags)]);
      tx.executeSql('SELECT * FROM music_tracks WHERE id = ?;', [track.id], (_: any, { rows }: any) => {
        expect(rows.length).toBe(1);
        expect(rows._array[0].title).toBe('Another Track');
        done();
      });
    });
  });

  it('should update a music track', (done: any) => {
    const track: MusicTrack = {
      id: 'track3',
      url: 'https://music.youtube.com/track3',
      title: 'Old Title',
      duration: 210,
      tags: ['tag'],
    };
    db.transaction((tx: any) => {
      tx.executeSql('INSERT INTO music_tracks (id, url, title, duration, tags) VALUES (?, ?, ?, ?, ?);',
        [track.id, track.url, track.title, track.duration, JSON.stringify(track.tags)]);
      tx.executeSql('UPDATE music_tracks SET title = ? WHERE id = ?;', ['New Title', track.id]);
      tx.executeSql('SELECT * FROM music_tracks WHERE id = ?;', [track.id], (_: any, { rows }: any) => {
        expect(rows._array[0].title).toBe('New Title');
        done();
      });
    });
  });

  it('should delete a music track', (done: any) => {
    const track: MusicTrack = {
      id: 'track4',
      url: 'https://music.youtube.com/track4',
      title: 'To Delete',
      duration: 220,
      tags: ['remove'],
    };
    db.transaction((tx: any) => {
      tx.executeSql('INSERT INTO music_tracks (id, url, title, duration, tags) VALUES (?, ?, ?, ?, ?);',
        [track.id, track.url, track.title, track.duration, JSON.stringify(track.tags)]);
      tx.executeSql('DELETE FROM music_tracks WHERE id = ?;', [track.id]);
      tx.executeSql('SELECT * FROM music_tracks WHERE id = ?;', [track.id], (_: any, { rows }: any) => {
        expect(rows.length).toBe(0);
        done();
      });
    });
  });
});
