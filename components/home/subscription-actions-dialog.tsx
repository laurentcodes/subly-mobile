import { useState } from 'react';
import { View } from 'react-native';

import { toast } from 'sonner-native';

// query
import { useMutation, useQueryClient } from '@tanstack/react-query';

// icons
import { Feather } from '@expo/vector-icons';

// components
import { InlineLoader } from '@/components/loading';
import { StatusBadge } from './status-badge';
import { Button, Dialog } from 'heroui-native';

// services
import {
  updateSubscriptionStatus,
  deleteUserSubscription,
} from '@/services/api';

export const SubscriptionActionsDialog = ({
  subscription,
  isOpen,
  onOpenChange,
}: {
  subscription: {
    id: string;
    status: string;
    serviceName: string;
    planName: string;
    price: number;
    currencySymbol: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // mutation for updating subscription status
  const { mutate, isPending } = useMutation({
    mutationFn: async (status: string) => {
      return await updateSubscriptionStatus(subscription.id, status);
    },
    onSuccess: () => {
      toast.success('Subscription Status Updated');

      queryClient.invalidateQueries({ queryKey: ['overview'] });

      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.message);
    },
  });

  // mutation for deleting subscription
  const { mutate: deleteSubscription, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return await deleteUserSubscription(subscription.id);
    },
    onSuccess: () => {
      toast.success('Subscription Deleted');

      queryClient.invalidateQueries({ queryKey: ['overview'] });

      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.message);
    },
  });

  const handleStatusChange = (status: string) => {
    mutate(status);
  };

  const handleDelete = () => {
    deleteSubscription();
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />

        <Dialog.Content>
          <View className='mb-5 gap-1.5 flex-row justify-between items-center'>
            <View>
              <Dialog.Title>{subscription.serviceName}</Dialog.Title>

              <Dialog.Description>
                {subscription.planName} • {subscription.currencySymbol}
                {subscription.price}
              </Dialog.Description>
            </View>

            <StatusBadge status={subscription.status} />
          </View>

          <View className='gap-2 mb-4'>
            {subscription.status !== 'paused' && (
              <Button
                variant='tertiary'
                onPress={() => handleStatusChange('paused')}
                isDisabled={isPending}
              >
                <Button.Label>
                  {isPending && subscription.status !== 'paused' ? (
                    <InlineLoader />
                  ) : (
                    'Pause Subscription'
                  )}
                </Button.Label>
              </Button>
            )}

            {subscription.status !== 'cancelled' && (
              <Button
                variant='tertiary'
                onPress={() => handleStatusChange('cancelled')}
                isDisabled={isPending}
              >
                <Button.Label>
                  {isPending && subscription.status !== 'cancelled' ? (
                    <InlineLoader />
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button.Label>
              </Button>
            )}
          </View>

          <View className='gap-2 mb-4 pt-4 border-t border-border'>
            {!showDeleteConfirm ? (
              <Button
                variant='danger'
                onPress={() => setShowDeleteConfirm(true)}
                isDisabled={isPending || isDeleting}
              >
                <Button.Label>Delete Subscription</Button.Label>
              </Button>
            ) : (
              <>
                <Button
                  variant='danger'
                  onPress={handleDelete}
                  isDisabled={isDeleting}
                >
                  <Button.Label>
                    {isDeleting ? <InlineLoader /> : 'Confirm Delete'}
                  </Button.Label>
                </Button>
                <Button
                  variant='ghost'
                  onPress={() => setShowDeleteConfirm(false)}
                  isDisabled={isDeleting}
                >
                  <Button.Label>Cancel</Button.Label>
                </Button>
              </>
            )}
          </View>

          <View className='flex-row justify-end gap-3'>
            <Dialog.Close asChild>
              <Button
                variant='ghost'
                size='sm'
                onPress={() => onOpenChange(false)}
                isDisabled={isPending || isDeleting}
              >
                <Button.Label>Close</Button.Label>
              </Button>
            </Dialog.Close>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
