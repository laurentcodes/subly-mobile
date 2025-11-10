import { View } from 'react-native';
import { Spinner, useTheme } from 'heroui-native';

export const Loader = ({ loading }: { loading: boolean }) => {
  const { colors } = useTheme();

  return (
    <View className='flex-1 bg-background justify-center items-center h-full'>
      <Spinner size='lg' color={colors.accent} isLoading={loading} />
    </View>
  );
};

export const InlineLoader = () => {
  return <Spinner size='sm' isLoading={true} />;
};
