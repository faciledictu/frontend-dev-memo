import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  AccessibilityInfo,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button, styles } from '../ui';

type Variant =
  | 'modal'
  | 'modal-transparent'
  | 'overlay'
  | 'overlay-aria-modal'
  | 'overlay-view-is-modal'
  | 'overlay-hide-background';

const variants: { value: Variant; title: string }[] = [
  { value: 'modal', title: 'Modal' },
  { value: 'modal-transparent', title: 'Modal, transparent' },
  { value: 'overlay', title: 'Overlay, no hiding' },
  { value: 'overlay-aria-modal', title: 'Overlay, aria-modal' },
  {
    value: 'overlay-view-is-modal',
    title: 'Overlay, accessibilityViewIsModal',
  },
  {
    value: 'overlay-hide-background',
    title: 'Overlay, background aria-hidden',
  },
];

export function ModalTest() {
  const [open, setOpen] = useState<Variant | null>(null);
  const [lastActivated, setLastActivated] = useState('nothing');
  const isOverlay = open?.startsWith('overlay') ?? false;
  const isModal = open?.startsWith('modal') ?? false;
  const title = variants.find((item) => item.value === open)?.title ?? '';

  return (
    <View style={styles.screen}>
      {/* The background and the overlay are siblings, as aria-modal requires */}
      <View
        style={{ flex: 1 }}
        aria-hidden={open === 'overlay-hide-background'}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.text}>Open a dialog:</Text>
          <View style={styles.row}>
            {variants.map((item) => (
              <Button
                key={item.value}
                title={item.title}
                onPress={() => setOpen(item.value)}
              />
            ))}
          </View>
          <Text role="heading" style={styles.sectionTitle}>
            Background
          </Text>
          {[1, 2, 3].map((index) => (
            <Button
              key={index}
              title={`Background item ${index}`}
              onPress={() => setLastActivated(`Background item ${index}`)}
            />
          ))}
          <Text style={styles.muted}>Last activated: {lastActivated}</Text>
        </ScrollView>
      </View>

      {isOverlay && (
        <View
          style={[StyleSheet.absoluteFill, local.backdrop]}
          aria-modal={open === 'overlay-aria-modal'}
          // In React Native 0.88 View does not map aria-modal to this prop
          accessibilityViewIsModal={open === 'overlay-view-is-modal'}
        >
          <Dialog title={title} moveFocus onClose={() => setOpen(null)} />
        </View>
      )}

      <Modal
        visible={isModal}
        transparent={open === 'modal-transparent'}
        animationType="fade"
        onRequestClose={() => setOpen(null)}
      >
        <View
          style={[
            local.modalRoot,
            open === 'modal-transparent' && local.backdrop,
          ]}
        >
          <Dialog title={title} onClose={() => setOpen(null)} />
        </View>
      </Modal>
    </View>
  );
}

function Dialog({
  title,
  moveFocus = false,
  onClose,
}: {
  title: string;
  moveFocus?: boolean;
  onClose: () => void;
}) {
  const titleRef = useRef<ComponentRef<typeof Text>>(null);

  useEffect(() => {
    // A custom overlay gets no focus on its own: the page says to move it in
    if (!moveFocus) return;
    const timer = setTimeout(() => {
      if (titleRef.current)
        AccessibilityInfo.sendAccessibilityEvent(titleRef.current, 'focus');
    }, 300);
    return () => clearTimeout(timer);
  }, [moveFocus]);

  return (
    <View style={[styles.card, local.dialog]}>
      <Text ref={titleRef} role="heading" style={styles.sectionTitle}>
        {title}
      </Text>
      <Text style={styles.text}>
        Try to reach a background item by swiping and by touch.
      </Text>
      <Button title="Close" onPress={onClose} />
    </View>
  );
}

const local = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  dialog: {
    marginHorizontal: 24,
    marginTop: 'auto',
    marginBottom: 'auto',
    backgroundColor: '#fff',
  },
});
