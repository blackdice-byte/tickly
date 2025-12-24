import { AddTodoInput } from "@/components/add-todo-input";
import { SortPicker } from "@/components/sort-picker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TodoItem } from "@/components/todo-item";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTodoStore } from "@/store/todo-store";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getTodosByProject,
    getProjectById,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoPriority,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    toggleTag,
    tags,
    sortOption,
    setSortOption,
    getTagById,
  } = useTodoStore();
  const bg = useThemeColor({}, "background");

  const project = getProjectById(id);
  const todos = getTodosByProject(id);
  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  if (!project) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <ThemedText>Project not found</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: project.name, headerShown: true }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: bg }]}
        edges={["bottom"]}
      >
        <ThemedView style={styles.header}>
          <View style={[styles.colorDot, { backgroundColor: project.color }]} />
          <ThemedText style={styles.subtitle}>
            {pendingTodos.length} pending, {completedTodos.length} completed
          </ThemedText>
        </ThemedView>

        <AddTodoInput onAdd={(title) => addTodo(title, id)} />
        <SortPicker value={sortOption} onChange={setSortOption} />

        <FlatList
          data={[...pendingTodos, ...completedTodos]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              title={item.title}
              completed={item.completed}
              priority={item.priority}
              subtasks={item.subtasks}
              tags={
                item.tagIds.map((tid) => getTagById(tid)).filter(Boolean) as any
              }
              tagIds={item.tagIds}
              allTags={tags}
              onToggle={() => toggleTodo(item.id)}
              onDelete={() => deleteTodo(item.id)}
              onPriorityChange={(p) => updateTodoPriority(item.id, p)}
              onAddSubtask={(title) => addSubtask(item.id, title)}
              onToggleSubtask={(subId) => toggleSubtask(item.id, subId)}
              onDeleteSubtask={(subId) => deleteSubtask(item.id, subId)}
              onToggleTag={(tagId) => toggleTag(item.id, tagId)}
            />
          )}
          ListEmptyComponent={
            <ThemedView style={styles.empty}>
              <ThemedText style={styles.emptyText}>
                No tasks in this project
              </ThemedText>
            </ThemedView>
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  subtitle: { opacity: 0.6 },
  empty: { padding: 32, alignItems: "center" },
  emptyText: { opacity: 0.5 },
});
