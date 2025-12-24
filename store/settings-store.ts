import { useCallback, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'system' | 'light' | 'dark';

let themeMode: ThemeMode = 'system';
let listeners: Set<() => void> = new Set();

const notify = () => listeners.forEach((l) => l());

export function useSettingsStore() {
  const [, forceUpdate] = useState({});
  const systemColorScheme = useSystemColorScheme();

  const subscribe = useCallback(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const effectiveTheme = themeMode === 'system' ? systemColorScheme ?? 'light' : themeMode;

  return {
    themeMode,
    effectiveTheme,
    setThemeMode: (mode: ThemeMode) => {
      themeMode = mode;
      notify();
    },
  };
}
