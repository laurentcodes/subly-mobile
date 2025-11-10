import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, FlatList, RefreshControl, ScrollView } from 'react-native';
import { router } from 'expo-router';

// query
import { useQuery } from '@tanstack/react-query';

// components
import { SafeAreaView } from '@/components/safe-area';
import { Loader } from '@/components/loading';

import {
  OverviewSection,
  SubscriptionsHeader,
} from '@/components/home/header-component';
import { ErrorComponent } from '@/components/error';
import { SubscriptionCard } from '@/components/home/subscription-card';
import { SubscriptionActionsDialog } from '@/components/home/subscription-actions-dialog';
import { EmptyState } from '@/components/empty-states';

import { useTheme, Button } from 'heroui-native';

// icons
import { Feather } from '@expo/vector-icons';

// services
import { getOverviewStats } from '@/services/api';

const App = () => {
  const { colors } = useTheme();

  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {
    data: overview,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ['overview'],
    queryFn: getOverviewStats,
    select: (res) => {
      const data = res.data ?? {};

      return {
        totalSubscriptions: data.totalSubscriptions ?? 0,
        subscriptionsByStatus: data.subscriptionsByStatus ?? {},
        totalPriceByCurrency: data.totalPriceByCurrency ?? {},
        baseCurrency: data.baseCurrency ?? '',
        baseCurrencySymbol: data.baseCurrencySymbol ?? '',
        totalConvertedPrice: data.totalConvertedPrice ?? 0,
        totalConvertedActivePrice: data.totalConvertedActivePrice ?? 0,
        subscriptions: data.subscriptions ?? [],
      };
    },
  });

  const statusCounts = useMemo(
    () => overview?.subscriptionsByStatus || {},
    [overview],
  );

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // handler for adding new subscription
  const handleAddSubscription = useCallback(() => {
    router.push('/(general)/add-subscription');
  }, []);

  // handler for subscription card click
  const handleSubscriptionClick = useCallback((subscription: any) => {
    setSelectedSubscription(subscription);
    setIsDialogOpen(true);
  }, []);

  // handler for dialog close
  const handleDialogClose = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedSubscription(null);
    }
  }, []);

  // handler for view all subscriptions
  const handleViewAll = useCallback(() => {
    router.push('/(tabs)/subscriptions');
  }, []);

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  if (error) {
    return (
      <ErrorComponent
        message='Failed to load overview data. Please try again.'
        onPress={() => refetch()}
      />
    );
  }

  const totalSubscriptions = overview?.totalSubscriptions || 0;
  const allSubscriptions = overview?.subscriptions || [];

  return (
    <SafeAreaView
      className='bg-background'
      contentClassName='h-full px-4 pb-20'
    >
      {totalSubscriptions === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={colors.accent}
              refreshing={isRefetching}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View className='mb-6'>
            <Text className='text-accent font-bold text-2xl'>Overview</Text>
          </View>

          <EmptyState onAddPress={handleAddSubscription} />
        </ScrollView>
      ) : (
        <View className='flex-1'>
          {/* static overview section */}
          <View className='pt-6'>
            <OverviewSection
              totalSubscriptions={totalSubscriptions}
              overview={overview}
              statusCounts={statusCounts}
            />

            <SubscriptionsHeader
              count={allSubscriptions.length}
              onViewAll={handleViewAll}
            />
          </View>

          {/* scrollable subscriptions list */}
          <FlatList
            data={allSubscriptions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <SubscriptionCard
                item={item}
                onPress={() => handleSubscriptionClick(item)}
              />
            )}
            refreshControl={
              <RefreshControl
                tintColor={colors.accent}
                refreshing={isRefetching}
                onRefresh={onRefresh}
              />
            }
            ListFooterComponent={<View style={{ height: 32 }} />}
            showsVerticalScrollIndicator={false}
          />

          {/* add subscription button */}
          <View className='absolute right-4 bottom-2'>
            <Button
              size='lg'
              variant='primary'
              onPress={handleAddSubscription}
              className='rounded-full'
              isIconOnly
            >
              <Button.Label>
                <Feather
                  name='plus'
                  size={24}
                  color={colors.accentForeground}
                />
              </Button.Label>
            </Button>
          </View>
        </View>
      )}

      {/* subscription actions dialog */}
      {selectedSubscription && (
        <SubscriptionActionsDialog
          subscription={selectedSubscription}
          isOpen={isDialogOpen}
          onOpenChange={handleDialogClose}
        />
      )}
    </SafeAreaView>
  );
};

export default App;
