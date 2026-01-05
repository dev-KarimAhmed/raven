import { Pressable, View } from 'react-native';
import Animated, { LayoutAnimationConfig, ZoomInRotate } from 'react-native-reanimated';
import { cn } from '@lib/cn';
import { AtSign } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFrappeEventListener, useFrappeGetCall } from 'frappe-react-sdk';
import { useColorScheme } from '@hooks/useColorScheme';
import { Text } from '@components/nativewindui/Text';

export function ViewMentionsButton() {

    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const { data: mentionsCount, mutate } = useFrappeGetCall<{ message: number }>('raven.api.mentions.get_unread_mention_count', undefined, undefined, {
        revalidateOnFocus: true,
        focusThrottleInterval: 1000 * 60 * 5,
    })

    useFrappeEventListener('raven_mention', () => {
        mutate()
    })

    const onViewMentions = () => {
        mutate({ message: 0 }, { revalidate: false })
        router.push('../home/mentions', { relativeToDirectory: true })
    }

    const hasUnread = mentionsCount && mentionsCount.message > 0

    return (
        <LayoutAnimationConfig skipEntering>
            <Animated.View
                className="items-center justify-center"
                key={"view-notifications"}
                entering={ZoomInRotate}>
                <Pressable
                    hitSlop={10}
                    onPress={onViewMentions}
                    className="p-2 rounded-xl relative"
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    })}
                >
                    {({ pressed }) => (
                        <View className={cn(pressed && 'opacity-70')}>
                            <AtSign
                                size={20}
                                color="rgba(255, 255, 255, 0.9)"
                                strokeWidth={2.5}
                            />
                            {hasUnread && (
                                <View
                                    className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full items-center justify-center px-1"
                                    style={{
                                        backgroundColor: isDark ? 'rgb(255, 82, 82)' : 'rgb(255, 59, 48)',
                                    }}
                                >
                                    <Text className="text-white text-[10px] font-bold">
                                        {mentionsCount.message > 9 ? '9+' : mentionsCount.message}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </Pressable>
            </Animated.View>
        </LayoutAnimationConfig>
    )
}