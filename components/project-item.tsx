import { useThemeColor } from '@/hooks/use-theme-color';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface ProjectItemProps {
  name: string;
  color: string;
  taskCount: number;
  onPress: () => void;
  onDelete?: () => void;
}

export function ProjectItem({ name, color, taskCount, onPress, onDelete }: ProjectItemProps) {
  const icon = useThemeColor({}, 'icon');

  return (
    <Pressable onPress={onPress}>
      <ThemedView style={styles.container}>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText style={styles.count}>{taskCount}</ThemedText>
        {onDelete && (
          <Pressable onPress={onDelete} style={styles.deleteBtn}>
            <MaterialIcons name="close" size={20} color={icon} />
          </Pressable>
        )}
        <MaterialIcons name="chevron-right" size={24} color={icon} />
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  name: { flex: 1, fontSize: 16 },
  count: { fontSize: 14, opacity: 0.6, marginRight: 8 },
  deleteBtn: { padding: 4, marginRight: 4 },
});
