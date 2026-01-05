import { Divider } from '@components/layout/Divider';
import { ChannelListItem } from '@raven/types/common/ChannelListItem';
import { useMemo, useState } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { Text } from '@components/nativewindui/Text';
import { ChevronDown, ChevronRight, Plus, Hash } from 'lucide-react-native';
import { useColorScheme } from '@hooks/useColorScheme';
import { router } from 'expo-router';
import { ChannelListRow } from './ChannelListRow';
import useCurrentRavenUser from '@raven/lib/hooks/useCurrentRavenUser';
import { AnimatedPressableScale } from '@components/common/AnimatedComponents';
import Animated, { FadeIn } from 'react-native-reanimated';

const ChannelsList = ({ channels }: { channels: ChannelListItem[] }) => {

    const { myProfile } = useCurrentRavenUser()
    const pinnedChannelIDs = myProfile?.pinned_channels?.map(pin => pin.channel_id)

    const filteredChannels = useMemo(() => {
        return channels.filter(channel => !pinnedChannelIDs?.includes(channel.name))
    }, [channels, pinnedChannelIDs])

    return <>
        <ChannelListUI channels={filteredChannels} />
        <Divider prominent />
    </>
}

export const ChannelListUI = ({ channels }: { channels: ChannelListItem[] }) => {

    const [isExpanded, setIsExpanded] = useState(true)
    const { colors, colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const toggleAccordion = () => {
        setIsExpanded((prev) => !prev)
    }

    return (
        <View className="px-3 py-2">
            {/* Header */}
            <TouchableOpacity
                onPress={toggleAccordion}
                activeOpacity={0.7}
                className="flex-row justify-between items-center py-3 px-2"
            >
                <View className="flex-row items-center gap-2">
                    <View
                        className="p-1.5 rounded-lg"
                        style={{
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                        }}
                    >
                        <Hash size={16} color={isDark ? '#a1a1aa' : '#71717a'} strokeWidth={2.5} />
                    </View>
                    <Text className="font-semibold text-base text-foreground">Channels</Text>
                    <View
                        className="px-1.5 py-0.5 rounded-md"
                        style={{
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Text className="text-xs text-muted-foreground font-medium">{channels.length}</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-1">
                    <Pressable
                        hitSlop={10}
                        className='p-2 rounded-lg active:bg-card'
                        onPress={() => router.push('../home/create-channel', { relativeToDirectory: true })}
                    >
                        <Plus size={18} color={colors.icon} strokeWidth={2} />
                    </Pressable>
                    {isExpanded
                        ? <ChevronDown size={20} color={colors.icon} strokeWidth={2} />
                        : <ChevronRight size={20} color={colors.icon} strokeWidth={2} />
                    }
                </View>
            </TouchableOpacity>

            {/* Channel List */}
            {isExpanded && (
                <Animated.View entering={FadeIn.duration(200)} className="gap-0.5">
                    {channels.map((channel) => (
                        <ChannelListRow key={channel.name} channel={channel} />
                    ))}

                    {/* Add Channel Button */}
                    <AnimatedPressableScale
                        scaleValue={0.98}
                        onPress={() => router.push('../home/create-channel', { relativeToDirectory: true })}
                        className="flex-row items-center gap-3 py-2.5 px-3 mt-1 rounded-xl"
                        style={{
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                        }}
                    >
                        <View
                            className="w-8 h-8 rounded-lg items-center justify-center"
                            style={{
                                backgroundColor: isDark ? 'rgba(91, 159, 219, 0.15)' : 'rgba(77, 163, 255, 0.1)',
                                borderWidth: 1,
                                borderColor: isDark ? 'rgba(91, 159, 219, 0.2)' : 'rgba(77, 163, 255, 0.15)',
                                borderStyle: 'dashed',
                            }}
                        >
                            <Plus size={16} color={colors.primary} strokeWidth={2} />
                        </View>
                        <Text className="text-primary font-medium text-base">Add channel</Text>
                    </AnimatedPressableScale>
                </Animated.View>
            )}
        </View>
    )
}

export default ChannelsList
