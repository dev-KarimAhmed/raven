import { Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@components/nativewindui/Text';
import AddSite from '@components/features/auth/AddSite';
import SitesList from '@components/features/auth/SitesList';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonErrorBoundary from '@components/common/CommonErrorBoundary';
import { FadeInView, PulsingView } from '@components/common/AnimatedComponents';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';

export default function LandingScreen() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Premium gradient colors
    const gradientColors = isDark
        ? ['#0a0a0a', '#121218', '#1a1a24'] as const
        : ['#ffffff', '#f8fafc', '#f0f4ff'] as const;

    return (
        <>
            <Stack.Screen options={{ title: 'Sites', headerShown: false }} />
            <View className='flex-1 bg-background'>
                {/* Animated Gradient Background */}
                <LinearGradient
                    colors={gradientColors}
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

                {/* Decorative Glow Elements */}
                <View
                    className='absolute'
                    style={{
                        top: 80,
                        left: -50,
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        backgroundColor: isDark ? 'rgba(91, 159, 219, 0.08)' : 'rgba(77, 163, 255, 0.06)',
                    }}
                />
                <View
                    className='absolute'
                    style={{
                        top: 200,
                        right: -80,
                        width: 250,
                        height: 250,
                        borderRadius: 125,
                        backgroundColor: isDark ? 'rgba(255, 52, 95, 0.05)' : 'rgba(255, 40, 84, 0.04)',
                    }}
                />

                <SafeAreaView className='flex-1'>
                    <View className='flex-1 justify-center h-screen pt-24 px-6 gap-3'>
                        {/* Animated Title with Glow */}
                        <FadeInView delay={0} duration={700} slideDistance={30}>
                            <View className='relative'>
                                {/* Glow behind title */}
                                <PulsingView
                                    minOpacity={0.3}
                                    maxOpacity={0.6}
                                    duration={3000}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: -10,
                                        width: 160,
                                        height: 80,
                                        borderRadius: 40,
                                        backgroundColor: isDark ? 'rgba(91, 159, 219, 0.15)' : 'rgba(77, 163, 255, 0.1)',
                                    }}
                                />
                                <Text className='text-5xl font-cal-sans text-foreground'>
                                    Beam
                                </Text>
                            </View>
                        </FadeInView>

                        {/* Subtitle */}
                        <FadeInView delay={200} duration={600} slideDistance={20}>
                            <Text className='text-base text-muted-foreground'>
                                Connect to your Raven workspace
                            </Text>
                        </FadeInView>

                        <View className='h-4' />

                        {/* Sites List with Animation */}
                        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                            <SitesList />
                        </Animated.View>

                        {/* Add Site Component with Animation */}
                        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
                            <AddSite />
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </View>
        </>
    );
}

export const ErrorBoundary = CommonErrorBoundary