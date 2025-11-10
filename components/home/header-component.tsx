import { View, Text } from 'react-native';
import { useTheme } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

// components
import { SummaryCard } from './summary-card';
import { Button } from 'heroui-native';

// utils
import { formatCurrency } from '@/utils/helpers';

export const OverviewSection = ({
  totalSubscriptions,
  overview,
  statusCounts,
}: {
  totalSubscriptions: number;
  overview: any;
  statusCounts: Record<string, number>;
}) => {
  return (
    <View>
      <View className='mb-6 mt-2'>
        <Text className='text-foreground font-bold text-2xl'>Overview</Text>
      </View>

      <View>
        <View className='flex-row'>
          <SummaryCard label='Total Subscriptions' value={totalSubscriptions} />
        </View>

        <View className='flex-row'>
          <SummaryCard
            label='Active Amounts'
            value={`${overview?.baseCurrencySymbol || ''} ${
              formatCurrency(overview?.totalConvertedActivePrice) || 0
            }`}
          />

          <SummaryCard
            label='All Amounts'
            value={`${overview?.baseCurrencySymbol || ''} ${
              formatCurrency(overview?.totalConvertedPrice) || 0
            }`}
          />
        </View>

        <View className='flex-row flex-wrap'>
          {Object.entries(statusCounts).map(([status, count]) => (
            <SummaryCard
              key={status}
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              value={count as number}
              accent={status}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export const SubscriptionsHeader = ({
  count,
  onViewAll,
}: {
  count: number;
  onViewAll?: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <View className='flex-row items-center justify-between mb-4 mt-6'>
      <View>
        <Text className='text-foreground font-semibold text-base'>
          Subscriptions
        </Text>

        <Text className='text-foreground/60 text-xs'>
          {count} item{count === 1 ? '' : 's'}
        </Text>
      </View>

      <Button variant='secondary' size='sm' onPress={onViewAll}>
        <Button.Label>
          <Text className='text-muted-foreground'>View All</Text>
        </Button.Label>

        <Feather
          name='chevron-right'
          size={16}
          color={colors.mutedForeground}
        />
      </Button>
    </View>
  );
};
