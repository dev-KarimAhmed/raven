import React, { useMemo, useEffect, useRef } from 'react';
import { Stack, Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Home, MessageCircle, MessagesSquare, User, LucideIcon } from 'lucide-react-native';
import { useColorScheme } from '@hooks/useColorScheme';
import useUnreadThreadsCount from '@hooks/useUnreadThreadsCount';
import useUnreadMessageCount from '@hooks/useUnreadMessageCount';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

// Premium Animated Tab Icon Component
const AnimatedTabIcon = ({
    IconComponent,
    focused,
    dark,
    hasBadge = false,
}: {
    IconComponent: any;
    focused: boolean;
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
                withSpring(1.25, { damping: 6, stiffness: 400 }),
                withSpring(0.9, { damping: 8, stiffness: 350 }),
                withSpring(1.05, { damping: 10, stiffness: 400 })
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
                    withTiming(1.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
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

    // Colors based on focus and theme
    const iconColor = focused
        ? (dark ? '#59168B' : '#3C0366')  // Indigo when focused
        : (dark ? 'rgba(161, 161, 170, 0.8)' : 'rgba(113, 113, 122, 0.7)'); // Zinc gray when not

    return (
        <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            {/* Glow effect behind focused icon */}
            {focused && (
                <View
                    style={{
                        position: 'absolute',
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: dark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                    }}
                />
            )}

            <Animated.View style={animatedStyle}>
                <IconComponent
                    size={focused ? 26 : 24}
                    color={iconColor}
                    strokeWidth={focused ? 2.5 : 1.8}
                />
            </Animated.View>

            {/* Animated Badge */}
            <Animated.View
                style={[
                    badgeAnimatedStyle,
                    {
                        position: 'absolute',
                        top: -4,
                        right: -8,
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: dark ? '#F472B6' : '#EC4899', // Pink accent
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: dark ? '#09090b' : '#ffffff',
                        shadowColor: dark ? '#F472B6' : '#EC4899',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 6,
                    }
                ]}
            />
        </View>
    );
};

export default function TabLayout() {

    const { colors, colorScheme } = useColorScheme();
    const dark = colorScheme === "dark";

    // Premium glass-morphism tab bar style
    const tabBarStyle = {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: dark ? 'rgba(9, 9, 11, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        borderTopWidth: 0,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        height: Platform.OS === 'ios' ? 88 : 70,
        // Premium shadow
        shadowColor: dark ? '#000000' : '#3C0366',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: dark ? 0.5 : 0.08,
        shadowRadius: 24,
        elevation: 25,
        // Subtle top border glow
        borderTopColor: dark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.08)',
    };

    const headerStyle = {
        backgroundColor: dark ? '#09090b' : '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: dark ? 'rgba(39, 39, 42, 0.8)' : 'rgba(229, 231, 235, 0.8)',
    };

    const { data: unreadThreads } = useUnreadThreadsCount();
    const { unread_count } = useUnreadMessageCount();

    const { hasUnreadMessages, hasUnreadDMs } = useMemo(() => {
        return {
            hasUnreadMessages: unread_count?.message.some(item => item.unread_count > 0),
            hasUnreadDMs: unread_count?.message.some(item => item.unread_count > 0 && item.is_direct_message === 1),
        };
    }, [unread_count]);

    const hasUnreadThreads = useMemo(() => {
        return unreadThreads?.message.some(item => item.unread_count > 0);
    }, [unreadThreads]);

    const getAnimatedTabIcon = (
        IconComponent: any,
        hasBadge: boolean = false
    ) => {
        return ({ focused }: { focused: boolean }) => (
            <AnimatedTabIcon
                IconComponent={IconComponent}
                focused={focused}
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
                    tabBarActiveTintColor: dark ? '#59168B' : '#3C0366', // Indigo
                    tabBarInactiveTintColor: dark ? '#71717A' : '#A1A1AA', // Zinc
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                        letterSpacing: 0.2,
                        marginTop: 4,
                    },
                    tabBarItemStyle: {
                        paddingVertical: 4,
                    },
                    // Smooth screen transition animations
                    animation: 'fade',
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        headerStyle,
                        tabBarIcon: getAnimatedTabIcon(Home, hasUnreadMessages),
                    }}
                />
                <Tabs.Screen
                    name="direct-messages"
                    options={{
                        title: 'Messages',
                        headerShown: false,
                        headerStyle,
                        tabBarIcon: getAnimatedTabIcon(MessageCircle, hasUnreadDMs),
                    }}
                />
                <Tabs.Screen
                    name="threads"
                    options={{
                        title: 'Threads',
                        headerShown: false,
                        headerStyle,
                        tabBarIcon: getAnimatedTabIcon(MessagesSquare, hasUnreadThreads),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        headerStyle,
                        tabBarIcon: getAnimatedTabIcon(User, false),
                    }}
                />
            </Tabs>
        </>
    );
}