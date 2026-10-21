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
  const [textAriaLive, setTextAriaLive] = useState(0);
  const [textLiveRegion, setTextLiveRegion] = useState(0);
  const [viewAriaLive, setViewAriaLive] = useState(0);
  const [viewNotCollapsable, setViewNotCollapsable] = useState(0);
  const [cart, setCart] = useState(['Mug', 'Teapot']);
  const [lastActivated, setLastActivated] = useState('nothing');

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
          title="Announce in 2 s"
          onPress={() =>
            // Lets TalkBack finish the activation feedback first
            setTimeout(
              () =>
                AccessibilityInfo.announceForAccessibility(
                  'Item added to the cart'
                ),
              2000
            )
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
      </View>

      <Text role="heading" style={styles.sectionTitle}>
        Live regions
      </Text>
      <Text style={styles.muted}>
        Each button changes its own counter. Activate one, then wait.
      </Text>
      <View style={styles.row}>
        <Button
          title="A: Text aria-live"
          onPress={() => setTextAriaLive((value) => value + 1)}
        />
        <Button
          title="B: Text accessibilityLiveRegion"
          onPress={() => setTextLiveRegion((value) => value + 1)}
        />
        <Button
          title="C: View aria-live"
          onPress={() => setViewAriaLive((value) => value + 1)}
        />
        <Button
          title="D: View aria-live, collapsable false"
          onPress={() => setViewNotCollapsable((value) => value + 1)}
        />
      </View>
      <Text aria-live="polite" style={styles.text}>
        Cart A: {textAriaLive} items
      </Text>
      <Text accessibilityLiveRegion="polite" style={styles.text}>
        Cart B: {textLiveRegion} items
      </Text>
      <View aria-live="polite">
        <Text style={styles.text}>Cart C: {viewAriaLive} items</Text>
      </View>
      {/* Without collapsable={false} Fabric may flatten a View that has no
          style, and the live region goes with it */}
      <View aria-live="polite" collapsable={false}>
        <Text style={styles.text}>Cart D: {viewNotCollapsable} items</Text>
      </View>

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
          // Activating the row only shows it here: removing is the custom action
          onPress={() => setLastActivated(title)}
          accessibilityActions={[{ name: 'delete', label: 'Remove from cart' }]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'delete') remove(title);
          }}
          style={styles.card}
        >
          <Text style={styles.text}>{title}</Text>
        </Pressable>
      ))}
      <Text style={styles.muted}>Last activated: {lastActivated}</Text>
      <Button
        title="Reset the cart"
        onPress={() => setCart(['Mug', 'Teapot'])}
      />
    </ScrollView>
  );
}
