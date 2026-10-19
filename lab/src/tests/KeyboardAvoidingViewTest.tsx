import { useHeaderHeight } from '@react-navigation/elements';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { session } from '../session';
import { Button, colors, styles } from '../ui';

type Behavior = 'none' | 'padding' | 'height';

const behaviors: Behavior[] = ['none', 'padding', 'height'];
const messages = Array.from(
  { length: 20 },
  (_, index) => `Message ${index + 1}`
);

export function KeyboardAvoidingViewTest() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [behavior, setBehavior] = useState<Behavior>(
    Platform.OS === 'ios' ? 'padding' : 'none'
  );
  const [withOffset, setWithOffset] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    // Android has only the Did events
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (event) =>
      setKeyboardHeight(Math.round(event.endCoordinates.height))
    );
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <View
      style={styles.screen}
      onLayout={(event) =>
        setScreenHeight(Math.round(event.nativeEvent.layout.height))
      }
    >
      <View style={[styles.content, { paddingBottom: 8 }]}>
        {session.keyboardControllerMounted && (
          <Text style={[styles.text, { color: colors.fail }]}>
            KeyboardProvider was mounted in this launch: close the app and open
            it again for a valid result.
          </Text>
        )}
        <View style={styles.row}>
          {behaviors.map((value) => (
            <Button
              key={value}
              title={value}
              selected={behavior === value}
              onPress={() => setBehavior(value)}
            />
          ))}
        </View>
        <View style={styles.row}>
          <Button
            title={`offset: ${withOffset ? 'header' : '0'}`}
            onPress={() => setWithOffset(!withOffset)}
          />
        </View>
        <Text style={styles.muted}>
          Screen view {screenHeight} · keyboard {keyboardHeight} · header{' '}
          {Math.round(headerHeight)}
        </Text>
      </View>

      <KeyboardAvoidingView
        // Remount on change, so no state from the previous behavior is left
        key={`${behavior}-${withOffset}`}
        style={{ flex: 1 }}
        behavior={behavior === 'none' ? undefined : behavior}
        keyboardVerticalOffset={withOffset ? headerHeight : 0}
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
            // The home indicator / navigation bar inset only while the keyboard is closed
            paddingBottom: keyboardHeight > 0 ? 8 : Math.max(insets.bottom, 8),
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
    </View>
  );
}
