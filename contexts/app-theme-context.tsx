import type { ThemeConfig } from 'heroui-native';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { pastelThemes, type ThemeId } from '@/themes/pastel-themes';

const THEME_STORAGE_KEY = '@subly/theme-id';

interface AppThemeContextType {
  currentThemeId: ThemeId;
  currentTheme: ThemeConfig | undefined;
  setThemeById: (id: ThemeId) => Promise<void>;
  availableThemes: typeof pastelThemes;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined,
);
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('default');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedThemeId = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (savedThemeId && pastelThemes.some((t) => t.id === savedThemeId)) {
          setCurrentThemeId(savedThemeId as ThemeId);
        }
      } catch (error) {
        console.error('Failed to load theme from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const setThemeById = useCallback(async (id: ThemeId) => {
    try {
      setCurrentThemeId(id);

      await AsyncStorage.setItem(THEME_STORAGE_KEY, id);
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  }, []);

  const currentTheme = useMemo(() => {
    const theme = pastelThemes.find((t) => t.id === currentThemeId);

    return theme?.config;
  }, [currentThemeId]);

  const value = useMemo(
    () => ({
      currentThemeId,
      currentTheme,
      setThemeById,
      availableThemes: pastelThemes,
    }),
    [currentThemeId, currentTheme, setThemeById],
  );

  // don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
};
