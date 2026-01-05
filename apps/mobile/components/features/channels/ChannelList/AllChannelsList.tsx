import { View } from "react-native"
import PinnedChannelsList from "../PinnedChannelList/PinnedChannelsList"
import UnreadChannelsList from "../UnreadChannelList/UnreadChannelsList"
import { useContext, useMemo } from "react"
import { ChannelListContext, ChannelListContextType } from "@raven/lib/providers/ChannelListProvider"
import { useGetChannelUnreadCounts } from "@raven/lib/hooks/useGetChannelUnreadCounts"
import useUnreadMessageCount from "@hooks/useUnreadMessageCount"
import DMList from "../DMList/DMList"
import ChannelsList from "./ChannelsList"
import Animated, { FadeInDown } from 'react-native-reanimated'

const AllChannelsList = ({ workspace }: { workspace: string }) => {

    const { channels, dm_channels } = useContext(ChannelListContext) as ChannelListContextType
    const { unread_count } = useUnreadMessageCount()

    const workspaceChannels = useMemo(() => {
        return channels.filter((channel) => channel.workspace === workspace)
    }, [channels, workspace])

    const { unreadChannels, readChannels, unreadDMs, readDMs } = useGetChannelUnreadCounts({
        channels: workspaceChannels,
        dm_channels,
        unread_count: unread_count?.message
    })

    return (
        <View className="flex-1">
            {unread_count && (
                <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                    <UnreadChannelsList unreadChannels={unreadChannels} unreadDMs={unreadDMs} />
                </Animated.View>
            )}
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                <PinnedChannelsList channels={readChannels} />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
                <ChannelsList channels={readChannels} />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                <DMList dms={readDMs} />
            </Animated.View>
        </View>
    )
}

export default AllChannelsList