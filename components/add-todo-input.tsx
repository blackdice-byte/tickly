import { useThemeColor } from '@/hooks/use-theme-color';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface AddTodoInputProps {
  onAdd: (title: string) => void;
  placeholder?: string;
}

export function AddTodoInput({ onAdd, placeholder = 'Add a task...' }: AddTodoInputProps) {
  const [text, setText] = useState('');
  const bg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <TextInput
        style={[styles.input, { color: textColor, borderColor: tint }]}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <Pressable onPress={handleSubmit} style={[styles.addBtn, { backgroundColor: tint }]}>
        <MaterialIcons name="add" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
