import { View } from 'react-native';
import { Stack } from 'expo-router';
import ThreadTabs from '@components/features/threads/ThreadTabs';
import { useColorScheme } from '@hooks/useColorScheme';
import CommonErrorBoundary from '@components/common/CommonErrorBoundary';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text } from '@components/nativewindui/Text';
import { MessagesSquare } from 'lucide-react-native';

export default function Threads() {
    const { colors, colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <Stack.Screen options={{
                headerShown: false,
            }} />

            {/* Premium Header */}
            <Animated.View
                entering={FadeInDown.duration(400)}
                className="px-5 pt-4 pb-3"
            >
                <View className="flex-row items-center gap-3">
                    <View
                        className="p-2 rounded-xl"
                        style={{
                            backgroundColor: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                        }}
                    >
                        <MessagesSquare size={24} color={isDark ? '#818CF8' : '#6366F1'} strokeWidth={2} />
                    </View>
                    <View>
                        <Text className="text-2xl font-bold text-foreground">Threads</Text>
                        <Text className="text-sm text-muted-foreground">Track your conversations</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Content */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                className='flex-1 pb-20'
            >
                <ThreadTabs />
            </Animated.View>
        </SafeAreaView>
    );
}

export const ErrorBoundary = CommonErrorBoundary;