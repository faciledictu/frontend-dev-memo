import { useEffect, useState } from 'react';
import { Linking, ScrollView, Text, TextInput, View } from 'react-native';

import { SITE, findCase } from '../cases';
import type { ScreenProps } from '../navigation';
import {
  loadResults,
  saveResult,
  verdictLabels,
  type Verdict,
} from '../results';
import { Bullets, Button, Section, styles } from '../ui';

const verdicts = Object.keys(verdictLabels) as Verdict[];

export function CaseScreen({ navigation, route }: ScreenProps<'Case'>) {
  const item = findCase(route.params.id);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadResults([item.id]).then((results) => {
      const result = results[item.id];
      if (!result) return;
      setVerdict(result.verdict);
      setNote(result.note);
      setSaved(true);
    });
  }, [item.id]);

  async function save() {
    if (!verdict) return;
    await saveResult(item.id, { verdict, note, at: new Date().toISOString() });
    setSaved(true);
  }

  return (
    // The result form is at the top, so the keyboard never covers it
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.row}>
        <Button
          title="Start the test"
          onPress={() => navigation.navigate('Test', { id: item.id })}
        />
        <Button
          title="Open the page"
          onPress={() => Linking.openURL(SITE + item.page)}
        />
      </View>

      <Section title="Result">
        <View style={styles.row}>
          {verdicts.map((value) => (
            <Button
              key={value}
              title={verdictLabels[value]}
              selected={verdict === value}
              onPress={() => {
                setVerdict(value);
                setSaved(false);
              }}
            />
          ))}
        </View>
        <TextInput
          aria-label="Note"
          placeholder="What you saw, per variant"
          value={note}
          onChangeText={(text) => {
            setNote(text);
            setSaved(false);
          }}
          multiline
          style={[
            styles.input,
            { minHeight: 96, paddingTop: 12, textAlignVertical: 'top' },
          ]}
        />
        <View style={styles.row}>
          <Button title={saved ? 'Saved' : 'Save'} onPress={save} />
        </View>
      </Section>

      <Section title="Setup">
        <Bullets items={item.setup} />
      </Section>
      <Section title="Steps">
        <Bullets items={item.steps} />
      </Section>
      <Section title="Expected (what the page says)">
        <Bullets items={item.expected} />
      </Section>
      <Section title="Write down">
        <Bullets items={item.record} />
      </Section>
      <Text style={styles.muted}>{SITE + item.page}</Text>
    </ScrollView>
  );
}
