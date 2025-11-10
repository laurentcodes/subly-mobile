import { Text, View, ScrollView, Pressable } from 'react-native';

import { Image } from 'expo-image';

import { SafeAreaView } from '@/components/safe-area';
import { Header } from '@/components/back-header';

import { toast } from 'sonner-native';

// query
import { useQuery, useMutation } from '@tanstack/react-query';

// form
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// components
import { Button, Card, TextField } from 'heroui-native';
import { Loader, InlineLoader } from '@/components/loading';
import { Select } from '@/components/ui/select';

// lib
import { authClient } from '@/lib/auth-client';

// services
import { fetchAllCountries } from '@/services/third-party';

const EditProfile = () => {
  const { data: session } = authClient.useSession();

  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchAllCountries,
    staleTime: Infinity,
    select: (data) => {
      return data
        .map((country: any) => ({
          label: country.name,
          value: country.alpha2Code,
          flag: country.flags.png,
        }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label));
    },
  });

  // form schema
  const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    country: z.string().optional(),
  });

  const defaultValues = {
    name: session?.user.name || '',
    email: session?.user.email || '',
    country: (session?.user as any)?.country || '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  // mutation for updating user profile
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      name: string;
      country?: string;
    }) => {
      return await authClient.updateUser({
        name: data.name,
        country: data.country,
      });
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      // router.back();
    },
    onError: (error) => {
      toast.error('Failed to update profile');
    },
  });

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    mutate({
      name: data.name,
      country: data.country,
    });
  };

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

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
        <Header title='Edit Profile' />

        {/* form card */}
        <Card className='px-2 mb-6 border-0'>
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isRequired isInvalid={!!errors.email} className='mb-4'>
                <TextField.Label>Email Address</TextField.Label>

                <TextField.Input
                  placeholder='your@email.com'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoComplete='email'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={false}
                />

                <TextField.Description>
                  Email cannot be changed
                </TextField.Description>

                {errors.email && (
                  <TextField.ErrorMessage>
                    {errors.email.message}
                  </TextField.ErrorMessage>
                )}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isRequired isInvalid={!!errors.name} className='mb-4'>
                <TextField.Label>Name</TextField.Label>

                <TextField.Input
                  placeholder='Your name'
                  autoCapitalize='words'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isPending}
                />

                {errors.name && (
                  <TextField.ErrorMessage>
                    {errors.name.message}
                  </TextField.ErrorMessage>
                )}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name='country'
            render={({ field: { onChange, value } }) => (
              <View className='mb-6'>
                <Text className='text-foreground font-medium text-sm mb-2'>
                  Country
                </Text>

                <Select
                  items={countries || []}
                  value={value}
                  onValueChange={onChange}
                  placeholder='Select country'
                  snapPoints={['60%']}
                  renderTrigger={(selectedItem, placeholder, onOpen) => (
                    <Pressable
                      onPress={onOpen}
                      className='px-4 py-3 bg-panel rounded-lg border border-border flex-row items-center gap-3'
                    >
                      {selectedItem?.flag && (
                        <Image
                          source={{ uri: selectedItem.flag }}
                          style={{ width: 30, height: 18 }}
                        />
                      )}

                      <Text className='text-foreground text-base flex-1'>
                        {selectedItem?.label || placeholder}
                      </Text>
                    </Pressable>
                  )}
                />
                {errors.country && (
                  <Text className='text-danger text-sm mt-1'>
                    {errors.country.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            variant='primary'
            onPress={handleSubmit(onSubmit)}
            isDisabled={isPending || !isDirty}
            className='mt-2'
          >
            <Button.Label>
              {isPending ? <InlineLoader /> : 'Save Changes'}
            </Button.Label>
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
