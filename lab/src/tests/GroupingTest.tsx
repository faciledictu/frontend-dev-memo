import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { Button, colors, styles } from '../ui';

export function GroupingTest() {
  const [lastActivated, setLastActivated] = useState('nothing');

  function cardContent(card: string) {
    return (
      <>
        <Text style={styles.text}>Rating 4.5</Text>
        <Text style={styles.text}>120 reviews</Text>
        <View style={styles.row}>
          <Button
            title="Like"
            onPress={() => setLastActivated(`${card}: Like`)}
          />
          <Button
            title="Share"
            onPress={() => setLastActivated(`${card}: Share`)}
          />
        </View>
      </>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text role="heading" style={styles.sectionTitle}>
        Card 1: View with accessible
      </Text>
      <View accessible style={styles.card}>
        {cardContent('Card 1')}
      </View>

      <Text role="heading" style={styles.sectionTitle}>
        Card 2: plain View
      </Text>
      <View style={styles.card}>{cardContent('Card 2')}</View>

      <Text role="heading" style={styles.sectionTitle}>
        Card 3: Pressable
      </Text>
      <Pressable
        role="button"
        onPress={() => setLastActivated('Card 3')}
        style={[
          styles.card,
          { flexDirection: 'row', alignItems: 'center', gap: 12 },
        ]}
      >
        {/* No alt: the image is not an accessibility element */}
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 64, height: 64 }}
        />
        <View>
          <Text style={styles.text}>Blue mug</Text>
          <Text style={styles.text}>12 euros</Text>
        </View>
      </Pressable>

      <Text
        onPress={() => setLastActivated('Terms of service')}
        style={[
          styles.text,
          { color: colors.accent, textDecorationLine: 'underline' },
        ]}
      >
        Terms of service
      </Text>

      <Text style={styles.muted}>Last activated: {lastActivated}</Text>
    </ScrollView>
  );
}
