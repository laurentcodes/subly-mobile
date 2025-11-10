import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';

// query
import { useQuery } from '@tanstack/react-query';

// components
import { SafeAreaView } from '@/components/safe-area';
import { Header } from '@/components/back-header';
import { Loader } from '@/components/loading';
import { ErrorComponent } from '@/components/error';
import { SubscriptionCard } from '@/components/home/subscription-card';
import { SubscriptionActionsDialog } from '@/components/home/subscription-actions-dialog';
import { EmptyState } from '@/components/empty-states';

import { useTheme } from 'heroui-native';

// services
import { getUserSubscriptions } from '@/services/api';

const Subscriptions = () => {
  const router = useRouter();

  const { colors } = useTheme();

  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {
    data: subscriptions,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ['userSubscriptions'],
    queryFn: getUserSubscriptions,
    select: (res) => {
      const subs = res.data ?? [];

      // transform the data to match component expectations
      return subs.map((sub: any) => ({
        id: sub.id,
        serviceName: sub.sub_plan?.sub_service?.name,
        planName: sub.sub_plan?.plan_name,
        price: sub.sub_plan?.plan_price,
        currency: sub.sub_plan?.currency,
        currencySymbol: sub.sub_plan?.currency_symbol,
        status: sub.status,
        nextBillingDate: sub.next_billing_date,
        autoRenew: sub.auto_renew,
        imageUrl: sub.sub_plan?.sub_service?.image_url,
      }));
    },
  });

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

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  if (error) {
    return (
      <ErrorComponent
        message='failed to load subscriptions. please try again.'
        onPress={() => refetch()}
      />
    );
  }

  return (
    <SafeAreaView
      className='bg-background flex-1'
      contentClassName='h-full px-4 pb-20'
    >
      <View className='flex-1'>
        <Header title='Subscriptions' />

        {subscriptions && subscriptions.length > 0 ? (
          <FlatList
            data={subscriptions}
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
            contentContainerStyle={{ paddingTop: 16 }}
          />
        ) : (
          <EmptyState onAddPress={handleAddSubscription} />
        )}
      </View>

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

export default Subscriptions;
