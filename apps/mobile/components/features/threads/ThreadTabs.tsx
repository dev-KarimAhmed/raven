import { useState } from 'react'
import { View, Pressable } from 'react-native'
import AIThreads from './AIThreads'
import OtherThreads from './OtherThreads'
import ParticipatingThreads from './ParticipatingThreads'
import { Text } from '@components/nativewindui/Text'
import { useColorScheme } from '@hooks/useColorScheme'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    FadeIn
} from 'react-native-reanimated'
import { UserCheck, Users, Bot } from 'lucide-react-native'

export type ThreadMessage = {
    bot: string,
    channel_id: string,
    content: string,
    creation: string,
    file: string,
    hide_link_preview: 0 | 1,
    image_height: string
    image_width: string,
    is_bot_message: 0 | 1,
    last_message_timestamp: string,
    link_doctype: string,
    link_document: string,
    message_type: "Text" | "Image" | "File" | "Poll",
    name: string,
    owner: string,
    poll_id: string,
    text: string,
    thread_message_id: string,
    participants: { user_id: string }[],
    workspace?: string,
    reply_count?: number
}

const tabs = [
    { label: 'Participating', icon: UserCheck },
    { label: 'Other', icon: Users },
    { label: 'AI Agents', icon: Bot },
]

const ThreadTabs = () => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const handleIndexChange = (index: number) => {
        setSelectedIndex(index)
    }

    return (
        <View className='flex-1 flex-col gap-4 pt-2'>
            {/* Premium Tab Bar */}
            <View className='px-4'>
                <View
                    className='flex-row p-1 rounded-2xl'
                    style={{
                        backgroundColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                    }}
                >
                    {tabs.map((tab, index) => {
                        const isActive = selectedIndex === index
                        const IconComponent = tab.icon

                        return (
                            <Pressable
                                key={tab.label}
                                onPress={() => handleIndexChange(index)}
                                className="flex-1"
                            >
                                <Animated.View
                                    className={`flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl ${isActive ? '' : ''
                                        }`}
                                    style={[
                                        isActive && {
                                            backgroundColor: isDark ? '#27272a' : '#ffffff',
                                            shadowColor: isDark ? '#000' : '#6366F1',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: isDark ? 0.3 : 0.1,
                                            shadowRadius: 8,
                                            elevation: 3,
                                        }
                                    ]}
                                >
                                    <IconComponent
                                        size={16}
                                        color={isActive
                                            ? (isDark ? '#818CF8' : '#6366F1')
                                            : (isDark ? '#71717a' : '#a1a1aa')
                                        }
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <Text
                                        className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}
                                        style={{
                                            color: isActive
                                                ? (isDark ? '#fafafa' : '#18181b')
                                                : (isDark ? '#71717a' : '#a1a1aa'),
                                        }}
                                    >
                                        {tab.label}
                                    </Text>
                                </Animated.View>
                            </Pressable>
                        )
                    })}
                </View>
            </View>

            {/* Tab Content */}
            <Animated.View entering={FadeIn.duration(300)} className="flex-1">
                {selectedIndex === 0 && <ParticipatingThreads />}
                {selectedIndex === 1 && <OtherThreads />}
                {selectedIndex === 2 && <AIThreads />}
            </Animated.View>
        </View>
    )
}

export default ThreadTabs