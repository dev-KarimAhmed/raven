import { SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeToggle } from '@components/nativewindui/ThemeToggle';
import { useColorScheme } from '@hooks/useColorScheme';
import WorkspaceSwitcher from '@components/features/workspaces/WorkspaceSwitcher';
import { useGetCurrentWorkspace } from '@hooks/useGetCurrentWorkspace';
import { ViewSavedMessagesButton } from '@components/features/saved-messages/ViewSavedMessagesButton';
import QuickSearchButton from '@components/features/search/QuickSearchButton';
import AllChannelsList from '@components/features/channels/ChannelList/AllChannelsList';
import { ViewMentionsButton } from '@components/features/mentions/ViewMentionsButton';
import CommonErrorBoundary from '@components/common/CommonErrorBoundary';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {

    const { colors, colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'
    const { workspace, switchWorkspace } = useGetCurrentWorkspace()

    // Premium Indigo gradient for header
    const headerGradient = isDark
        ? ['#312e81', '#4338ca', '#4f46e5'] as const  // indigo-900, 700, 600
        : ['#4f46e5', '#6366f1', '#818cf8'] as const  // indigo-600, 500, 400

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#312e81' : '#4f46e5' }}>
            {/* Premium Header with Gradient */}
            <View className="relative overflow-hidden">
                <LinearGradient
                    colors={headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}
                />

                {/* Decorative glow orb */}
                <View
                    className="absolute"
                    style={{
                        top: -30,
                        right: -30,
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    }}
                />
                <View
                    className="absolute"
                    style={{
                        bottom: -20,
                        left: -20,
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                />

                <Animated.View
                    entering={FadeInDown.duration(400)}
                    className="flex flex-col px-4 pb-4 pt-2 gap-3 android:pt-12"
                >
                    {/* Top Row: Workspace + Actions */}
                    <View className='flex-row items-center justify-between'>
                        <WorkspaceSwitcher workspace={workspace} setWorkspace={switchWorkspace} />
                        <View className='flex-row items-center gap-1'>
                            <ViewMentionsButton />
                            <ViewSavedMessagesButton />
                            <ThemeToggle />
                        </View>
                    </View>

                    {/* Search Button */}
                    <QuickSearchButton />
                </Animated.View>
            </View>

            {/* Content Area with rounded top */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                }}
                className="rounded-t-[1.5rem]"
            >
                <View
                    className="flex flex-col pt-4"
                    style={{
                        backgroundColor: colors.background,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                    }}
                >
                    <AllChannelsList workspace={workspace} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export const ErrorBoundary = CommonErrorBoundary