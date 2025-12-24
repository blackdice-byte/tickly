import { AddTodoInput } from "@/components/add-todo-input";
import { ProjectItem } from "@/components/project-item";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTodoStore } from "@/store/todo-store";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProjectsScreen() {
  const { projects, addProject, deleteProject, getTodosByProject } =
    useTodoStore();
  const bg = useThemeColor({}, "background");
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">Tickly Projects</ThemedText>
        <ThemedText style={styles.subtitle}>
          {projects.length} projects
        </ThemedText>
      </ThemedView>

      <AddTodoInput onAdd={addProject} placeholder="Add a project..." />

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectItem
            name={item.name}
            color={item.color}
            taskCount={
              getTodosByProject(item.id).filter((t) => !t.completed).length
            }
            onPress={() => router.push(`/project/${item.id}` as any)}
            onDelete={
              item.id !== "inbox" ? () => deleteProject(item.id) : undefined
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16 },
  subtitle: { opacity: 0.6, marginTop: 4 },
});
