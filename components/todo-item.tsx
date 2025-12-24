import { useThemeColor } from '@/hooks/use-theme-color';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface TodoItemProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ title, completed, onToggle, onDelete }: TodoItemProps) {
  const tint = useThemeColor({}, 'tint');
  const icon = useThemeColor({}, 'icon');

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={onToggle} style={styles.checkbox}>
        <MaterialIcons
          name={completed ? 'check-circle' : 'radio-button-unchecked'}
          size={24}
          color={completed ? tint : icon}
        />
      </Pressable>
      <ThemedText style={[styles.title, completed && styles.completed]}>{title}</ThemedText>
      <Pressable onPress={onDelete} style={styles.deleteBtn}>
        <MaterialIcons name="close" size={20} color={icon} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  checkbox: { marginRight: 12 },
  title: { flex: 1, fontSize: 16 },
  completed: { textDecorationLine: 'line-through', opacity: 0.5 },
  deleteBtn: { padding: 4 },
});
