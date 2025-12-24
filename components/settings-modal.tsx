import { useThemeColor } from '@/hooks/use-theme-color';
import { useSettingsStore } from '@/store/settings-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const THEME_OPTIONS = [
  { value: 'system', label: 'System', icon: 'settings-brightness' },
  { value: 'light', label: 'Light', icon: 'light-mode' },
  { value: 'dark', label: 'Dark', icon: 'dark-mode' },
] as const;

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { themeMode, setThemeMode } = useSettingsStore();
  const bg = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  const icon = useThemeColor({}, 'icon');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.modal, { backgroundColor: bg }]} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Settings</ThemedText>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} color={icon} />
            </Pressable>
          </View>

          <ThemedText style={styles.sectionTitle}>Theme</ThemedText>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[styles.themeOption, themeMode === option.value && { borderColor: tint }]}
                onPress={() => setThemeMode(option.value)}
              >
                <MaterialIcons
                  name={option.icon as any}
                  size={24}
                  color={themeMode === option.value ? tint : icon}
                />
                <ThemedText style={[styles.optionLabel, themeMode === option.value && { color: tint }]}>
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <View style={styles.divider} />
          <ThemedText style={styles.version}>Tickly v1.0.0</ThemedText>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 12,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  optionLabel: {
    fontSize: 12,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.2)',
    marginVertical: 16,
  },
  version: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
});
