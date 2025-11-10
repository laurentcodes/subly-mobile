import { View, Text } from 'react-native';
import { Card } from 'heroui-native';

export const BillingCycles = ({ data }: { data: any }) => {
  if (
    !data ||
    !data.billingCycleDistribution ||
    data.total === 0
  ) {
    return (
      <Card className='px-4 py-6'>
        <Text className='text-foreground/60 text-center'>
          no billing cycle data available
        </Text>
      </Card>
    );
  }

  const cycles = Object.entries(data.billingCycleDistribution).filter(
    ([_, count]) => count > 0,
  );

  if (cycles.length === 0) {
    return (
      <Card className='px-4 py-6'>
        <Text className='text-foreground/60 text-center'>
          no billing cycle data available
        </Text>
      </Card>
    );
  }

  return (
    <View className='gap-3'>
      {cycles.map(([cycle, count]: [string, any], index: number) => {
        return (
          <Card key={index} className='px-4 py-1 border-0'>
            <View className='flex-row justify-between items-center'>
              <View className='flex-1'>
                <Text className='text-foreground font-semibold text-base mb-0.5'>
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                </Text>
                <Text className='text-foreground/60 text-xs'>
                  {count} subscription{count !== 1 ? 's' : ''}
                </Text>
              </View>

              <View className='items-end'>
                <Text className='text-foreground font-semibold text-lg'>
                  {count}
                </Text>
              </View>
            </View>
          </Card>
        );
      })}
    </View>
  );
};
