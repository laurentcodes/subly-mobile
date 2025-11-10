import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

// components
import { Button } from 'heroui-native';

interface BackHeaderProps {
  title: string;
  isDisabled?: boolean;
  onBack?: () => void;
}

export function Header({ title, onBack }: BackHeaderProps) {
  const router = useRouter();

  const { colors } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className='flex-row items-center'>
      <Button variant='ghost' size='sm' isIconOnly onPress={handleBack}>
        <Feather name='chevron-left' size={24} color={colors.accent} />
      </Button>

      <Text className='text-accent font-bold text-2xl'>{title}</Text>
    </View>
  );
}
