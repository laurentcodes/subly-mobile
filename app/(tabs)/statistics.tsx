import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from 'heroui-native';

// query
import { useQuery } from '@tanstack/react-query';

// components
import { SafeAreaView } from '@/components/safe-area';
import { Header } from '@/components/back-header';
import { Loader } from '@/components/loading';
import { UpcomingPayments } from '@/components/statistics/upcoming-payments';
import { SpendingByService } from '@/components/statistics/spending-by-service';
import { BillingCycles } from '@/components/statistics/billing-cycles';
import { AutoRenewStatus } from '@/components/statistics/auto-renew-status';
import { SavingsOpportunities } from '@/components/statistics/savings-opportunities';
import { StatisticsEmptyState } from '@/components/empty-states';

// services
import {
  getUpcomingPayments,
  getSpendingByService,
  getBillingCycles,
  getAutoRenewStatus,
  getSavingsOpportunities,
} from '@/services/api';

const Statistics = () => {
  const { colors } = useTheme();

  // query for upcoming payments
  const {
    data: upcomingPayments,
    isLoading: upcomingLoading,
    refetch: refetchUpcoming,
  } = useQuery({
    queryKey: ['upcomingPayments'],
    queryFn: getUpcomingPayments,
  });

  // query for spending by service
  const {
    data: spendingByService,
    isLoading: spendingLoading,
    refetch: refetchSpending,
  } = useQuery({
    queryKey: ['spendingByService'],
    queryFn: getSpendingByService,
  });

  // query for billing cycles
  const {
    data: billingCycles,
    isLoading: billingLoading,
    refetch: refetchBilling,
  } = useQuery({
    queryKey: ['billingCycles'],
    queryFn: getBillingCycles,
  });

  // query for auto-renew status
  const {
    data: autoRenewStatus,
    isLoading: autoRenewLoading,
    refetch: refetchAutoRenew,
  } = useQuery({
    queryKey: ['autoRenewStatus'],
    queryFn: getAutoRenewStatus,
  });

  // query for savings opportunities
  const {
    data: savingsOpportunities,
    isLoading: savingsLoading,
    refetch: refetchSavings,
  } = useQuery({
    queryKey: ['savingsOpportunities'],
    queryFn: getSavingsOpportunities,
  });

  const isLoading =
    upcomingLoading ||
    spendingLoading ||
    billingLoading ||
    autoRenewLoading ||
    savingsLoading;

  const onRefresh = useCallback(async () => {
    await Promise.all([
      refetchUpcoming(),
      refetchSpending(),
      refetchBilling(),
      refetchAutoRenew(),
      refetchSavings(),
    ]);
  }, [
    refetchUpcoming,
    refetchSpending,
    refetchBilling,
    refetchAutoRenew,
    refetchSavings,
  ]);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  // check if all statistics are empty
  const hasNoData =
    upcomingPayments?.data?.total === 0 &&
    spendingByService?.data?.totalConvertedPrice === '0.00' &&
    billingCycles?.data?.total === 0 &&
    autoRenewStatus?.data?.total === 0 &&
    savingsOpportunities.data.length === 0;

  return (
    <SafeAreaView
      className='bg-background flex-1'
      contentClassName='h-full px-4 pb-20'
    >
      <View className='flex-1'>
        <Header title='Statistics' />

        {hasNoData ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                tintColor={colors.accent}
                refreshing={false}
                onRefresh={onRefresh}
              />
            }
          >
            <StatisticsEmptyState />
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
            refreshControl={
              <RefreshControl
                tintColor={colors.accent}
                refreshing={false}
                onRefresh={onRefresh}
              />
            }
          >
            {/* upcoming payments */}
            {upcomingPayments?.data && (
              <View className='mb-6'>
                <Text className='text-foreground/60 text-sm font-medium mb-3'>
                  UPCOMING PAYMENTS
                </Text>

                <UpcomingPayments data={upcomingPayments?.data} />
              </View>
            )}

            {/* spending by service */}
            {spendingByService?.data && (
              <View className='mb-6'>
                <Text className='text-foreground/60 text-sm font-medium mb-3'>
                  SPENDING BY SERVICE
                </Text>

                <SpendingByService data={spendingByService?.data} />
              </View>
            )}

            {/* billing cycles */}
            {billingCycles?.data && (
              <View className='mb-6'>
                <Text className='text-foreground/60 text-sm font-medium mb-3'>
                  BILLING CYCLES
                </Text>

                <BillingCycles data={billingCycles.data} />
              </View>
            )}

            {/* auto-renew status */}
            {autoRenewStatus?.data && (
              <View className='mb-6'>
                <Text className='text-foreground/60 text-sm font-medium mb-3'>
                  AUTO-RENEW STATUS
                </Text>

                <AutoRenewStatus data={autoRenewStatus.data} />
              </View>
            )}

            {/* savings opportunities */}
            {savingsOpportunities?.data && (
              <View className='mb-6'>
                <Text className='text-foreground/60 text-sm font-medium'>
                  SAVINGS OPPORTUNITIES
                </Text>

                <SavingsOpportunities data={savingsOpportunities.data} />
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Statistics;
