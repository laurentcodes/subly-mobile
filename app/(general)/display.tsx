import { Text, View, ScrollView } from 'react-native';

import { useTheme } from 'heroui-native';

import { SafeAreaView } from '@/components/safe-area';
import { Header } from '@/components/back-header';

// components
import { Card } from 'heroui-native';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeSelectorBar } from '@/components/theme-selector';

const Display = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className='bg-background flex-1'
      contentClassName='h-full px-4'
    >
      <ScrollView
        className='flex-1'
        contentContainerClassName='py-6'
        showsVerticalScrollIndicator={false}
      >
        <Header title='Display' />

        {/* theme mode card */}
        <Card className='px-4 py-4 mb-4 border-0'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-1'>
              <Text className='text-foreground font-semibold text-base mb-1'>
                Theme Mode
              </Text>

              <Text className='text-foreground/60 text-sm'>
                {theme === 'light' ? 'Light mode' : 'Dark mode'}
              </Text>
            </View>
            <ThemeToggle />
          </View>
        </Card>

        {/* color theme card */}
        <Card className='px-4 py-4 mb-4 border-0'>
          <View>
            <Text className='text-foreground font-semibold text-base mb-2'>
              Color Theme
            </Text>

            <Text className='text-foreground/60 text-sm mb-4'>
              Choose your preferred color scheme
            </Text>

            <ThemeSelectorBar />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Display;
