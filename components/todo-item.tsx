import { useThemeColor } from '@/hooks/use-theme-color';
import { Priority, Subtask, Tag } from '@/store/todo-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const PRIORITY_COLORS: Record<Priority, string> = {
  none: 'transparent',
  low: '#3498db',
  medium: '#f39c12',
  high: '#e74c3c',
};

interface TodoItemProps {
  title: string;
  completed: boolean;
  priority: Priority;
  subtasks: Subtask[];
  tags: Tag[];
  onToggle: () => void;
  onDelete: () => void;
  onPriorityChange: (p: Priority) => void;
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (id: string) => void;
  onDeleteSubtask: (id: string) => void;
  allTags: Tag[];
  onToggleTag: (tagId: string) => void;
  tagIds: string[];
}

export function TodoItem({
  title, completed, priority, subtasks, tags, onToggle, onDelete,
  onPriorityChange, onAddSubtask, onToggleSubtask, onDeleteSubtask,
  allTags, onToggleTag, tagIds,
}: TodoItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const tint = useThemeColor({}, 'tint');
  const icon = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask.trim());
      setNewSubtask('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Pressable style={styles.mainRow} onPress={() => setExpanded(!expanded)}>
        <View style={[styles.priorityBar, { backgroundColor: PRIORITY_COLORS[priority] }]} />
        <Pressable onPress={onToggle} style={styles.checkbox}>
          <MaterialIcons
            name={completed ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={completed ? tint : icon}
          />
        </Pressable>
        <View style={styles.content}>
          <ThemedText style={[styles.title, completed && styles.completed]}>{title}</ThemedText>
          {tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <View key={tag.id} style={[styles.tagBadge, { backgroundColor: tag.color + '30' }]}>
                  <ThemedText style={[styles.tagText, { color: tag.color }]}>{tag.name}</ThemedText>
                </View>
              ))}
            </View>
          )}
          {subtasks.length > 0 && (
            <ThemedText style={styles.subtaskCount}>{completedSubtasks}/{subtasks.length} subtasks</ThemedText>
          )}
        </View>
        <MaterialIcons name={expanded ? 'expand-less' : 'expand-more'} size={24} color={icon} />
        <Pressable onPress={onDelete} style={styles.deleteBtn}>
          <MaterialIcons name="close" size={20} color={icon} />
        </Pressable>
      </Pressable>

      {expanded && (
        <View style={styles.expandedSection}>
          <ThemedText style={styles.sectionLabel}>Priority</ThemedText>
          <View style={styles.priorityRow}>
            {(['none', 'low', 'medium', 'high'] as Priority[]).map((p) => (
              <Pressable
                key={p}
                style={[styles.priorityBtn, priority === p && { borderColor: tint }]}
                onPress={() => onPriorityChange(p)}
              >
                <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[p] || icon }]} />
                <ThemedText style={styles.priorityText}>{p}</ThemedText>
              </Pressable>
            ))}
          </View>

          <ThemedText style={styles.sectionLabel}>Tags</ThemedText>
          <View style={styles.tagsSelector}>
            {allTags.map((tag) => (
              <Pressable
                key={tag.id}
                style={[styles.tagOption, tagIds.includes(tag.id) && { borderColor: tag.color }]}
                onPress={() => onToggleTag(tag.id)}
              >
                <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                <ThemedText style={styles.tagOptionText}>{tag.name}</ThemedText>
              </Pressable>
            ))}
          </View>

          <ThemedText style={styles.sectionLabel}>Subtasks</ThemedText>
          {subtasks.map((sub) => (
            <View key={sub.id} style={styles.subtaskRow}>
              <Pressable onPress={() => onToggleSubtask(sub.id)}>
                <MaterialIcons
                  name={sub.completed ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  color={sub.completed ? tint : icon}
                />
              </Pressable>
              <ThemedText style={[styles.subtaskTitle, sub.completed && styles.completed]}>{sub.title}</ThemedText>
              <Pressable onPress={() => onDeleteSubtask(sub.id)}>
                <MaterialIcons name="close" size={18} color={icon} />
              </Pressable>
            </View>
          ))}
          <View style={styles.addSubtaskRow}>
            <TextInput
              style={[styles.subtaskInput, { color: textColor, borderColor: icon }]}
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder="Add subtask..."
              placeholderTextColor="#999"
              onSubmitEditing={handleAddSubtask}
            />
            <Pressable onPress={handleAddSubtask} style={[styles.addSubBtn, { backgroundColor: tint }]}>
              <MaterialIcons name="add" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' },
  mainRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingRight: 12 },
  priorityBar: { width: 4, alignSelf: 'stretch', borderRadius: 2, marginRight: 8 },
  checkbox: { marginRight: 12, marginLeft: 8 },
  content: { flex: 1 },
  title: { fontSize: 16 },
  completed: { textDecorationLine: 'line-through', opacity: 0.5 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  tagBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 10, fontWeight: '600' },
  subtaskCount: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  deleteBtn: { padding: 4, marginLeft: 4 },
  expandedSection: { paddingHorizontal: 16, paddingBottom: 12 },
  sectionLabel: { fontSize: 12, opacity: 0.6, marginTop: 12, marginBottom: 6 },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: 'transparent', backgroundColor: 'rgba(128,128,128,0.1)' },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  priorityText: { fontSize: 12, textTransform: 'capitalize' },
  tagsSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: 'transparent', backgroundColor: 'rgba(128,128,128,0.1)' },
  tagDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  tagOptionText: { fontSize: 12 },
  subtaskRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  subtaskTitle: { flex: 1, fontSize: 14 },
  addSubtaskRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  subtaskInput: { flex: 1, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, fontSize: 14 },
  addSubBtn: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
});
