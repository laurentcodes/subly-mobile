import { Text, View, ScrollView, Pressable, Image } from 'react-native';
import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

import { SafeAreaView } from '@/components/safe-area';
import { Header } from '@/components/back-header';

import { toast } from 'sonner-native';

// query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// components
import { Button, Card } from 'heroui-native';
import { Loader, InlineLoader } from '@/components/loading';
import { Select } from '@/components/ui/select';
import { ErrorComponent } from '@/components/error';

// services
import {
  getAllSubscriptionServices,
  getSubscriptionPlans,
  subscribeToPlan,
} from '@/services/api';

const AddSubscription = () => {
  const queryClient = useQueryClient();

  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // fetch all services
  const {
    data: services,
    isLoading: isLoadingServices,
    error: servicesError,
    refetch: refetchServices,
  } = useQuery({
    queryKey: ['subscription-services'],
    queryFn: getAllSubscriptionServices,
    select: (res) => {
      const data = res.data ?? [];
      return data.map((service: any) => ({
        label: service.name,
        value: service.id,
        image: service.image_url,
      }));
    },
  });

  // fetch plans for selected service
  const {
    data: plans,
    isLoading: isLoadingPlans,
    error: plansError,
    refetch: refetchPlans,
  } = useQuery({
    queryKey: ['subscription-plans', selectedService],
    queryFn: () => getSubscriptionPlans(selectedService),
    enabled: !!selectedService,
    select: (res) => {
      const data = res.data ?? [];

      return data.map((plan: any) => ({
        label: `${plan.plan_name} ${plan.billing_cycle.charAt(0).toUpperCase() + plan.billing_cycle.slice(1)} (${plan.country}) - ${plan.currency_symbol}${plan.plan_price}`,
        value: plan.id,
        name: plan.plan_name,
        price: plan.plan_price,
        currency: plan.currency,
        billingCycle: plan.billing_cycle,
        country: plan.country,
      }));
    },
  });

  // mutation for subscribing to a plan
  const { mutate, isPending } = useMutation({
    mutationFn: async (planId: string) => {
      return await subscribeToPlan({ sub_plan_id: planId });
    },
    onSuccess: () => {
      toast.success('Successfully added plan');

      // invalidate overview query to refresh the home screen
      queryClient.invalidateQueries({ queryKey: ['overview'] });

      router.back();
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to subscribe');
    },
  });

  const handleSubscribe = () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');

      return;
    }

    mutate(selectedPlan);
  };

  // reset plan selection when service changes
  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedPlan('');
  };

  const selectedServiceData = useMemo(
    () => services?.find((s: any) => s.value === selectedService),
    [services, selectedService],
  );

  const selectedPlanData = useMemo(
    () => plans?.find((p: any) => p.value === selectedPlan),
    [plans, selectedPlan],
  );

  useFocusEffect(
    useCallback(() => {
      refetchServices();
      refetchPlans();
    }, [refetchServices, refetchPlans]),
  );

  if (isLoadingServices) {
    return <Loader loading={isLoadingServices} />;
  }

  if (servicesError) {
    return (
      <ErrorComponent
        message='Failed to load services. Please try again.'
        onPress={() => refetchServices()}
      />
    );
  }

  return (
    <SafeAreaView
      className='bg-background flex-1'
      contentClassName='h-full px-4'
    >
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <Header title='Add Subscription' />

        {/* service selection */}
        <Card className='px-4 border-0'>
          <Text className='text-foreground font-medium text-sm mb-2'>
            Select Service
          </Text>

          <Select
            items={services || []}
            value={selectedService}
            onValueChange={handleServiceChange}
            placeholder='Choose a service'
            snapPoints={['60%']}
            renderTrigger={(selectedItem, placeholder, onOpen) => (
              <Pressable
                onPress={onOpen}
                className='px-4 py-3 bg-panel rounded-lg border border-border flex-row items-center'
              >
                {selectedItem?.image && (
                  <Image
                    source={{ uri: selectedItem.image }}
                    className='w-8 h-8 rounded-md mr-3'
                  />
                )}

                <Text className='text-foreground text-base'>
                  {selectedItem?.label || placeholder}
                </Text>
              </Pressable>
            )}
          />

          {selectedServiceData?.description && (
            <Text className='text-foreground/60 text-sm mt-2'>
              {selectedServiceData.description}
            </Text>
          )}
        </Card>

        {/* plan selection */}
        {selectedService && (
          <Card className='px-4 border-0'>
            <Text className='text-foreground font-medium text-sm mb-2'>
              Select Plan
            </Text>

            {isLoadingPlans ? (
              <View className='flex w-full items-center'>
                <InlineLoader />
              </View>
            ) : plansError ? (
              <Text className='text-danger text-sm'>
                Failed to load plans. Please try again.
              </Text>
            ) : plans && plans.length > 0 ? (
              <>
                <Select
                  items={plans}
                  value={selectedPlan}
                  onValueChange={setSelectedPlan}
                  placeholder='Choose a plan'
                  snapPoints={['60%']}
                  renderTrigger={(selectedItem, placeholder, onOpen) => (
                    <Pressable
                      onPress={onOpen}
                      className='px-4 py-3 bg-panel rounded-lg border border-border'
                    >
                      <Text className='text-foreground text-base'>
                        {selectedItem?.label || placeholder}
                      </Text>
                    </Pressable>
                  )}
                />

                {selectedPlanData && (
                  <View className='mt-6 p-3 bg-accent/60 rounded-lg'>
                    <Text className='text-background font-semibold text-base mb-1'>
                      {selectedPlanData.name} ({selectedPlanData.country})
                    </Text>

                    <Text className='text-background font-semibold text-sm'>
                      {selectedPlanData.price} {selectedPlanData.currency} /{' '}
                      {selectedPlanData.billingCycle}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text className='text-foreground/60 text-sm'>
                No plans available for this service.
              </Text>
            )}

            {/* subscribe button */}
            {selectedPlan && (
              <Button
                variant='secondary'
                onPress={handleSubscribe}
                isDisabled={isPending || !selectedPlan}
                className='mt-10'
              >
                <Button.Label>
                  {isPending ? <InlineLoader /> : 'Subscribe'}
                </Button.Label>
              </Button>
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddSubscription;
