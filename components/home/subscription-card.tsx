import { View, Text, Pressable, Image } from 'react-native';

// components
import { formatDate } from './format-date';
import { StatusBadge } from './status-badge';

import { Card, Chip } from 'heroui-native';

// utils
import { formatCurrency } from '@/utils/helpers';

export const SubscriptionCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress?: () => void;
}) => {
  const nextBilling = item.nextBillingDate
    ? formatDate(item.nextBillingDate)
    : formatDate(undefined);

  return (
    <Pressable onPress={onPress}>
      <Card className='px-4 py-4 mb-3 border-0'>
        <View className='flex-row gap-3'>
          {/* service image */}
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              className='w-12 h-12 rounded-xl'
              resizeMode='cover'
            />
          )}

          <View className='flex-1'>
            <View className='flex-row justify-between items-start mb-3'>
              <View className='flex-1 pr-3'>
                <Text className='text-foreground font-semibold text-base mb-0.5'>
                  {item.serviceName}
                </Text>
                <Text className='text-foreground/70 text-sm'>
                  {item.planName}
                </Text>
              </View>

              <View className='flex-row gap-2'>
                <StatusBadge status={item.status} />
                {item.autoRenew !== undefined && (
                  <Chip size='sm' color='default'>
                    {item.autoRenew ? 'auto-renew' : 'manual'}
                  </Chip>
                )}
              </View>
            </View>

            <View className='flex-row items-end justify-between'>
              <Text className='text-foreground font-semibold text-lg'>
                {item.currencySymbol} {formatCurrency(item.price)}
              </Text>

              <Text className='text-foreground/60 text-xs'>
                Next bill: {nextBilling}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

export default SubscriptionCard;
