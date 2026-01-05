import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from '@hooks/useColorScheme';
import AllDMsList from '@components/features/channels/DMList/AllDMsList';
import CommonErrorBoundary from '@components/common/CommonErrorBoundary';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';
import ScreenHeader from '@components/common/ScreenHeader';

export default function DirectMessages() {
    const { colors } = useColorScheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <ScreenHeader
                title="Messages"
                subtitle="Your conversations"
                icon={MessageCircle}
            />

            {/* Content */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                className='flex-1 pb-20'
            >
                <AllDMsList />
            </Animated.View>
        </SafeAreaView>
    );
}

export const ErrorBoundary = CommonErrorBoundary;
