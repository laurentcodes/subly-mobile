import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Toaster } from 'sonner-native';

// query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// expo
import {
  Lato_400Regular,
  Lato_700Bold,
  useFonts,
} from '@expo-google-fonts/lato';
import { Stack, useRouter, usePathname } from 'expo-router';

// providers
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// components
import { HeroUINativeProvider } from 'heroui-native';

// contexts
import { AppThemeProvider, useAppTheme } from '../contexts/app-theme-context';

// lib
import { authClient } from '@/lib/auth-client';

// styles
import '@/global.css';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const queryClient = new QueryClient();

function ThemedLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const { currentTheme } = useAppTheme();

  const { data: session, isPending } = authClient.useSession();

  // redirect logic based on authentication state
  useEffect(() => {
    if (isPending) return; // wait for session to load

    const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

    if (!session && !isAuthPage) {
      // redirect to sign-in if no session and not on auth pages
      router.replace('/sign-in');
    } else if (session && isAuthPage) {
      // redirect to home if session exists and on auth pages
      router.replace('/(tabs)');
    }
  }, [session, isPending, pathname, router]);

  // don't render anything while checking session to prevent flash
  if (isPending) {
    return null;
  }

  return (
    <HeroUINativeProvider
      config={{
        colorScheme: 'system',
        theme: currentTheme,
        textProps: {
          allowFontScaling: false,
        },
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
        }}
      >
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(general)' />
      </Stack>
    </HeroUINativeProvider>
  );
}

export default function Layout() {
  useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <AppThemeProvider>
              <ThemedLayout />
              <Toaster richColors />
            </AppThemeProvider>
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
