import { useHeaderHeight } from '@react-navigation/elements';
import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text, TextInput, View } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { session } from '../session';
import { Button, colors, styles } from '../ui';

type Mode = 'chat' | 'form';

const messages = Array.from(
  { length: 20 },
  (_, index) => `Message ${index + 1}`
);
const fields = Array.from({ length: 12 }, (_, index) => `Field ${index + 1}`);

export function KeyboardControllerTest() {
  const [mode, setMode] = useState<Mode>('chat');

  useEffect(() => {
    session.keyboardControllerMounted = true;
  }, []);

  return (
    // Mounted here and not at the root: it changes how Android applies insets,
    // which would skew the core KeyboardAvoidingView test
    <KeyboardProvider>
      <View style={styles.screen}>
        <View style={[styles.content, styles.row, { paddingBottom: 8 }]}>
          <Button
            title="chat"
            selected={mode === 'chat'}
            onPress={() => setMode('chat')}
          />
          <Button
            title="form"
            selected={mode === 'form'}
            onPress={() => setMode('form')}
          />
        </View>
        {mode === 'chat' ? <Chat /> : <Form />}
      </View>
    </KeyboardProvider>
  );
}

function Chat() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <Text key={message} style={[styles.card, styles.text]}>
            {message}
          </Text>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          padding: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <TextInput
          aria-label="Message"
          placeholder="Type a message"
          style={[styles.input, { flex: 1 }]}
        />
        <Button title="Send" onPress={() => Keyboard.dismiss()} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Form() {
  return (
    <KeyboardAwareScrollView
      bottomOffset={24}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      keyboardShouldPersistTaps="handled"
    >
      {fields.map((label) => (
        <TextInput
          key={label}
          aria-label={label}
          placeholder={label}
          submitBehavior="submit"
          style={styles.input}
        />
      ))}
    </KeyboardAwareScrollView>
  );
}
