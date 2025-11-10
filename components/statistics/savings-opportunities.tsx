import { View, Text } from 'react-native';
import { Card } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

// utils
import { formatCurrency } from '@/utils/helpers';

export const SavingsOpportunities = ({ data }: any) => {
  if (!data || data.length === 0) {
    return (
      <Card className='px-4 py-6'>
        <View className='items-center gap-2'>
          <Feather name='check-circle' size={32} color='#10b981' />

          <Text className='text-foreground font-medium text-center'>
            No savings opportunities found
          </Text>

          <Text className='text-foreground/60 text-xs text-center'>
            You're managing your subscriptions well!
          </Text>
        </View>
      </Card>
    );
  }

  const totalSavings = data.reduce(
    (sum: number, item: any) => sum + parseFloat(item.savings || '0'),
    0,
  );

  return (
    <View className='gap-3'>
      {/* total savings card */}
      <Card className='px-4 py32 border-0'>
        <View className='flex-row items-center gap-3'>
          <View className='w-12 h-12 bg-green-500/10 rounded-full items-center justify-center'>
            <Feather name='arrow-down-circle' size={24} color='#10b981' />
          </View>
          <View className='flex-1'>
            <Text className='text-foreground font-bold text-2xl'>
              {data[0]?.currencySymbol || '$'}{' '}
              {formatCurrency(totalSavings.toString())}
            </Text>
          </View>
        </View>
      </Card>

      {/* individual opportunities */}
      {data.map((opportunity: any, index: number) => (
        <Card key={index} className='px-4 py-4 border-0'>
          <View className='flex-row justify-between items-start mb-3'>
            <View className='flex-1 pr-3 flex-row items-center'>
              <Text className='text-foreground font-semibold text-base mb-1'>
                {opportunity.serviceName}
              </Text>

              <Text className='text-foreground/60'>{' - '}</Text>

              <Text className='text-foreground/60 text-sm'>
                {opportunity.monthlyPlan.name}
              </Text>
            </View>

            <View className='items-end'>
              <Text className='text-green-500 font-bold text-lg'>
                Save {opportunity.currencySymbol}{' '}
                {formatCurrency(opportunity.savings)}
              </Text>
            </View>
          </View>

          <View className='gap-2'>
            <View className='flex-row justify-between'>
              <Text className='text-foreground/60 text-sm'>Monthly Plan</Text>

              <Text className='text-foreground font-medium text-sm'>
                {opportunity.currencySymbol}{' '}
                {formatCurrency(opportunity.monthlyPlan.price)}
              </Text>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-foreground/60 text-sm'>Yearly Plan</Text>

              <Text className='text-foreground font-medium text-sm'>
                {opportunity.currencySymbol}{' '}
                {formatCurrency(opportunity.yearlyPlan.price)}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};
