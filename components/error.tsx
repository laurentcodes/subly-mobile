import { View, Text } from 'react-native';
import { SafeAreaView } from './safe-area';

// components
import { Button, useTheme } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

const ErrorComponent = ({
  message,
  onPress,
}: {
  message: string;
  onPress: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView className='bg-background' contentClassName='h-full px-4'>
      <View className='flex-1 items-center justify-center'>
        <Text className='text-danger font-semibold text-base mb-4'>
          {message || 'An unexpected error occurred.'}
        </Text>

        <Button variant='primary' onPress={onPress} className='w-1/3'>
          <Feather name='refresh-cw' size={14} color={colors.background} />

          <Button.Label>
            <Text className='text-background font-semibold'>Retry</Text>
          </Button.Label>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export { ErrorComponent };
