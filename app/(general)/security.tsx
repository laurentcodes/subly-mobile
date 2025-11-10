import { useState } from 'react';

import { Text, View } from 'react-native';

import { useTheme } from 'heroui-native';

import { toast } from 'sonner-native';

import { SafeAreaView } from '@/components/safe-area';
import { Header } from '@/components/back-header';

// query
import { useMutation } from '@tanstack/react-query';

// form
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// components
import { Button, Card, TextField } from 'heroui-native';
import { InlineLoader } from '@/components/loading';
import { ConfirmDialog } from '@/components/ui/dialog';

// icons
import { Feather } from '@expo/vector-icons';

// lib
import { authClient } from '@/lib/auth-client';

const Security = () => {
  const { colors } = useTheme();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  // form schema
  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues,
  });

  // mutation for changing password
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationFn: async (data: {
        currentPassword: string;
        newPassword: string;
      }) => {
        const { data: changeResponse, error } = await authClient.changePassword(
          {
            newPassword: data.newPassword,
            currentPassword: data.currentPassword,
            revokeOtherSessions: true,
          },
        );

        if (error) {
          throw new Error(error.message);
        }

        return changeResponse;
      },
      onSuccess: () => {
        toast.success('Password changed successfully');
        reset();
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to change password');
      },
    },
  );

  const onSubmit = (data: z.infer<typeof passwordSchema>) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  // mutation for deleting user
  const { mutate: deleteUser, isPending: isDeletingUser } = useMutation({
    mutationFn: async () => {
      const { data: deleteResponse, error } = await authClient.deleteUser();

      if (error) {
        throw new Error(error.message);
      }

      return deleteResponse;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete account');
    },
  });

  const handleDeleteAccount = () => {
    deleteUser();
  };

  return (
    <>
      <SafeAreaView
        className='bg-background flex-1'
        contentClassName='h-full px-4'
      >
        <View className='flex-1'>
          <Header title='Security' />

          {/* change password card */}
          <Card className='px-2 mb-6 border-0'>
            <Text className='text-foreground font-semibold text-base mb-4'>
              Change Password
            </Text>

            <Controller
              control={control}
              name='currentPassword'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  isRequired
                  isInvalid={!!errors.currentPassword}
                  className='mb-4'
                >
                  <TextField.Label>Current Password</TextField.Label>

                  <TextField.Input
                    placeholder='Enter current password'
                    secureTextEntry
                    autoCapitalize='none'
                    autoComplete='current-password'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isChangingPassword}
                  />

                  {errors.currentPassword && (
                    <TextField.ErrorMessage>
                      {errors.currentPassword.message}
                    </TextField.ErrorMessage>
                  )}
                </TextField>
              )}
            />

            <Controller
              control={control}
              name='newPassword'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  isRequired
                  isInvalid={!!errors.newPassword}
                  className='mb-4'
                >
                  <TextField.Label>New Password</TextField.Label>

                  <TextField.Input
                    placeholder='Enter new password'
                    secureTextEntry
                    autoCapitalize='none'
                    autoComplete='new-password'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isChangingPassword}
                  />

                  {errors.newPassword && (
                    <TextField.ErrorMessage>
                      {errors.newPassword.message}
                    </TextField.ErrorMessage>
                  )}
                </TextField>
              )}
            />

            <Controller
              control={control}
              name='confirmPassword'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  isRequired
                  isInvalid={!!errors.confirmPassword}
                  className='mb-4'
                >
                  <TextField.Label>Confirm New Password</TextField.Label>

                  <TextField.Input
                    placeholder='Confirm new password'
                    secureTextEntry
                    autoCapitalize='none'
                    autoComplete='new-password'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isChangingPassword}
                  />

                  {errors.confirmPassword && (
                    <TextField.ErrorMessage>
                      {errors.confirmPassword.message}
                    </TextField.ErrorMessage>
                  )}
                </TextField>
              )}
            />

            <Button
              variant='secondary'
              onPress={handleSubmit(onSubmit)}
              isDisabled={isChangingPassword || !isDirty || !isValid}
              className='mt-2'
            >
              <Button.Label>
                {isChangingPassword ? <InlineLoader /> : 'Change Password'}
              </Button.Label>
            </Button>
          </Card>

          {/* danger zone */}
          <View className='mb-6'>
            <Text className='text-foreground font-semibold text-base mb-3'>
              Danger Zone
            </Text>

            <Button
              variant='ghost'
              className='text-danger'
              onPress={() => setIsDeleteDialogOpen(true)}
            >
              <Feather name='trash' size={20} color={colors.danger} />

              <Button.Label className='text-red'>Delete Account</Button.Label>
            </Button>
          </View>
        </View>
      </SafeAreaView>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete Account'
        description='Are you sure you want to delete your account? This action cannot be undone.'
        confirmText='Delete Account'
        cancelText='Cancel'
        variant='danger'
        onConfirm={handleDeleteAccount}
        isConfirmPending={isDeletingUser}
      />
    </>
  );
};

export default Security;
