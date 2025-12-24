import { AddTodoInput } from '@/components/add-todo-input';
import { SettingsModal } from '@/components/settings-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TodoItem } from '@/components/todo-item';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodoStore } from '@/store/todo-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TasksScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { todos, toggleTodo, deleteTodo, addTodo } = useTodoStore();
  const bg = useThemeColor({}, 'background');
  const icon = useThemeColor({}, 'icon');

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <ThemedView style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText type="title">Tickly</ThemedText>
          <Pressable onPress={() => setSettingsVisible(true)} style={styles.settingsBtn}>
            <MaterialIcons name="settings" size={24} color={icon} />
          </Pressable>
        </View>
        <ThemedText style={styles.subtitle}>
          {pendingTodos.length} pending, {completedTodos.length} completed
        </ThemedText>
      </ThemedView>

      <AddTodoInput onAdd={(title) => addTodo(title)} />

      <FlatList
        data={[...pendingTodos, ...completedTodos]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            title={item.title}
            completed={item.completed}
            onToggle={() => toggleTodo(item.id)}
            onDelete={() => deleteTodo(item.id)}
          />
        )}
        ListEmptyComponent={
          <ThemedView style={styles.empty}>
            <ThemedText style={styles.emptyText}>No tasks yet. Add one above!</ThemedText>
          </ThemedView>
        }
      />

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingsBtn: { padding: 4 },
  subtitle: { opacity: 0.6, marginTop: 4 },
  empty: { padding: 32, alignItems: 'center' },
  emptyText: { opacity: 0.5 },
});
