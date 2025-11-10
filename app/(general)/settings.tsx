import { useEffect } from 'react';

import { Text, View, ScrollView } from 'react-native';

import { toast } from 'sonner-native';

import { SafeAreaView } from '@/components/safe-area';
import { Header } from '@/components/back-header';

// form
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// components
import { Button, Card, Switch } from 'heroui-native';
import { Loader, InlineLoader } from '@/components/loading';
import { Select } from '@/components/ui/select';

// services
import { getUserSettings, updateSettings } from '@/services/api';
import { fetchCurrencies } from '@/services/third-party';

const Settings = () => {
  const queryClient = useQueryClient();

  const { data: currencies, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
    staleTime: Infinity,
    select: (data: any) =>
      data.supported_codes
        .map(([code, name]: [string, string]) => ({
          label: `${name} (${code})`,
          value: code,
        }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label)),
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getUserSettings,
    staleTime: Infinity,
    select: (data: any) => data?.data,
  });

  //  schema
  const settingsSchema = z.object({
    baseCurrency: z.string().nullable().optional(),
    show_only_base_currency: z.boolean().optional(),
  });

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      baseCurrency: settings?.baseCurrency ?? null,
      show_only_base_currency: settings?.show_only_base_currency ?? false,
    },
  });

  // initialize form with settings data
  useEffect(() => {
    if (settings) {
      reset({
        baseCurrency: settings.baseCurrency,
        show_only_base_currency: settings.show_only_base_currency ?? false,
      });
    }
  }, [settings, reset]);

  const { mutate: updateSettingsMutation, isPending: isUpdatingSettings } =
    useMutation({
      mutationFn: (data: z.infer<typeof settingsSchema>) =>
        updateSettings(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['settings', 'subscription-services', 'subscription-plans'],
        });

        toast.success('Settings updated successfully');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update settings');
      },
    });

  const onSubmit = (data: z.infer<typeof settingsSchema>) => {
    updateSettingsMutation(data);
  };

  if (isLoading || settingsLoading) {
    return <Loader loading={true} />;
  }

  return (
    <SafeAreaView
      className='bg-background flex-1'
      contentClassName='h-full px-4'
    >
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <Header title='Settings' />

        {/* settings card */}
        <Card className='px-2 mb-6 border-0'>
          <View className='mb-6'>
            <Text className='text-foreground font-semibold text-base mb-2'>
              Base Currency
            </Text>

            <Text className='text-foreground/60 text-sm mb-4'>
              Select your preferred currency for displaying amounts
            </Text>

            <Controller
              control={control}
              name='baseCurrency'
              render={({ field: { value, onChange } }) => (
                <Select
                  items={currencies}
                  value={value || ''}
                  onValueChange={onChange}
                  placeholder='Select currency'
                  snapPoints={['60%']}
                  buttonTrigger
                />
              )}
            />
          </View>

          <View className='mb-6'>
            <View className='flex-row items-center justify-between'>
              <View className='flex-1'>
                <Text className='text-foreground font-semibold text-base mb-2'>
                  Show Only Base Currency
                </Text>

                <Text className='text-foreground/60 text-sm'>
                  Only display plans in your base currency
                </Text>
              </View>

              <Controller
                control={control}
                name='show_only_base_currency'
                render={({ field: { value, onChange } }) => (
                  <Switch
                    isSelected={value}
                    onSelectedChange={onChange}
                    className='ml-4'
                  />
                )}
              />
            </View>
          </View>

          <Button
            variant='primary'
            onPress={handleSubmit(onSubmit)}
            isDisabled={isUpdatingSettings || !isDirty}
          >
            <Button.Label>
              {isUpdatingSettings ? <InlineLoader /> : 'Save Changes'}
            </Button.Label>
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
