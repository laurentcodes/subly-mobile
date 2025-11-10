import { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { useTheme } from 'heroui-native';
import { useRouter } from 'expo-router';

import { SafeAreaView } from '@/components/safe-area';

// components
import { Button, Avatar } from 'heroui-native';
import { ConfirmDialog } from '@/components/ui/dialog';
import { MenuButton } from '@/components/ui/menu-button';

// icons
import { Feather } from '@expo/vector-icons';

// lib
import { authClient } from '@/lib/auth-client';

// utils
import { getInitials } from '@/utils/helpers';

const Profile = () => {
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const { colors } = useTheme();

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  return (
    <>
      <SafeAreaView
        className='bg-background flex-1'
        contentClassName='h-full px-4 pb-20'
      >
        <View className='flex-1'>
          <ScrollView
            className='flex-1'
            showsVerticalScrollIndicator={false}
            contentContainerClassName='py-6'
          >
            {/* profile overview */}
            <View className='items-center mb-8'>
              {/* avatar */}
              <Avatar size='lg' className='bg-accent mb-4' alt='User Avatar'>
                <Avatar.Image source={{ uri: session?.user.image || '' }} />

                <Avatar.Fallback>
                  <Text className='text-white text-2xl font-bold'>
                    {session?.user.name ? getInitials(session.user.name) : 'U'}
                  </Text>
                </Avatar.Fallback>
              </Avatar>

              {/* name */}
              <Text className='text-foreground font-bold text-xl mb-1'>
                {session?.user.name || 'Not set'}
              </Text>

              {/* email */}
              <Text className='text-muted-foreground text-sm'>
                {session?.user.email || 'Not set'}
              </Text>
            </View>

            {/* menu buttons */}
            <View className='gap-2'>
              <MenuButton
                startIcon='user'
                label='Profile'
                onPress={handleEditProfile}
              />

              <MenuButton
                startIcon='lock'
                label='Security'
                onPress={() => router.push('/security')}
              />

              <MenuButton
                startIcon='sun'
                label='Display'
                onPress={() => router.push('/display')}
              />

              <MenuButton
                startIcon='settings'
                label='Settings'
                onPress={() => router.push('/settings')}
              />
            </View>
          </ScrollView>

          {/* logout button - fixed at bottom */}
          <View className='pb-2'>
            <Button
              variant='secondary'
              onPress={() => setIsLogoutDialogOpen(true)}
            >
              <Feather name='log-out' size={20} color={colors.accent} />

              <Button.Label>Log Out</Button.Label>
            </Button>
          </View>
        </View>
      </SafeAreaView>

      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        title='Log Out'
        description='Are you sure you want to log out?'
        confirmText='Log Out'
        cancelText='Cancel'
        variant='primary'
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Profile;
