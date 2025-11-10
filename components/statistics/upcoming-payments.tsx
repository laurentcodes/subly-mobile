import { View, Text } from 'react-native';
import { Card } from 'heroui-native';

// utils
import { formatCurrency } from '@/utils/helpers';

// helper function to calculate days until due
const calculateDaysUntil = (dateString: string): number => {
  const dueDate = new Date(dateString);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const UpcomingPayments = ({ data }: { data: any }) => {
  if (!data || data.total === 0 || !data.upcomingPayments) {
    return (
      <Card className='px-4 py-6'>
        <Text className='text-foreground/60 text-center'>
          No upcoming payments found
        </Text>
      </Card>
    );
  }

  return (
    <View className='gap-3'>
      {data.upcomingPayments.map((payment: any, index: number) => {
        const daysUntilDue = calculateDaysUntil(payment.nextBillingDate);

        return (
          <Card key={payment.id || index} className='px-4 py-2 border-0'>
            <View className='flex-row justify-between items-start mb-2'>
              <View className='flex-1 flex-row items-center'>
                <Text className='text-foreground font-semibold text-base mb-0.5'>
                  {payment.serviceName}
                </Text>

                <Text className='text-foreground'>{' - '}</Text>

                <Text className='text-foreground/70 text-sm'>
                  {payment.planName}
                </Text>
              </View>

              <View className='items-end'>
                <Text className='text-foreground font-semibold text-lg'>
                  {payment.currencySymbol} {formatCurrency(payment.price)}
                </Text>
              </View>
            </View>

            <View className='flex-row justify-between items-center pt-2'>
              <Text className='text-foreground/60 text-xs'>
                Due: {new Date(payment.nextBillingDate).toLocaleDateString()}
              </Text>

              <Text
                className={`text-xs font-medium ${
                  daysUntilDue <= 3
                    ? 'text-red-500'
                    : daysUntilDue <= 7
                      ? 'text-orange-500'
                      : 'text-foreground/60'
                }`}
              >
                {daysUntilDue === 0
                  ? 'due today'
                  : daysUntilDue < 0
                    ? `${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue`
                    : `in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`}
              </Text>
            </View>
          </Card>
        );
      })}
    </View>
  );
};
