import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

// components
import { Button } from 'heroui-native';

export const StatisticsEmptyState = () => {
  const { colors } = useTheme();

  const handleAddSubscription = () => {
    router.push('/(general)/add-subscription');
  };

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
          <Feather name='bar-chart-2' size={56} color={colors.accent} />
        </View>
      </View>

      {/* messaging */}
      <Text className='text-foreground font-bold text-2xl text-center mb-3'>
        No Statistics Yet
      </Text>

      <Text className='text-foreground/60 text-center text-base mb-8 leading-6 max-w-[280px]'>
        Add subscriptions to see insights about your spending patterns and
        upcoming payments
      </Text>

      {/* cta button */}
      <Button
        variant='primary'
        onPress={handleAddSubscription}
        className='min-w-[200px] shadow-lg'
      >
        <Feather name='plus' size={20} color={colors.background} />

        <Button.Label className='text-background'>
          Add Subscription
        </Button.Label>
      </Button>

      {/* statistics feature hints */}
      <View className='mt-12 space-y-4 w-full max-w-[300px] gap-3'>
        <View className='flex-row items-center'>
          <View className='bg-accent/10 rounded-full p-2 mr-3'>
            <Feather name='trending-up' size={16} color={colors.accent} />
          </View>

          <Text className='text-foreground/70 text-sm flex-1'>
            View spending trends over time
          </Text>
        </View>

        <View className='flex-row items-center'>
          <View className='bg-accent/10 rounded-full p-2 mr-3'>
            <Feather name='calendar' size={16} color={colors.accent} />
          </View>

          <Text className='text-foreground/70 text-sm flex-1'>
            Track upcoming payment schedules
          </Text>
        </View>

        <View className='flex-row items-center'>
          <View className='bg-accent/10 rounded-full p-2 mr-3'>
            <Feather name='pie-chart' size={16} color={colors.accent} />
          </View>

          <Text className='text-foreground/70 text-sm flex-1'>
            Analyze spending by service
          </Text>
        </View>
      </View>
    </View>
  );
};
