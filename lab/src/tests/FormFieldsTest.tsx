import { useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button, colors, styles } from '../ui';

export function FormFieldsTest() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (name.trim()) {
      setError('');
      return;
    }
    setError('Name is required');
    // iOS has no live regions; on Android the error text below is one
    if (Platform.OS === 'ios')
      AccessibilityInfo.announceForAccessibility('Name is required');
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: 4 }}>
        <Text style={styles.muted}>Field 1: aria-label</Text>
        <TextInput
          aria-label="Name"
          // The error joins the label while it is shown
          accessibilityHint={error || undefined}
          value={name}
          onChangeText={setName}
          style={[styles.input, error && { borderColor: colors.fail }]}
        />
        {/* Always mounted: a live region added together with its text may stay
            silent. View, because Text drops aria-live; not collapsable, or
            Fabric flattens it away */}
        <View aria-live="assertive" collapsable={false}>
          {error ? (
            <Text style={[styles.text, { color: colors.fail }]}>{error}</Text>
          ) : null}
        </View>
      </View>

      <View style={{ gap: 4 }}>
        <Text style={styles.muted}>Field 2: placeholder only</Text>
        <TextInput
          placeholder="Phone"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      <View style={{ gap: 4 }}>
        <Text nativeID="email-label" style={styles.text}>
          Email
        </Text>
        <TextInput
          aria-labelledby="email-label"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.row}>
        <Button title="Submit" onPress={submit} />
      </View>
    </ScrollView>
  );
}
