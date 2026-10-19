import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const colors = {
  text: '#111',
  muted: '#555',
  border: '#ccc',
  surface: '#f2f2f2',
  accent: '#0b57d0',
  pass: '#1e7d32',
  fail: '#b3261e',
  unclear: '#8a6d00',
};

type ButtonProps = {
  title: string;
  onPress: () => void;
  selected?: boolean;
  accessibilityHint?: string;
};

export function Button({
  title,
  onPress,
  selected,
  accessibilityHint,
}: ButtonProps) {
  return (
    <Pressable
      role="button"
      aria-selected={selected}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected && styles.buttonSelected,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, selected && styles.buttonTextSelected]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text role="heading" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <View style={styles.bullets}>
      {items.map((item, index) => (
        <Text key={index} style={styles.bullet}>
          {'• '}
          {item}
        </Text>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, gap: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  text: { fontSize: 16, color: colors.text },
  muted: { fontSize: 14, color: colors.muted },
  button: {
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: '#fff',
  },
  buttonSelected: { backgroundColor: colors.accent },
  buttonPressed: { opacity: 0.6 },
  buttonText: { fontSize: 16, color: colors.accent },
  buttonTextSelected: { color: '#fff' },
  section: { gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  bullets: { gap: 6 },
  bullet: { fontSize: 15, lineHeight: 21, color: colors.text },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fff',
  },
  card: {
    padding: 16,
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
});
