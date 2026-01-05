import { Pressable, View } from 'react-native';
import Animated, { LayoutAnimationConfig, ZoomInRotate } from 'react-native-reanimated';
import { cn } from '@lib/cn';
import { Bookmark } from 'lucide-react-native';
import { router } from 'expo-router';

export function ViewSavedMessagesButton() {
    return (
        <LayoutAnimationConfig skipEntering>
            <Animated.View
                className="items-center justify-center"
                key={"view-saved-messages"}
                entering={ZoomInRotate}>
                <Pressable
                    hitSlop={10}
                    onPress={() => {
                        router.push('../home/saved-messages', { relativeToDirectory: true })
                    }}
                    className="p-2 rounded-xl"
                    style={({ pressed }) => ({
                        backgroundColor: pressed ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    })}
                >
                    {({ pressed }) => (
                        <View className={cn(pressed && 'opacity-70')}>
                            <Bookmark
                                size={20}
                                color="rgba(255, 255, 255, 0.9)"
                                strokeWidth={2}
                            />
                        </View>
                    )}
                </Pressable>
            </Animated.View>
        </LayoutAnimationConfig>
    )
}