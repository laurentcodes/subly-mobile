import { Stack } from 'expo-router';

export default function GeneralLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='edit-profile' />
      <Stack.Screen name='add-subscription' />
    </Stack>
  );
}
