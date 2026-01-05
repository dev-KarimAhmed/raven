import { View } from 'react-native';
import { Stack } from 'expo-router';
import ThreadTabs from '@components/features/threads/ThreadTabs';
import { useColorScheme } from '@hooks/useColorScheme';
import CommonErrorBoundary from '@components/common/CommonErrorBoundary';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MessagesSquare } from 'lucide-react-native';
import ScreenHeader from '@components/common/ScreenHeader';

export default function Threads() {
    const { colors } = useColorScheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <ScreenHeader
                title="Threads"
                subtitle="Track your conversations"
                icon={MessagesSquare}
            />

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