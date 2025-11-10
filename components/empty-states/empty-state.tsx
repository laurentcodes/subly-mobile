import { View, Text } from 'react-native';
import { Button, useTheme } from 'heroui-native';
import { Feather } from '@expo/vector-icons';

interface EmptyStateProps {
  onAddPress: () => void;
}

export const EmptyState = ({ onAddPress }: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View className='items-center justify-center py-12 px-4'>
      {/* icon illustration */}
      <View className='mb-8 items-center'>
        <View
          className='bg-primary/10 rounded-full p-8 mb-4'
          style={{
            width: 120,
            height: 120,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name='inbox' size={56} color={colors.accent} />
        </View>
      </View>

      {/* messaging */}
      <Text className='text-foreground font-bold text-2xl text-center mb-3'>
        No Subscriptions Yet
      </Text>

      <Text className='text-foreground/60 text-center text-base mb-8 leading-6 max-w-[280px]'>
        Start tracking your subscriptions to take control of your recurring
        expenses
      </Text>

      {/* cta button */}
      <Button
        variant='primary'
        onPress={onAddPress}
        className='min-w-[200px] shadow-lg'
      >
        <Feather name='plus' size={20} color={colors.background} />

        <Button.Label className='text-background'>
          Add Subscription
        </Button.Label>
      </Button>

      {/* optional feature hints */}
      <View className='mt-12 space-y-4 w-full max-w-[300px] gap-3'>
        <View className='flex-row items-center'>
          <View className='bg-accent/10 rounded-full p-2 mr-3'>
            <Feather name='bell' size={16} color={colors.accent} />
          </View>

          <Text className='text-foreground/70 text-sm flex-1'>
            Get reminders before renewal dates
          </Text>
        </View>

        <View className='flex-row items-center'>
          <View className='bg-accent/10 rounded-full p-2 mr-3'>
            <Feather name='bar-chart-2' size={16} color={colors.accent} />
          </View>

          <Text className='text-foreground/70 text-sm flex-1'>
            Track spending across all services
          </Text>
        </View>

        <View className='flex-row items-center'>
          <View className='bg-accent/10 rounded-full p-2 mr-3'>
            <Feather name='dollar-sign' size={16} color={colors.accent} />
          </View>

          <Text className='text-foreground/70 text-sm flex-1'>
            Never miss a payment again
          </Text>
        </View>
      </View>
    </View>
  );
};
