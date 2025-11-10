import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

// components
import { Button, Dialog as HeroDialog } from 'heroui-native';

interface DialogProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// basic reusable dialog
export function Dialog({
  trigger,
  title,
  description,
  children,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: DialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  // use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const onOpenChange = controlledOnOpenChange ?? setUncontrolledIsOpen;

  // don't render if no trigger and dialog is closed
  if (!trigger && !isOpen) {
    return null;
  }

  return (
    <HeroDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger && <HeroDialog.Trigger>{trigger}</HeroDialog.Trigger>}
      <HeroDialog.Portal>
        <HeroDialog.Overlay />
        <HeroDialog.Content>
          <View className='mb-5 gap-1.5'>
            <HeroDialog.Title>{title}</HeroDialog.Title>
            {description && (
              <HeroDialog.Description>{description}</HeroDialog.Description>
            )}
          </View>
          {children}
        </HeroDialog.Content>
      </HeroDialog.Portal>
    </HeroDialog>
  );
}

interface ConfirmDialogProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'primary' | 'danger';
  isLoading?: boolean;
}

// confirm dialog with cancel and confirm buttons
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  variant = 'primary',
  isLoading = false,
}: ConfirmDialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const onOpenChange = controlledOnOpenChange ?? setUncontrolledIsOpen;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  // don't render if no trigger and dialog is closed
  if (!trigger && !isOpen) {
    return null;
  }

  return (
    <HeroDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger && <HeroDialog.Trigger>{trigger}</HeroDialog.Trigger>}
      <HeroDialog.Portal>
        <HeroDialog.Overlay />
        <HeroDialog.Content>
          <View className='mb-5 gap-1.5'>
            <HeroDialog.Title>{title}</HeroDialog.Title>
            {description && (
              <HeroDialog.Description>{description}</HeroDialog.Description>
            )}
          </View>
          <View className='flex-row justify-end gap-3'>
            <HeroDialog.Close asChild>
              <Button
                variant='ghost'
                size='sm'
                onPress={handleCancel}
                isDisabled={loading || isLoading}
              >
                <Button.Label>{cancelText}</Button.Label>
              </Button>
            </HeroDialog.Close>
            <Button
              variant={variant}
              size='sm'
              onPress={handleConfirm}
              isDisabled={loading || isLoading}
            >
              <Button.Label>
                {loading || isLoading ? 'Loading...' : confirmText}
              </Button.Label>
            </Button>
          </View>
        </HeroDialog.Content>
      </HeroDialog.Portal>
    </HeroDialog>
  );
}

interface AlertDialogProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  buttonText?: string;
  onClose?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// alert dialog with single button
export function AlertDialog({
  trigger,
  title,
  description,
  buttonText = 'OK',
  onClose,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
}: AlertDialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const onOpenChange = controlledOnOpenChange ?? setUncontrolledIsOpen;

  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  // don't render if no trigger and dialog is closed
  if (!trigger && !isOpen) {
    return null;
  }

  return (
    <HeroDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger && <HeroDialog.Trigger>{trigger}</HeroDialog.Trigger>}
      <HeroDialog.Portal>
        <HeroDialog.Overlay />
        <HeroDialog.Content>
          <View className='mb-5 gap-1.5'>
            <HeroDialog.Title>{title}</HeroDialog.Title>
            {description && (
              <HeroDialog.Description>{description}</HeroDialog.Description>
            )}
          </View>
          <View className='flex-row justify-end'>
            <HeroDialog.Close asChild>
              <Button variant='primary' size='sm' onPress={handleClose}>
                <Button.Label>{buttonText}</Button.Label>
              </Button>
            </HeroDialog.Close>
          </View>
        </HeroDialog.Content>
      </HeroDialog.Portal>
    </HeroDialog>
  );
}
