import { Text } from '@components/nativewindui/Text'
import { useColorScheme } from '@hooks/useColorScheme'
import { View } from 'react-native'
import { Search } from 'lucide-react-native'
import { router } from 'expo-router'
import { AnimatedPressableScale } from '@components/common/AnimatedComponents'

const QuickSearchButton = () => {

    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    return (
        <AnimatedPressableScale
            scaleValue={0.98}
            onPress={() => router.push('../home/quick-search', { relativeToDirectory: true })}
        >
            <View
                className='flex-row items-center gap-2.5 rounded-xl px-4 py-3'
                style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.25)',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.3)',
                }}
            >
                <Search size={18} color="rgba(255, 255, 255, 0.7)" strokeWidth={2.5} />
                <Text
                    className='text-base flex-1'
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    Jump to or search...
                </Text>
                <View
                    className='px-2 py-0.5 rounded-md'
                    style={{
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <Text
                        className='text-xs font-medium'
                        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    >
                        ⌘K
                    </Text>
                </View>
            </View>
        </AnimatedPressableScale>
    )
}

export default QuickSearchButton