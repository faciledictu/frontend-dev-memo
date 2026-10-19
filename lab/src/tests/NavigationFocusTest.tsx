import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useRef, type ComponentRef } from 'react';
import { AccessibilityInfo, ScrollView, Text, View } from 'react-native';

import type { ScreenProps } from '../navigation';
import { Button, styles } from '../ui';

export function NavigationFocusTest() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text role="heading" style={styles.sectionTitle}>
        Orders
      </Text>
      <Text style={styles.text}>
        Order #1042, 3 items, delivered yesterday.
      </Text>
      <View style={styles.row}>
        <Button
          title="Open details (no focus management)"
          onPress={() =>
            navigation.navigate('NavigationDetails', { manageFocus: false })
          }
        />
        <Button
          title="Open details (focus the title)"
          onPress={() =>
            navigation.navigate('NavigationDetails', { manageFocus: true })
          }
        />
      </View>
      <Text style={styles.text}>A paragraph after the buttons.</Text>
    </ScrollView>
  );
}

export function NavigationDetailsScreen({
  route,
}: ScreenProps<'NavigationDetails'>) {
  const { manageFocus } = route.params;
  const titleRef = useRef<ComponentRef<typeof Text>>(null);

  useFocusEffect(
    useCallback(() => {
      if (!manageFocus) return;
      // After the push animation, or the screen reader moves focus again
      const timer = setTimeout(() => {
        if (titleRef.current)
          AccessibilityInfo.sendAccessibilityEvent(titleRef.current, 'focus');
      }, 500);
      return () => clearTimeout(timer);
    }, [manageFocus])
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.muted}>
        {manageFocus ? 'Focus moved to the title' : 'No focus management'}
      </Text>
      <Text ref={titleRef} role="heading" style={styles.sectionTitle}>
        Order #1042
      </Text>
      <Text style={styles.text}>Mug, 12 euros.</Text>
      <Text style={styles.text}>Teapot, 30 euros.</Text>
      <Text style={styles.text}>Spoons, 8 euros.</Text>
    </ScrollView>
  );
}
