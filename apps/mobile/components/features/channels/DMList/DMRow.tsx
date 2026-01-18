import UserAvatar from "@components/layout/UserAvatar"
import { useColorScheme } from "@hooks/useColorScheme"
import { useIsUserActive } from "@hooks/useIsUserActive"
import useCurrentRavenUser from "@raven/lib/hooks/useCurrentRavenUser"
import { useGetUser } from "@raven/lib/hooks/useGetUser"
import { Link } from "expo-router"
import { useMemo } from "react"
import { Pressable, View } from "react-native"
import { Text } from "@components/nativewindui/Text"
import { DMChannelWithUnreadCount } from "@raven/lib/hooks/useGetChannelUnreadCounts"
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChevronRight } from 'lucide-react-native'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

const DMRow = ({ dm }: { dm: DMChannelWithUnreadCount }) => {

    const { myProfile } = useCurrentRavenUser()
    const user = useGetUser(dm.peer_user_id)
    const isActive = useIsUserActive(dm.peer_user_id)

    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const { lastMessageContent, isSentByUser } = useMemo(() => {
        let isSentByUser = false
        let lastMessageContent = ''
        if (dm.last_message_details) {
            try {
                const parsedDetails = JSON.parse(dm.last_message_details)
                isSentByUser = parsedDetails.owner === myProfile?.name
                lastMessageContent = parsedDetails.content?.trim() || ''
            } catch (e) {
                console.error('Error parsing last_message_details:', e)
            }
        }
        return { lastMessageContent, isSentByUser }
    }, [dm.last_message_details, myProfile?.name])

    const isUnread = dm.unread_count > 0

    return (
        <Link href={`../chat/${dm.name}`} asChild>
            <Pressable
                className='flex flex-row relative items-center gap-3 py-3.5 px-4'
                style={({ pressed }) => ({
                    backgroundColor: pressed
                        ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)')
                        : 'transparent',
                })}
                android_ripple={{ color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderless: false }}
            >
                {/* Unread indicator */}
                {isUnread && (
                    <View
                        style={{
                            width: 8,
                            height: 8,
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            marginTop: -4,
                            borderRadius: 4,
                            backgroundColor: isDark ? '#59168B' : '#3C0366',
                        }}
                    />
                )}

                {/* Avatar */}
                <UserAvatar
                    src={user?.user_image}
                    alt={user?.full_name ?? user?.name ?? dm.peer_user_id}
                    isActive={isActive}
                    isBot={user?.type === 'Bot'}
                    availabilityStatus={user?.availability_status}
                    avatarProps={{ className: 'h-12 w-12' }}
                />

                {/* Content */}
                <View className='flex-1 flex-col gap-0.5'>
                    <View className='flex flex-row justify-between items-center'>
                        <Text
                            className={`text-base text-foreground ${isUnread ? 'font-semibold' : 'font-medium'}`}
                        >
                            {user?.full_name ?? dm.peer_user_id}
                            {myProfile?.name === dm.peer_user_id && (
                                <Text className="text-muted-foreground font-normal"> (You)</Text>
                            )}
                        </Text>
                        {dm.last_message_timestamp && (
                            <LastMessageTimestamp
                                timestamp={dm.last_message_timestamp}
                                isUnread={isUnread}
                            />
                        )}
                    </View>
                    <View className='flex flex-row items-center gap-1 justify-between'>
                        <View
                            style={{ maxHeight: 24, maxWidth: dm.unread_count > 0 ? '85%' : '95%' }}
                            className='flex flex-row items-center gap-1'
                        >
                            {isSentByUser && (
                                <Text
                                    className='text-sm text-muted-foreground'
                                    style={{ fontWeight: isUnread ? '500' : '400' }}
                                >
                                    You:
                                </Text>
                            )}
                            <Text
                                className={`text-sm line-clamp-1 ${isUnread ? 'text-foreground/80' : 'text-muted-foreground'}`}
                                style={{ fontWeight: isUnread ? '500' : '400' }}
                            >
                                {lastMessageContent || 'No messages yet'}
                            </Text>
                        </View>

                        {/* Unread badge or chevron */}
                        {isUnread ? (
                            <View
                                className="min-w-5 h-5 rounded-full items-center justify-center px-1.5"
                                style={{ backgroundColor: isDark ? '#59168B' : '#3C0366' }}
                            >
                                <Text className="text-white text-xs font-bold">
                                    {dm.unread_count > 99 ? '99+' : dm.unread_count}
                                </Text>
                            </View>
                        ) : (
                            <ChevronRight size={16} color={isDark ? '#52525b' : '#d4d4d8'} />
                        )}
                    </View>
                </View>
            </Pressable>
        </Link>
    )
}

interface LastMessageTimestampProps {
    timestamp: string
    isUnread?: boolean
}

const LastMessageTimestamp = ({ timestamp, isUnread }: LastMessageTimestampProps) => {
    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const displayTimestamp = useMemo(() => {
        if (!timestamp) {
            return ''
        }

        const dateObj = dayjs(timestamp)

        if (!dateObj.isValid()) {
            return timestamp
        }

        const today = dayjs()
        const yesterday = today.subtract(1, 'day')

        if (dateObj.isSame(today, 'day')) {
            if (Math.abs(dateObj.diff(today, 'minute')) < 1) {
                return 'just now'
            }
            if (Math.abs(dateObj.diff(today, 'hour')) < 1) {
                return dateObj.fromNow()
            }
            return dateObj.format('HH:mm')
        }

        if (dateObj.isSame(yesterday, 'day')) {
            return 'Yesterday'
        }

        if (dateObj.isSame(today, 'week')) {
            return dateObj.format('ddd')
        }

        if (dateObj.isSame(today, 'year')) {
            return dateObj.format('D MMM')
        }

        return dateObj.format('D MMM YYYY')
    }, [timestamp])

    return (
        <Text
            className={`text-xs ${isUnread ? 'font-medium' : 'font-normal'}`}
            style={{ color: isUnread ? (isDark ? '#59168B' : '#3C0366') : (isDark ? '#71717a' : '#a1a1aa') }}
        >
            {displayTimestamp}
        </Text>
    )
}

export default DMRow