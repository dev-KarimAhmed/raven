import { Pressable, View } from 'react-native'
import { Text } from '@components/nativewindui/Text'
import { ThreadMessage } from './ThreadTabs'
import { useGetUserRecords } from '@raven/lib/hooks/useGetUserRecords'
import { useCurrentChannelData } from '@hooks/useCurrentChannelData'
import { useMemo } from 'react'
import { DMChannelListItem } from '@raven/types/common/ChannelListItem'
import { BaseMessageItem } from '../chat-stream/BaseMessageItem'
import { Message } from '@raven/types/common/Message'
import { formatDateAndTime } from '@raven/lib/utils/dateConversions'
import { ChannelIcon } from '../channels/ChannelList/ChannelIcon'
import { useColorScheme } from '@hooks/useColorScheme'
import ViewThreadParticipants from './ViewThreadParticipants'
import { useRouteToThread } from '@hooks/useRouting'
import { ChevronRight, MessageSquare } from 'lucide-react-native'

const ThreadPreviewBox = ({ thread, unreadCount }: { thread: ThreadMessage, unreadCount?: number }) => {

    const users = useGetUserRecords()
    const { channel } = useCurrentChannelData(thread.channel_id)
    const channelData = channel?.channelData
    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const channelDetails = useMemo(() => {
        if (channelData) {
            if (channelData.is_direct_message) {
                const peer_user_name = users[(channelData as DMChannelListItem).peer_user_id]?.full_name ?? (channelData as DMChannelListItem).peer_user_id
                return {
                    channelIcon: '',
                    channelName: `DM with ${peer_user_name}`
                }
            } else {
                return {
                    channelIcon: channelData.type,
                    channelName: channelData.channel_name
                }
            }
        } else {
            return {
                channelIcon: '',
                channelName: 'Deleted Channel'
            }
        }
    }, [channelData, users])

    const routeToThread = useRouteToThread()

    const handleNavigateToThread = () => {
        routeToThread(thread.name)
    }

    const isUnread = unreadCount && unreadCount > 0

    return (
        <View className='flex flex-col'>
            <Pressable
                onPress={handleNavigateToThread}
                className='py-3'
                style={({ pressed }) => ({
                    backgroundColor: pressed
                        ? (isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)')
                        : 'transparent',
                })}
            >
                <View className='flex flex-col gap-2'>
                    {/* Header Row */}
                    <View className='flex flex-row px-4 items-center justify-between'>
                        <View className='flex flex-row items-center gap-2'>
                            {/* Channel Info */}
                            <View
                                className='flex-row items-center gap-1.5 px-2 py-1 rounded-lg'
                                style={{
                                    backgroundColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                                }}
                            >
                                {channelDetails?.channelIcon && (
                                    <ChannelIcon
                                        type={channelDetails.channelIcon as "Private" | "Public" | "Open"}
                                        fill={isDark ? '#a1a1aa' : '#71717a'}
                                        size={12}
                                    />
                                )}
                                <Text className='text-xs font-medium text-muted-foreground'>
                                    {channelDetails?.channelName}
                                </Text>
                            </View>

                            {/* Timestamp */}
                            <Text className='text-xs text-muted-foreground'>
                                {formatDateAndTime(thread.creation)}
                            </Text>
                        </View>

                        {/* Unread Badge or Chevron */}
                        {isUnread ? (
                            <View
                                className="min-w-5 h-5 rounded-full items-center justify-center px-1.5"
                                style={{ backgroundColor: isDark ? '#818CF8' : '#6366F1' }}
                            >
                                <Text className="text-white text-xs font-bold">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Text>
                            </View>
                        ) : (
                            <ChevronRight size={16} color={isDark ? '#52525b' : '#d4d4d8'} />
                        )}
                    </View>

                    {/* Message Content */}
                    <BaseMessageItem message={thread as unknown as Message} />

                    {/* Footer: Participants + Reply Count */}
                    <View className='flex flex-row items-center gap-3 pl-16 pr-4'>
                        <ViewThreadParticipants participants={thread.participants ?? []} />

                        <View
                            className='flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg'
                            style={{
                                backgroundColor: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.08)',
                            }}
                        >
                            <MessageSquare size={12} color={isDark ? '#818CF8' : '#6366F1'} strokeWidth={2.5} />
                            <Text
                                className='text-xs font-semibold'
                                style={{ color: isDark ? '#818CF8' : '#6366F1' }}
                            >
                                {thread.reply_count ?? 0} {thread.reply_count === 1 ? 'Reply' : 'Replies'}
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>

            {/* Separator */}
            <View
                className="h-px mx-4"
                style={{ backgroundColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(229, 231, 235, 0.8)' }}
            />
        </View>
    )
}

export default ThreadPreviewBox