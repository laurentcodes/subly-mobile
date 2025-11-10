import { useTheme } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';

// context
import { useAppTheme } from '../contexts/app-theme-context';

// themes
import type { ThemeId } from '../themes/pastel-themes';
import { pastelThemes } from '../themes/pastel-themes';

interface ThemeSelectorProps {
  themeId: ThemeId;
  themeName: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  isActive: boolean;
  onPress: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themeId,
  themeName,
  colors,
  isActive,
  onPress,
}) => {
  const { isDark } = useTheme();

  const selectedTheme = pastelThemes.find((t) => t.id === themeId)?.config;

  const themeColors = isDark
    ? selectedTheme?.dark?.colors
    : selectedTheme?.light?.colors;

  return (
    <Pressable
      onPress={onPress}
      className='flex-row items-center justify-between p-4 mb-2 rounded-xl'
      style={{
        backgroundColor: isActive
          ? themeColors?.surface2
          : themeColors?.surface1,
        borderWidth: isActive ? 2 : 0,
        borderColor: isActive ? themeColors?.accent : 'transparent',
      }}
    >
      <Text
        className='text-lg font-semibold'
        style={{ color: themeColors?.foreground }}
      >
        {themeName}
      </Text>

      <View className='flex-row items-center gap-2'>
        <View
          className='w-8 h-8 rounded-full'
          style={{ backgroundColor: colors.primary }}
        />

        <View
          className='w-8 h-8 rounded-full'
          style={{ backgroundColor: colors.secondary }}
        />

        <View
          className='w-8 h-8 rounded-full'
          style={{ backgroundColor: colors.tertiary }}
        />
      </View>
    </Pressable>
  );
};

export const ThemeSelectorBar: React.FC = () => {
  const { currentThemeId, setThemeById, availableThemes } = useAppTheme();

  // define colors for each theme's swatches
  const themeColors = {
    default: {
      primary: 'hsl(260 75% 60%)',
      secondary: 'hsl(140 60% 50%)',
      tertiary: 'hsl(35 85% 55%)',
    },
    lavender: {
      primary: 'hsl(270 50% 75%)',
      secondary: 'hsl(160 40% 70%)',
      tertiary: 'hsl(45 55% 75%)',
    },
    mint: {
      primary: 'hsl(165 45% 70%)',
      secondary: 'hsl(145 50% 68%)',
      tertiary: 'hsl(55 60% 75%)',
    },
    sky: {
      primary: 'hsl(200 50% 72%)',
      secondary: 'hsl(175 45% 70%)',
      tertiary: 'hsl(48 58% 75%)',
    },
  };

  return (
    <View className='py-4 gap-3'>
      {availableThemes.map((theme) => (
        <ThemeSelector
          key={theme.id}
          themeId={theme.id}
          themeName={theme.name}
          colors={themeColors[theme.id as keyof typeof themeColors]}
          isActive={currentThemeId === theme.id}
          onPress={() => setThemeById(theme.id)}
        />
      ))}
    </View>
  );
};
