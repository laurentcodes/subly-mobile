import { View, Text, Pressable } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom - 10,
        left: insets.left + 16,
        right: insets.right + 16,
      }}
    >
      <View
        style={{
          backgroundColor: colors.panel,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        <View className='flex-row px-2 py-3'>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];

            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            // get icon name based on route name
            const getIconName = (
              routeName: string,
            ): keyof typeof Feather.glyphMap => {
              switch (routeName) {
                case 'index':
                  return 'home';
                case 'subscriptions':
                  return 'list';
                case 'statistics':
                  return 'bar-chart-2';
                case 'profile':
                  return 'user';
                default:
                  return 'circle';
              }
            };

            const iconName = getIconName(route.name);
            const iconColor = isFocused
              ? colors.accent
              : colors.mutedForeground;

            const labelColor = isFocused
              ? colors.accent
              : colors.mutedForeground;

            return (
              <Pressable
                key={route.key}
                accessibilityRole='button'
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                className='flex-1 items-center justify-center py-2'
              >
                <Feather name={iconName} size={24} color={iconColor} />
                <Text
                  className='text-xs mt-1'
                  style={{
                    color: labelColor,
                    fontWeight: isFocused ? '600' : '400',
                  }}
                >
                  {typeof label === 'string' ? label : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
