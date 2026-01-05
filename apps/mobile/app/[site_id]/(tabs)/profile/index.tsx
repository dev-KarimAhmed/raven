import { Stack } from 'expo-router';
import { Platform, ScrollView, View } from 'react-native';
import { Text } from '@components/nativewindui/Text';
import LogOutButton from '@components/features/profile/profile-settings/LogOutButton';
import NotificationSetting from '@components/features/profile/profile-settings/NotificationSetting';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppearanceSetting from '@components/features/profile/profile-settings/AppearanceSetting';
import UserAvailability from '@components/features/profile/profile-settings/UserAvailability';
import UserFullName from '@components/features/profile/profile-settings/UserFullName';
import CustomStatus from '@components/features/profile/profile-settings/CustomStatus';
import ProfilePicture from '@components/features/profile/upload-profile/ProfilePicture';
import Preferences from '@components/features/profile/profile-settings/Preferences';
import SwitchSitesSetting from '@components/features/profile/profile-settings/SwitchSitesSetting';
import CommonErrorBoundary from '@components/common/CommonErrorBoundary';
import { useColorScheme } from '@hooks/useColorScheme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { User, Settings, Palette, Bell, LogOut } from 'lucide-react-native';

export default function Profile() {
    const { colors, colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Profile Header */}
                <Animated.View
                    entering={FadeInDown.duration(400)}
                    className="px-5 pt-4 pb-2"
                >
                    <View className="flex-row items-center gap-3">
                        <View
                            className="p-2 rounded-xl"
                            style={{
                                backgroundColor: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                            }}
                        >
                            <User size={24} color={isDark ? '#818CF8' : '#6366F1'} strokeWidth={2} />
                        </View>
                        <View>
                            <Text className="text-2xl font-bold text-foreground">Profile</Text>
                            <Text className="text-sm text-muted-foreground">Manage your account</Text>
                        </View>
                    </View>
                </Animated.View>

                <View className='flex flex-col gap-6 px-4 pt-4'>
                    {/* Profile Picture Card */}
                    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                        <ProfilePicture />
                    </Animated.View>

                    {/* Personal Info Section */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(400)}
                        className='flex flex-col gap-2'
                    >
                        <SectionHeader
                            icon={User}
                            title="Personal Info"
                            isDark={isDark}
                        />
                        <View
                            className='rounded-2xl overflow-hidden'
                            style={{
                                backgroundColor: isDark ? '#18181b' : '#ffffff',
                                borderWidth: 1,
                                borderColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(229, 231, 235, 0.8)',
                            }}
                        >
                            <UserFullName />
                            <Separator isDark={isDark} />
                            <CustomStatus />
                            <Separator isDark={isDark} />
                            <UserAvailability />
                        </View>
                    </Animated.View>

                    {/* Preferences Section */}
                    <Animated.View
                        entering={FadeInDown.delay(300).duration(400)}
                        className='flex flex-col gap-2'
                    >
                        <SectionHeader
                            icon={Settings}
                            title="Preferences"
                            isDark={isDark}
                        />
                        <View
                            className='rounded-2xl overflow-hidden'
                            style={{
                                backgroundColor: isDark ? '#18181b' : '#ffffff',
                                borderWidth: 1,
                                borderColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(229, 231, 235, 0.8)',
                            }}
                        >
                            <NotificationSetting />
                            <Separator isDark={isDark} />
                            <AppearanceSetting />
                            <Separator isDark={isDark} />
                            <Preferences />
                            <Separator isDark={isDark} />
                            <SwitchSitesSetting />
                        </View>
                    </Animated.View>

                    {/* Logout */}
                    <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                        <LogOutButton />
                    </Animated.View>

                    {/* App Info */}
                    <Animated.View
                        entering={FadeInDown.delay(500).duration(400)}
                        className='flex flex-col justify-center items-center pt-4 gap-2'
                    >
                        <Text
                            className='text-xl font-cal-sans'
                            style={{ color: isDark ? '#818CF8' : '#6366F1' }}
                        >
                            Beam
                        </Text>
                        <Text className='text-xs text-muted-foreground'>
                            by Mjara • Version 1.0.0
                        </Text>
                    </Animated.View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Section Header Component
const SectionHeader = ({
    icon: Icon,
    title,
    isDark
}: {
    icon: any,
    title: string,
    isDark: boolean
}) => (
    <View className='flex-row items-center gap-2 pl-1'>
        <Icon size={14} color={isDark ? '#71717a' : '#a1a1aa'} strokeWidth={2} />
        <Text className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
            {title}
        </Text>
    </View>
);

// Separator Component
const Separator = ({ isDark }: { isDark: boolean }) => (
    <View
        className="h-px ml-4"
        style={{ backgroundColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(229, 231, 235, 0.8)' }}
    />
);

export const ErrorBoundary = CommonErrorBoundary;