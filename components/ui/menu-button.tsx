import { View } from 'react-native';
import { useTheme } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

// components
import { Button } from 'heroui-native';

interface MenuButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  startIcon?: keyof typeof Feather.glyphMap;
  iconSize?: number;
  className?: string;
  isDisabled?: boolean;
}

export const MenuButton = ({
  label,
  onPress,
  variant = 'ghost',
  startIcon,
  iconSize = 20,
  className = '',
  isDisabled = false,
}: MenuButtonProps) => {
  const { colors } = useTheme();

  return (
    <Button
      variant={variant}
      className={`flex-row justify-between ${className}`}
      onPress={onPress}
      isDisabled={isDisabled}
    >
      <View className='flex-row items-center gap-4'>
        {startIcon && (
          <Feather name={startIcon} size={iconSize} color={colors.accent} />
        )}

        <Button.Label>{label}</Button.Label>
      </View>

      <Feather name='chevron-right' size={iconSize} color={colors.accent} />
    </Button>
  );
};
