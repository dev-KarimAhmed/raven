import { useColorScheme } from "@hooks/useColorScheme"
import useUnreadMessageCount from "@hooks/useUnreadMessageCount"
import { ChannelListContext, ChannelListContextType } from "@raven/lib/providers/ChannelListProvider"
import { useContext, useMemo, useState } from "react"
import { View, ActivityIndicator } from "react-native"
import DMRow from "./DMRow"
import { MessageCircle } from "lucide-react-native"
import ErrorBanner from "@components/common/ErrorBanner"
import SearchInput from "@components/common/SearchInput/SearchInput"
import { useDebounce } from "@raven/lib/hooks/useDebounce"
import { Text } from "@components/nativewindui/Text"
import { LegendList } from "@legendapp/list"
import Animated, { FadeIn } from 'react-native-reanimated'

const AllDMsList = () => {

    const { dm_channels, error, isLoading } = useContext(ChannelListContext) as ChannelListContextType
    const { unread_count } = useUnreadMessageCount()
    const { colors, colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const allDMs = useMemo(() => {
        return dm_channels?.map(dm => ({
            ...dm,
            unread_count: unread_count?.message.find(item => item.name === dm.name)?.unread_count ?? 0
        })) ?? []
    }, [dm_channels, unread_count])

    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery, 250)
    const filteredDMs = useMemo(() => {
        return allDMs.filter(dm => {
            if (!dm.peer_user_id) return false
            return dm.peer_user_id?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        })
    }, [allDMs, debouncedSearchQuery])

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center h-64">
                <ActivityIndicator size="large" color={isDark ? '#818CF8' : '#6366F1'} />
            </View>
        )
    }

    if (error) {
        return <ErrorBanner error={error} />
    }

    return (
        <View className="flex flex-col flex-1">
            {/* Search */}
            <View className="px-4 py-3">
                <SearchInput
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
            </View>

            {/* DM List */}
            <View className='flex-1'>
                <LegendList
                    data={filteredDMs}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
                            <DMRow dm={item} />
                        </Animated.View>
                    )}
                    keyExtractor={(item) => item.name}
                    estimatedItemSize={72}
                    ItemSeparatorComponent={() => (
                        <View
                            className="h-px mx-4"
                            style={{ backgroundColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(229, 231, 235, 0.8)' }}
                        />
                    )}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={<DMListEmptyState searchQuery={searchQuery} />}
                />
            </View>
        </View>
    )
}

const DMListEmptyState = ({ searchQuery }: { searchQuery?: string }) => {
    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    return (
        <View className="flex flex-col gap-4 px-6 py-12 items-center">
            <View
                className="p-4 rounded-2xl"
                style={{
                    backgroundColor: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.08)',
                }}
            >
                <MessageCircle size={40} color={isDark ? '#818CF8' : '#6366F1'} strokeWidth={1.5} />
            </View>
            <View className="items-center gap-2">
                <Text className="text-lg font-semibold text-foreground text-center">
                    {searchQuery ? `No conversations found` : 'No messages yet'}
                </Text>
                <Text className="text-sm text-muted-foreground text-center max-w-64">
                    {searchQuery
                        ? `We couldn't find anyone matching "${searchQuery}"`
                        : `Start a conversation with someone to see it here`}
                </Text>
            </View>
        </View>
    )
}

export default AllDMsList