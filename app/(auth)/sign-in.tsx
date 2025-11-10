import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useTheme } from 'heroui-native';
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

export default function SignIn() {
  const { colors } = useTheme();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // schema
  const signInSchema = z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // mutation for sign in
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof signInSchema>) => {
      return await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.error.message || 'An unexpected error occurred');
        return;
      }

      toast.success('Successfully signed in');
    },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
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
            Welcome back
          </Text>
          <Text className='text-base text-muted-foreground'>
            Track and manage all your subscriptions in one place
          </Text>
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
                    <Ionicons
                      name='mail-outline'
                      size={20}
                      color={colors.accent}
                    />
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
        <View className='mb-4'>
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isRequired isInvalid={!!errors.password}>
                <TextField.Label>Password</TextField.Label>
                <TextField.Input
                  placeholder='Enter your password'
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                  autoComplete='password'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isPending}
                >
                  <TextField.InputStartContent>
                    <Ionicons
                      name='lock-closed-outline'
                      size={20}
                      color={colors.accent}
                    />
                  </TextField.InputStartContent>

                  <TextField.InputEndContent>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.accent}
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

        {/* forgot password */}
        <View className='mb-6 items-end'>
          <Button variant='ghost' size='sm' className='p-0'>
            <Button.Label>Forgot password?</Button.Label>
          </Button>
        </View>

        {/* sign in button */}
        <Button
          variant='primary'
          onPress={handleSubmit(onSubmit)}
          isDisabled={isPending}
        >
          <Button.Label>
            {isPending ? <InlineLoader /> : 'Sign in'}
          </Button.Label>
        </Button>

        {/* sign up link */}
        <View className='flex-row justify-center items-center mt-6 gap-1'>
          <Text className='text-sm text-muted-foreground'>
            Don't have an account?
          </Text>
          <Button
            variant='ghost'
            size='sm'
            className='p-0'
            onPress={() => router.push('/sign-up')}
          >
            <Button.Label>Sign up</Button.Label>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
