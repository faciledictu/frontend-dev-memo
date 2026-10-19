import { useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Button, styles } from '../ui';

export function AnnouncementsTest() {
  const [count, setCount] = useState(0);
  const [cart, setCart] = useState(['Mug', 'Teapot']);

  function remove(title: string) {
    setCart((items) => items.filter((item) => item !== title));
    AccessibilityInfo.announceForAccessibility(`${title} removed`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.row}>
        <Button
          title="Announce"
          onPress={() =>
            AccessibilityInfo.announceForAccessibility('Item added to the cart')
          }
        />
        <Button
          title="Two, second queued"
          onPress={() => {
            AccessibilityInfo.announceForAccessibility(
              'First message, a long sentence that takes a few seconds to read'
            );
            AccessibilityInfo.announceForAccessibilityWithOptions(
              'Second message',
              { queue: true }
            );
          }}
        />
        <Button
          title="Two, not queued"
          onPress={() => {
            AccessibilityInfo.announceForAccessibility(
              'First message, a long sentence that takes a few seconds to read'
            );
            AccessibilityInfo.announceForAccessibility('Second message');
          }}
        />
        <Button
          title="Live region +1"
          onPress={() => setCount((value) => value + 1)}
        />
      </View>

      <Text aria-live="polite" style={styles.text}>
        Cart: {count} items
      </Text>

      <Text role="heading" style={styles.sectionTitle}>
        Custom action
      </Text>
      <Text style={styles.muted}>
        Each row has the action "Remove from cart": the actions rotor on iOS,
        the TalkBack menu on Android.
      </Text>
      {cart.map((title) => (
        <Pressable
          key={title}
          role="button"
          onPress={() => {}}
          accessibilityActions={[{ name: 'delete', label: 'Remove from cart' }]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'delete') remove(title);
          }}
          style={styles.card}
        >
          <Text style={styles.text}>{title}</Text>
        </Pressable>
      ))}
      <Button
        title="Reset the cart"
        onPress={() => setCart(['Mug', 'Teapot'])}
      />
    </ScrollView>
  );
}
