import { useThemeColor } from '@/hooks/use-theme-color';
import { SortOption } from '@/store/todo-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface SortPickerProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'created', label: 'Date', icon: 'schedule' },
  { value: 'priority', label: 'Priority', icon: 'flag' },
  { value: 'alphabetical', label: 'A-Z', icon: 'sort-by-alpha' },
];

export function SortPicker({ value, onChange }: SortPickerProps) {
  const tint = useThemeColor({}, 'tint');
  const icon = useThemeColor({}, 'icon');

  return (
    <View style={styles.container}>
      <MaterialIcons name="sort" size={16} color={icon} />
      {OPTIONS.map((opt) => (
        <Pressable
          key={opt.value}
          style={[styles.option, value === opt.value && { backgroundColor: tint + '20' }]}
          onPress={() => onChange(opt.value)}
        >
          <MaterialIcons name={opt.icon as any} size={14} color={value === opt.value ? tint : icon} />
          <ThemedText style={[styles.label, value === opt.value && { color: tint }]}>{opt.label}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  label: { fontSize: 12 },
});
