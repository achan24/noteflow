import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import * as SQLite from 'expo-sqlite';
import type { Video as VideoModel } from '../src/models';

const db = SQLite.openDatabase('noteflow.db');

export default function HomeScreen() {
  const [videos, setVideos] = useState<VideoModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS videos (id TEXT PRIMARY KEY NOT NULL, url TEXT, title TEXT, tags TEXT, slices TEXT);'
      );
      tx.executeSql(
        'SELECT * FROM videos;',
        [],
        (_: any, { rows }: any) => {
          setVideos(rows._array || []);
          setLoading(false);
        },
        (err: any) => {
          setLoading(false);
          return false;
        }
      );
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>No videos in your playlist yet.</Text>
        <Text style={styles.info}>Tap below to add your first video!</Text>
        <Button title="Add Video" onPress={() => {/* TODO: navigate to add video */}} />
      </View>
    );
  }

  // If there are videos, show the first one
  const firstVideo = videos[0];
  return (
    <View style={styles.container}>
      <Text style={styles.info}>{firstVideo.title}</Text>
      <Video
        source={{ uri: firstVideo.url }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={{ width: 320, height: 200, backgroundColor: '#000' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  info: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
});
