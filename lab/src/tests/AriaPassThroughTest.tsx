import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { styles } from '../ui';

// Each pair: the aria-* prop and its accessibility* counterpart as the control.
// Switch, ActivityIndicator and ScrollView pass props to the native side as
// they are, and the native side reads only accessibility*. Touchable* copy a
// fixed list of props to their View, and role is not on it

function Pair({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.muted}>{title}</Text>
      <View style={[styles.row, { alignItems: 'center', gap: 24 }]}>
        {children}
      </View>
    </View>
  );
}

function Strip({ label }: { label: string }) {
  return (
    <Text style={[styles.text, styles.card, { marginRight: 8 }]}>{label}</Text>
  );
}

export function AriaPassThroughTest() {
  const [values, setValues] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    return {
      value: values[id] ?? false,
      onValueChange: (value: boolean) =>
        setValues((current) => ({ ...current, [id]: value })),
    };
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pair title="1. Switch: A aria-label, B accessibilityLabel">
        <Switch aria-label="Wi-Fi A" {...toggle('a')} />
        <Switch accessibilityLabel="Bluetooth B" {...toggle('b')} />
      </Pair>

      <Pair title="2. Switch hidden: C aria-hidden, D accessibilityElementsHidden and importantForAccessibility">
        <Switch aria-hidden {...toggle('c')} />
        <Switch
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          {...toggle('d')}
        />
      </Pair>

      <Pair title="3. ActivityIndicator: E aria-label, F accessibilityLabel">
        <ActivityIndicator aria-label="Loading orders E" />
        <ActivityIndicator accessibilityLabel="Loading payments F" />
      </Pair>

      <Pair title="4. ActivityIndicator hidden: G aria-hidden, H accessibilityElementsHidden and importantForAccessibility">
        <ActivityIndicator aria-hidden />
        <ActivityIndicator
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </Pair>

      <View style={{ gap: 8 }}>
        <Text style={styles.muted}>
          5. Horizontal ScrollView: I aria-label and aria-hidden, J
          accessibilityLabel and hidden with accessibility* props
        </Text>
        <ScrollView horizontal aria-label="Photos I" aria-hidden>
          <Strip label="Hidden item I1" />
          <Strip label="Hidden item I2" />
        </ScrollView>
        <ScrollView
          horizontal
          accessibilityLabel="Videos J"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Strip label="Hidden item J1" />
          <Strip label="Hidden item J2" />
        </ScrollView>
        <ScrollView horizontal aria-label="Music K">
          <Strip label="Visible item K1" />
          <Strip label="Visible item K2" />
        </ScrollView>
      </View>

      <View style={{ gap: 4 }}>
        <Text style={styles.muted}>
          6. TextInput aria-labelledby: L one id, M two ids separated by a space
          (as on the web)
        </Text>
        <Text nativeID="l-label" style={styles.text}>
          City L
        </Text>
        <TextInput aria-labelledby="l-label" style={styles.input} />
        <Text nativeID="m-label" style={styles.text}>
          Street M
        </Text>
        <Text nativeID="m-hint" style={styles.muted}>
          With the house number
        </Text>
        <TextInput aria-labelledby="m-label m-hint" style={styles.input} />
      </View>

      <Pair title="7. TouchableOpacity: N role, O accessibilityRole">
        <TouchableOpacity role="button" onPress={() => {}} style={styles.card}>
          <Text style={styles.text}>Save N</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {}}
          style={styles.card}
        >
          <Text style={styles.text}>Save O</Text>
        </TouchableOpacity>
      </Pair>

      <Pair title="8. TouchableWithoutFeedback: P aria-label, Q accessibilityLabel">
        <TouchableWithoutFeedback aria-label="Close P" onPress={() => {}}>
          <View style={styles.card}>
            <Text style={styles.text}>×</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          accessibilityLabel="Close Q"
          onPress={() => {}}
        >
          <View style={styles.card}>
            <Text style={styles.text}>×</Text>
          </View>
        </TouchableWithoutFeedback>
      </Pair>

      <Pair title="9. TouchableHighlight: R aria-checked, S accessibilityState">
        <TouchableHighlight
          role="checkbox"
          accessibilityRole="checkbox"
          aria-checked
          onPress={() => {}}
          style={styles.card}
        >
          <Text style={styles.text}>Terms R</Text>
        </TouchableHighlight>
        <TouchableHighlight
          accessibilityRole="checkbox"
          accessibilityState={{ checked: true }}
          onPress={() => {}}
          style={styles.card}
        >
          <Text style={styles.text}>Terms S</Text>
        </TouchableHighlight>
      </Pair>
    </ScrollView>
  );
}
