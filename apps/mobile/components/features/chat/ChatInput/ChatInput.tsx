import { Keyboard, Pressable, ScrollView, View } from "react-native"
import AdditionalInputs from "./AdditionalInputs"
import { Send } from "lucide-react-native"
import { useColorScheme } from "@hooks/useColorScheme"
import SendItem from "./SendItem"
import { useAtom, useSetAtom } from 'jotai'
import { CustomFile } from "@raven/types/common/File"
import { useCallback, useState } from "react"
import { filesAtomFamily, selectedReplyMessageAtomFamily } from "@lib/ChatInputUtils"
import { useSendMessage } from "@hooks/useSendMessage"
import { MentionInput, replaceMentionValues } from 'react-native-controlled-mentions'
import markdownit from 'markdown-it'
import useSiteContext from "@hooks/useSiteContext"
import TypingIndicator from "./TypingIndicator"
import { UserMentions } from "./mentions"
import ReplyMessagePreview from "./ReplyMessagePreview"
import AIEventIndicator from "./AIEventIndicator"
import { useTyping } from "@raven/lib/hooks/useTypingIndicator"
import * as ContextMenu from 'zeego/context-menu'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor
} from 'react-native-reanimated'

interface ChatInputProps {
    channelID: string
    onSendMessage?: () => void
}

const ChatInput = ({ channelID, onSendMessage }: ChatInputProps) => {

    const { onUserType, stopTyping } = useTyping(channelID)
    const [content, setContent] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const siteInfo = useSiteContext()
    const siteID = siteInfo?.sitename ?? ''

    const setSelectedMessage = useSetAtom(selectedReplyMessageAtomFamily(siteID + channelID))

    const cleanupAfterSendingMessage = useCallback(() => {
        setContent('')
        onSendMessage?.()
        stopTyping()
        setSelectedMessage(null)
    }, [onSendMessage, setSelectedMessage, stopTyping])

    const { sendMessage, loading } = useSendMessage(siteID, channelID as string, cleanupAfterSendingMessage)

    const { colors, colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    // Animation values
    const inputScale = useSharedValue(1)
    const sendButtonScale = useSharedValue(1)
    const focusAnim = useSharedValue(0)

    const animatedInputStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            focusAnim.value,
            [0, 1],
            [isDark ? '#27272a' : '#e4e4e7', isDark ? '#59168B' : '#3C0366']
        )
        return {
            borderColor,
            borderWidth: 1.5,
            transform: [{ scale: inputScale.value }],
        }
    })

    const animatedSendStyle = useAnimatedStyle(() => ({
        transform: [{ scale: sendButtonScale.value }],
    }))

    const handleFocus = () => {
        setIsFocused(true)
        focusAnim.value = withTiming(1, { duration: 200 })
    }

    const handleBlur = () => {
        setIsFocused(false)
        focusAnim.value = withTiming(0, { duration: 200 })
    }

    const onSend = (sendSilently: boolean = false) => {
        // Animate send button
        sendButtonScale.value = withSpring(0.8, { damping: 10 })
        setTimeout(() => {
            sendButtonScale.value = withSpring(1, { damping: 8 })
        }, 100)

        const replacedValue = replaceMentionValues(content, (mention) => {
            if (mention.trigger === '@') {
                return `<span data-type="userMention" class="mention" data-id="${mention.id}" data-label="${mention.name}">@${mention.name}</span>`
            }

            if (mention.trigger === '#') {
                return `<span data-type="channelMention" class="mention" data-id="${mention.id}" data-label="${mention.name}">#${mention.name}</span>`
            }

            return mention.original
        })

        const md = markdownit({ breaks: true, linkify: true, html: true })
        let html = md.render(replacedValue)

        sendMessage(html, false, sendSilently)
            .then(() => {
                Keyboard.dismiss()
            })
    }

    const onMessageContentSend = (content: string) => {
        sendMessage(content, true)
    }

    const onContentChange = useCallback((text: string) => {
        onUserType()
        setContent(text)
    }, [onUserType])

    const hasContent = content.trim().length > 0

    return (
        <View
            className="flex flex-col gap-2 pt-4 pb-8 px-6 mb-[2px]"
            style={{
                backgroundColor: isDark ? '#09090b' : '#ffffff',
                borderTopWidth: 1,
                borderTopColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(229, 231, 235, 0.8)',
            }}
        >
            <AIEventIndicator channelID={channelID} />
            <TypingIndicator channel={channelID} />
            {siteID && <ReplyMessagePreview channelID={channelID} siteID={siteID} />}
            {siteID && <FileScroller channelID={channelID} siteID={siteID} />}

            <View className="flex-row items-end gap-3">
                <AdditionalInputs channelID={channelID} onMessageContentSend={onMessageContentSend} />

                <Animated.View
                    style={[animatedInputStyle, { flex: 1 }]}
                    className={`rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}`}
                >
                    <MentionInput
                        value={content}
                        multiline
                        placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                        placeholder="Type a message..."
                        onChange={onContentChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        partTypes={[
                            {
                                isBottomMentionSuggestionsRender: false,
                                trigger: '@',
                                renderSuggestions: (props) => <UserMentions {...props} channelID={channelID} />,
                                textStyle: { fontWeight: '600', color: isDark ? '#59168B' : '#3C0366' },
                            },
                            {
                                pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
                                textStyle: { color: isDark ? '#59168B' : '#3C0366', fontSize: 16 },
                            },
                        ]}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: colors.foreground,
                            maxHeight: 150,
                            fontSize: 16,
                            lineHeight: 22,
                        }}
                        containerStyle={{
                            position: 'static'
                        }}
                    />
                </Animated.View>
                {/* <View style={{ height: 20 }} /> */}

                {/* Send Button */}
                <View className="flex-shrink-0 mb-1" style={{ minWidth: 40, width: 40 }}>
                    <ContextMenu.Root>
                        <ContextMenu.Trigger>
                            <Animated.View style={animatedSendStyle}>
                                <Pressable
                                    disabled={loading || !hasContent}
                                    android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
                                    className="w-10 h-10 flex items-center justify-center rounded-full"
                                    // style={{
                                    //     backgroundColor: hasContent
                                    //         ? (isDark ? '#7B2FA0' : '#59168B')
                                    //         : (isDark ? '#3f3f46' : '#e4e4e7'),
                                    // }}
                                    hitSlop={15}
                                    onPress={() => onSend()}
                                    onLongPress={() => { }}
                                >
                                    <Send
                                        size={18}
                                        color={(isDark ? '#a1a1aa' : '#52525b')}
                                        strokeWidth={2.5}
                                    />
                                </Pressable>
                            </Animated.View>
                        </ContextMenu.Trigger>
                        <ContextMenu.Content>
                            <ContextMenu.Item key="silent" onSelect={() => onSend(true)}>
                                <ContextMenu.ItemTitle>Send without notification</ContextMenu.ItemTitle>
                                <ContextMenu.ItemIcon
                                    ios={{
                                        name: 'bell.slash',
                                        pointSize: 14,
                                        weight: 'semibold',
                                        scale: 'medium',
                                        hierarchicalColor: {
                                            dark: colors.icon,
                                            light: colors.icon,
                                        },
                                        paletteColors: [
                                            {
                                                dark: colors.icon,
                                                light: colors.icon,
                                            },
                                        ],
                                    }}
                                />
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Root>
                </View>
            </View>
        </View>
    )
}

const FileScroller = ({ channelID, siteID }: { channelID: string, siteID: string }) => {
    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const [files, setFiles] = useAtom(filesAtomFamily(siteID + channelID))

    const removeFile = (file: CustomFile) => {
        setFiles((prevFiles: CustomFile[]) => {
            return prevFiles.filter((f) => f.fileID !== file.fileID)
        })
    }

    if (files.length === 0) return null

    return (
        <View
            className="px-3 pt-2"
            style={{
                borderTopWidth: 1,
                borderTopColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(229, 231, 235, 0.8)',
            }}
        >
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 justify-start items-start py-2 pr-2">
                    {files.map((file: CustomFile) => (
                        <SendItem
                            key={file.fileID}
                            file={file}
                            numberOfFiles={files.length}
                            removeFile={removeFile}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

export default ChatInput