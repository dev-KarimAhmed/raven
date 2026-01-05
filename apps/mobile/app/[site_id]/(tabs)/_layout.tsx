import React, { useMemo, useEffect, useRef } from 'react';
import { Stack, Tabs } from 'expo-router';
import { SvgProps } from 'react-native-svg';
import { View } from 'react-native';
import HomeIcon from '@assets/icons/HomeIcon.svg';
import HomeOutlineIcon from '@assets/icons/HomeOutlineIcon.svg';
import ProfileIcon from '@assets/icons/ProfileIcon.svg';
import ProfileOutlineIcon from '@assets/icons/ProfileOutlineIcon.svg';
import ChatIcon from '@assets/icons/ChatIcon.svg';
import ChatOutlineIcon from '@assets/icons/ChatOutlineIcon.svg';
import ThreadsIcon from '@assets/icons/ThreadsIcon.svg';
import ThreadsOutlineIcon from '@assets/icons/ThreadsOutlineIcon.svg';
import { useColorScheme } from '@hooks/useColorScheme'
import { Platform } from 'react-native';
import useUnreadThreadsCount from '@hooks/useUnreadThreadsCount';
import useUnreadMessageCount from '@hooks/useUnreadMessageCount';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';

// Animated Tab Icon Component with bounce effect
const AnimatedTabIcon = ({
    FilledIcon,
    OutlineIcon,
    focused,
    color,
    dark,
    hasBadge = false,
}: {
    FilledIcon: React.FC<SvgProps>;
    OutlineIcon: React.FC<SvgProps>;
    focused: boolean;
    color: string;
    dark: boolean;
    hasBadge?: boolean;
}) => {
    const scale = useSharedValue(1);
    const prevFocused = useRef(focused);
    const badgeScale = useSharedValue(1);
    const badgeOpacity = useSharedValue(hasBadge ? 1 : 0);

    // Bounce animation on focus change
    useEffect(() => {
        if (focused && !prevFocused.current) {
            scale.value = withSequence(
                withSpring(1.18, { damping: 8, stiffness: 500 }),
                withSpring(1, { damping: 10, stiffness: 400 })
            );
        }
        prevFocused.current = focused;
    }, [focused]);

    // Badge pulse animation
    useEffect(() => {
        if (hasBadge) {
            badgeOpacity.value = withTiming(1, { duration: 200 });
            badgeScale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );
        } else {
            badgeOpacity.value = withTiming(0, { duration: 200 });
            badgeScale.value = 1;
        }
    }, [hasBadge]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const badgeAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: badgeScale.value }],
        opacity: badgeOpacity.value,
    }));

    const Icon = focused ? FilledIcon : OutlineIcon;

    return (
        <View style={{ position: 'relative' }}>
            <Animated.View style={animatedStyle}>
                <Icon
                    fill={color}
                    style={{ opacity: focused ? 1 : dark ? 0.7 : 0.6 }}
                    width={24}
                    height={24}
                />
            </Animated.View>
            {/* Custom animated badge */}
            <Animated.View
                style={[
                    badgeAnimatedStyle,
                    {
                        position: 'absolute',
                        top: -2,
                        right: -4,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: dark ? 'rgb(255, 82, 82)' : 'rgb(255, 59, 48)',
                        shadowColor: dark ? 'rgb(255, 82, 82)' : 'rgb(255, 59, 48)',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                    }
                ]}
            />
        </View>
    );
};

export default function TabLayout() {

    const { colors, colorScheme } = useColorScheme()
    const dark = colorScheme == "dark"

    // Premium glass-morphism tab bar style
    const tabBarStyle = {
        backgroundColor: dark ? 'rgba(18, 18, 18, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        borderTopWidth: 0.5,
        borderTopColor: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
        paddingTop: 6,
        paddingBottom: Platform.OS === 'ios' ? 0 : 10,
        height: Platform.OS === 'ios' ? undefined : 65,
        shadowColor: dark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 20,
    }

    const headerStyle = {
        backgroundColor: dark ? 'rgba(18, 18, 18, 0)' : 'rgba(249, 249, 249, 1)',
        borderBottomWidth: 1,
        borderBottomColor: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0)',
    }

    const { data: unreadThreads } = useUnreadThreadsCount()

    const { unread_count } = useUnreadMessageCount()

    const { hasUnreadMessages, hasUnreadDMs } = useMemo(() => {
        return {
            hasUnreadMessages: unread_count?.message.some(item => item.unread_count > 0),
            hasUnreadDMs: unread_count?.message.some(item => item.unread_count > 0 && item.is_direct_message === 1),
        }
    }, [unread_count])

    const hasUnreadThreads = useMemo(() => {
        return unreadThreads?.message.some(item => item.unread_count > 0)
    }, [unreadThreads])

    const getAnimatedTabIcon = (
        FilledIcon: React.FC<SvgProps>,
        OutlineIcon: React.FC<SvgProps>,
        hasBadge: boolean = false
    ) => {
        return ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon
                FilledIcon={FilledIcon}
                OutlineIcon={OutlineIcon}
                focused={focused}
                color={color}
                dark={dark}
                hasBadge={hasBadge}
            />
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false, title: 'Home' }} />
            <Tabs
                screenOptions={{
                    tabBarStyle,
                    tabBarActiveTintColor: dark ? '#FFFFFF' : colors.primary,
                    tabBarInactiveTintColor: dark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.35)',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                        marginTop: 2,
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        headerStyle,
                        tabBarIcon: getAnimatedTabIcon(HomeIcon, HomeOutlineIcon, hasUnreadMessages),
                    }}
                />
                <Tabs.Screen
                    name="direct-messages"
                    options={{
                        title: 'DMs',
                        headerShown: false,
                        headerStyle,
                        tabBarIcon: getAnimatedTabIcon(ChatIcon, ChatOutlineIcon, hasUnreadDMs),
                    }}
                />
                <Tabs.Screen
                    name="threads"
                    options={{
                        title: 'Threads',
                        headerShown: false,
                        headerStyle,
                        tabBarIcon: getAnimatedTabIcon(ThreadsIcon, ThreadsOutlineIcon, hasUnreadThreads),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        headerStyle,
                        tabBarIcon: getAnimatedTabIcon(ProfileIcon, ProfileOutlineIcon, false),
                    }}
                />
            </Tabs>
        </>
    )
}