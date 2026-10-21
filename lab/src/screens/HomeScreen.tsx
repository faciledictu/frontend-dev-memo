import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';

import { cases } from '../cases';
import type { ScreenProps } from '../navigation';
import {
  buildReport,
  clearResults,
  describeDevice,
  loadResults,
  verdictLabels,
  type Result,
} from '../results';
import { Button, colors, styles } from '../ui';

const verdictColors = {
  'as-expected': colors.pass,
  'differs': colors.fail,
  'unclear': colors.unclear,
};

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [screenReader, setScreenReader] = useState(false);
  const ids = cases.map((item) => item.id);

  useFocusEffect(
    useCallback(() => {
      loadResults(cases.map((item) => item.id)).then(setResults);
    }, [])
  );

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader);
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReader
    );
    return () => subscription.remove();
  }, []);

  async function share() {
    await Share.share({ message: buildReport(cases, results) });
  }

  function clear() {
    Alert.alert('Clear all results?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearResults(ids);
          setResults({});
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.muted}>{describeDevice()}</Text>
      <Text style={styles.muted}>
        Screen reader: {screenReader ? 'on' : 'off'}
      </Text>
      {cases.map((item) => {
        const result = results[item.id];
        return (
          <Pressable
            key={item.id}
            role="button"
            onPress={() => navigation.navigate('Case', { id: item.id })}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <Text
              style={[
                styles.muted,
                result && { color: verdictColors[result.verdict] },
              ]}
            >
              {result ? verdictLabels[result.verdict] : 'Not tested'}
            </Text>
          </Pressable>
        );
      })}
      <View style={styles.row}>
        <Button title="Share report" onPress={share} />
        <Button title="Clear results" onPress={clear} />
      </View>
    </ScrollView>
  );
}
