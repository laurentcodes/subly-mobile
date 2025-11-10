import { Text, View } from 'react-native';

export const CurrencyRow = ({ data }: { data: any }) => {
  return (
    <View className='flex-row items-center justify-between py-3 border-b border-border/30'>
      <View className='flex-row items-center gap-2'>
        <View className='w-10 h-10 bg-primary/10 rounded-full items-center justify-center'>
          <Text className='text-foreground text-lg font-semibold'>
            {data.currencySymbol}
          </Text>
        </View>
        <Text className='text-foreground font-medium text-base'>
          {data.currency}
        </Text>
      </View>
      <Text className='text-foreground font-semibold text-lg'>
        {data.currencySymbol}
        {parseFloat(data.total).toFixed(2)}
      </Text>
    </View>
  );
};

export default CurrencyRow;
