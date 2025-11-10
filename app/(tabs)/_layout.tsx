import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/custom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name='subscriptions'
        options={{
          title: 'Subscriptions',
        }}
      />

      <Tabs.Screen
        name='statistics'
        options={{
          title: 'Statistics',
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
