import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { router } from 'expo-router';
import { toast } from 'sonner-native';
import { useMutation } from '@tanstack/react-query';

// form
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// components
import { Button, TextField } from 'heroui-native';
import { InlineLoader } from '@/components/loading';

// icons
import { Ionicons } from '@expo/vector-icons';

// lib
import { authClient } from '@/lib/auth-client';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // schema
  const signUpSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // mutation for sign up
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof signUpSchema>) => {
      return await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message || 'Failed to create account');
        return;
      }

      toast.success(
        'Account created successfully!. Check your email for verification link.',
      );
    },
  });

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    mutate(data);
  };

  return (
    <ScrollView
      className='flex-1 bg-background'
      contentContainerClassName='h-full justify-center'
    >
      <View className='flex-1 justify-center px-6 py-12'>
        {/* brand */}
        <View className='mb-8'>
          <Text className='text-2xl font-bold text-accent mb-6'>Subly</Text>
        </View>

        {/* header */}
        <View className='mb-8'>
          <Text className='text-4xl font-bold text-foreground mb-2'>
            Take control of your subscriptions
          </Text>
          <Text className='text-base text-muted-foreground'>
            See exactly where your money goes each month
          </Text>
        </View>

        {/* full name field */}
        <View className='mb-4'>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isRequired isInvalid={!!errors.name}>
                <TextField.Label>Full Name</TextField.Label>
                <TextField.Input
                  placeholder='Jane Smith'
                  autoCapitalize='words'
                  autoComplete='name'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isPending}
                >
                  <TextField.InputStartContent>
                    <Ionicons name='person-outline' size={18} />
                  </TextField.InputStartContent>
                </TextField.Input>
                {errors.name && (
                  <TextField.ErrorMessage>
                    {errors.name.message}
                  </TextField.ErrorMessage>
                )}
              </TextField>
            )}
          />
        </View>

        {/* email field */}
        <View className='mb-4'>
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isRequired isInvalid={!!errors.email}>
                <TextField.Label>Email Address</TextField.Label>
                <TextField.Input
                  placeholder='your@email.com'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoComplete='email'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isPending}
                >
                  <TextField.InputStartContent>
                    <Ionicons name='mail-outline' size={18} />
                  </TextField.InputStartContent>
                </TextField.Input>
                {errors.email && (
                  <TextField.ErrorMessage>
                    {errors.email.message}
                  </TextField.ErrorMessage>
                )}
              </TextField>
            )}
          />
        </View>

        {/* password field */}
        <View className='mb-2'>
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isRequired isInvalid={!!errors.password}>
                <TextField.Label>Password</TextField.Label>
                <TextField.Input
                  placeholder='Create a password'
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                  autoComplete='password'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isPending}
                >
                  <TextField.InputStartContent>
                    <Ionicons name='lock-closed-outline' size={18} />
                  </TextField.InputStartContent>

                  <TextField.InputEndContent>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  </TextField.InputEndContent>
                </TextField.Input>

                {errors.password && (
                  <TextField.ErrorMessage>
                    {errors.password.message}
                  </TextField.ErrorMessage>
                )}
              </TextField>
            )}
          />
        </View>

        {/* password requirements */}
        <Text className='text-xs text-muted-foreground mb-4'>
          At least 8 characters
        </Text>

        {/* legal text */}
        <Text className='text-xs text-muted-foreground text-center mb-4'>
          By signing up, you agree to our{' '}
          <Text className='text-accent'>Terms of Service</Text> and{' '}
          <Text className='text-accent'>Privacy Policy</Text>
        </Text>

        {/* create account button */}
        <Button
          variant='primary'
          onPress={handleSubmit(onSubmit)}
          isDisabled={isPending}
        >
          <Button.Label>
            {isPending ? <InlineLoader /> : 'Create account'}
          </Button.Label>
        </Button>

        {/* sign in link */}
        <View className='flex-row justify-center items-center mt-6 gap-1'>
          <Text className='text-sm text-muted-foreground'>
            Already have an account?
          </Text>
          <Button
            variant='ghost'
            size='sm'
            className='p-0'
            onPress={() => router.push('/sign-in')}
          >
            <Button.Label>Sign in</Button.Label>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
