import { View, Text } from 'react-native';
import { Card } from 'heroui-native';

interface AutoRenewData {
  autoRenewEnabled: number;
  autoRenewDisabled: number;
  total: number;
}

interface AutoRenewStatusProps {
  data: AutoRenewData;
}

export const AutoRenewStatus = ({ data }: AutoRenewStatusProps) => {
  if (!data) {
    return (
      <Card className='px-4 py-6'>
        <Text className='text-foreground/60 text-center'>
          no auto-renew data available
        </Text>
      </Card>
    );
  }

  const enabledPercentage =
    data.total > 0 ? (data.autoRenewEnabled / data.total) * 100 : 0;
  const disabledPercentage =
    data.total > 0 ? (data.autoRenewDisabled / data.total) * 100 : 0;

  return (
    <View className='flex-row gap-3'>
      <Card className='flex-1 px-3 py-3 border-0'>
        <View className='flex-row items-center gap-2 mb-2'>
          <View className='w-3 h-3 bg-green-500 rounded-full' />
          <Text className='text-foreground/60 text-xs'>Enabled</Text>
        </View>
        <View className='flex-row items-baseline gap-2'>
          <Text className='text-foreground font-semibold text-xl'>
            {data.autoRenewEnabled}
          </Text>
          <Text className='text-foreground/60 text-xs'>
            {enabledPercentage.toFixed(1)}%
          </Text>
        </View>
      </Card>

      <Card className='flex-1 px-3 py-3 border-0'>
        <View className='flex-row items-center gap-2 mb-2'>
          <View className='w-3 h-3 bg-orange-500 rounded-full' />
          <Text className='text-foreground/60 text-xs'>Disabled</Text>
        </View>
        <View className='flex-row items-baseline gap-2'>
          <Text className='text-foreground font-semibold text-xl'>
            {data.autoRenewDisabled}
          </Text>
          <Text className='text-foreground/60 text-xs'>
            {disabledPercentage.toFixed(1)}%
          </Text>
        </View>
      </Card>
    </View>
  );
};
