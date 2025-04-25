import * as SQLite from 'expo-sqlite';
import { Video } from '../src/models';

describe('Video Storage CRUD', () => {
  let db: any;

  beforeAll(() => {
    db = SQLite.openDatabase('test.db');
  });

  beforeEach((done: any) => {
    db.transaction((tx: any) => {
      tx.executeSql('DROP TABLE IF EXISTS videos;');
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS videos (id TEXT PRIMARY KEY NOT NULL, url TEXT, title TEXT, tags TEXT, slices TEXT);',
        [],
        () => done()
      );
    });
  });

  it('should insert a video', (done: any) => {
    const video: Video = {
      id: 'vid1',
      url: 'https://youtube.com/watch?v=abc',
      title: 'Test Video',
      tags: ['learning'],
      slices: [],
    };
    db.transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO videos (id, url, title, tags, slices) VALUES (?, ?, ?, ?, ?);',
        [video.id, video.url, video.title, JSON.stringify(video.tags), JSON.stringify(video.slices)],
        (_: any, result: any) => {
          expect(result.rowsAffected).toBe(1);
          done();
        }
      );
    });
  });

  it('should fetch a video by id', (done: any) => {
    const video: Video = {
      id: 'vid2',
      url: 'https://youtube.com/watch?v=def',
      title: 'Another Video',
      tags: ['focus'],
      slices: [],
    };
    db.transaction((tx: any) => {
      tx.executeSql('INSERT INTO videos (id, url, title, tags, slices) VALUES (?, ?, ?, ?, ?);',
        [video.id, video.url, video.title, JSON.stringify(video.tags), JSON.stringify(video.slices)]);
      tx.executeSql('SELECT * FROM videos WHERE id = ?;', [video.id], (_: any, { rows }: any) => {
        expect(rows.length).toBe(1);
        expect(rows._array[0].title).toBe('Another Video');
        done();
      });
    });
  });

  it('should update a video', (done: any) => {
    const video: Video = {
      id: 'vid3',
      url: 'https://youtube.com/watch?v=ghi',
      title: 'Old Title',
      tags: ['tag'],
      slices: [],
    };
    db.transaction((tx: any) => {
      tx.executeSql('INSERT INTO videos (id, url, title, tags, slices) VALUES (?, ?, ?, ?, ?);',
        [video.id, video.url, video.title, JSON.stringify(video.tags), JSON.stringify(video.slices)]);
      tx.executeSql('UPDATE videos SET title = ? WHERE id = ?;', ['New Title', video.id]);
      tx.executeSql('SELECT * FROM videos WHERE id = ?;', [video.id], (_: any, { rows }: any) => {
        expect(rows._array[0].title).toBe('New Title');
        done();
      });
    });
  });

  it('should delete a video', (done: any) => {
    const video: Video = {
      id: 'vid4',
      url: 'https://youtube.com/watch?v=jkl',
      title: 'To Delete',
      tags: ['remove'],
      slices: [],
    };
    db.transaction((tx: any) => {
      tx.executeSql('INSERT INTO videos (id, url, title, tags, slices) VALUES (?, ?, ?, ?, ?);',
        [video.id, video.url, video.title, JSON.stringify(video.tags), JSON.stringify(video.slices)]);
      tx.executeSql('DELETE FROM videos WHERE id = ?;', [video.id]);
      tx.executeSql('SELECT * FROM videos WHERE id = ?;', [video.id], (_: any, { rows }: any) => {
        expect(rows.length).toBe(0);
        done();
      });
    });
  });

  it('should not insert duplicate video IDs', (done: any) => {
    const video: Video = {
      id: 'vid_dup',
      url: 'https://youtube.com/watch?v=dup',
      title: 'Duplicate',
      tags: ['dup'],
      slices: [],
    };
    db.transaction((tx: any) => {
      tx.executeSql('INSERT INTO videos (id, url, title, tags, slices) VALUES (?, ?, ?, ?, ?);',
        [video.id, video.url, video.title, JSON.stringify(video.tags), JSON.stringify(video.slices)]);
      // Try to insert again
      tx.executeSql('INSERT INTO videos (id, url, title, tags, slices) VALUES (?, ?, ?, ?, ?);',
        [video.id, video.url, video.title, JSON.stringify(video.tags), JSON.stringify(video.slices)],
        (_: any, result: any) => {
          // Should not allow duplicate, so rowsAffected should be 0
          expect(result.rowsAffected).toBe(0);
          done();
        }
      );
    });
  });

  it('should handle fetching non-existent video', (done: any) => {
    db.transaction((tx: any) => {
      tx.executeSql('SELECT * FROM videos WHERE id = ?;', ['nonexistent'], (_: any, { rows }: any) => {
        expect(rows.length).toBe(0);
        done();
      });
    });
  });

  it('should handle deleting non-existent video', (done: any) => {
    db.transaction((tx: any) => {
      tx.executeSql('DELETE FROM videos WHERE id = ?;', ['nonexistent'], (_: any, result: any) => {
        expect(result.rowsAffected).toBe(0);
        done();
      });
    });
  });

  it('should handle invalid data (missing required fields)', (done: any) => {
    db.transaction((tx: any) => {
      // Try to insert with missing title
      tx.executeSql('INSERT INTO videos (id, url, tags, slices) VALUES (?, ?, ?, ?);',
        ['vid_invalid', 'https://youtube.com', JSON.stringify(['tag']), JSON.stringify([])],
        (_: any, result: any) => {
          // Should not insert, rowsAffected should be 0
          expect(result.rowsAffected).toBe(0);
          done();
        }
      );
    });
  });

  it('should handle SQL error (simulate error in mock)', (done: any) => {
    db.transaction((tx: any) => {
      tx.executeSql('ERROR SQL', [], (_: any, result: any) => {
        // Should not call success, but if it does, rowsAffected should be 0
        expect(result?.rowsAffected || 0).toBe(0);
        done();
      }, (err: any) => {
        expect(err).toBeDefined();
        done();
      });
    });
  });
});
