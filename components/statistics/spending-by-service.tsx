import { View, Text } from 'react-native';
import { Card } from 'heroui-native';

// utils
import { formatCurrency } from '@/utils/helpers';

export const SpendingByService = ({ data }: { data: any }) => {
  if (!data || !data.spendingByService || data.spendingByService.length === 0) {
    return (
      <Card className='px-4 py-6'>
        <Text className='text-foreground/60 text-center'>
          No spending data available
        </Text>
      </Card>
    );
  }

  return (
    <View className='gap-3'>
      {data.spendingByService.map((service: any, index: number) => {
        return (
          <Card key={index} className='px-4 py-1 border-0'>
            <View className='flex-row justify-between items-center'>
              <View className='flex-1'>
                <Text className='text-foreground font-semibold text-base mb-0.5'>
                  {service.serviceName}
                </Text>

                <Text className='text-foreground/60 text-xs'>
                  {service.subscriptionCount} subscription
                  {service.subscriptionCount !== 1 ? 's' : ''}
                </Text>
              </View>

              <View className='items-end'>
                <Text className='text-foreground font-semibold text-lg'>
                  {service.currencySymbol}{' '}
                  {formatCurrency(service.totalSpending)}
                </Text>
              </View>
            </View>
          </Card>
        );
      })}
    </View>
  );
};
