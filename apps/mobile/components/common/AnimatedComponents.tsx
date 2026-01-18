import React, { useEffect } from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
    FadeIn,
    FadeInDown,
    FadeInUp,
    SlideInRight,
    interpolate,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================================================
// AnimatedPressableScale - Button/Pressable with scale feedback
// ============================================================================
interface AnimatedPressableScaleProps extends PressableProps {
    scaleValue?: number;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const AnimatedPressableScale = ({
    scaleValue = 0.97,
    children,
    style,
    onPressIn,
    onPressOut,
    ...props
}: AnimatedPressableScaleProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (e: any) => {
        scale.value = withSpring(scaleValue, {
            damping: 15,
            stiffness: 400,
        });
        onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
        scale.value = withSpring(1, {
            damping: 15,
            stiffness: 400,
        });
        onPressOut?.(e);
    };

    return (
        <AnimatedPressable
            style={[animatedStyle, style]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
};

// ============================================================================
// FadeInView - Fade in with optional slide up animation
// ============================================================================
interface FadeInViewProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    slideDistance?: number;
    style?: StyleProp<ViewStyle>;
}

export const FadeInView = ({
    children,
    delay = 0,
    duration = 600,
    slideDistance = 20,
    style,
}: FadeInViewProps) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(slideDistance);

    useEffect(() => {
        opacity.value = withDelay(
            delay,
            withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
        );
        translateY.value = withDelay(
            delay,
            withTiming(0, { duration, easing: Easing.out(Easing.cubic) })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

// ============================================================================
// SlideInView - Slide in from left/right
// ============================================================================
interface SlideInViewProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'left' | 'right';
    distance?: number;
    style?: StyleProp<ViewStyle>;
}

export const SlideInView = ({
    children,
    delay = 0,
    duration = 400,
    direction = 'left',
    distance = 30,
    style,
}: SlideInViewProps) => {
    const translateX = useSharedValue(direction === 'left' ? -distance : distance);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateX.value = withDelay(
            delay,
            withTiming(0, { duration, easing: Easing.out(Easing.cubic) })
        );
        opacity.value = withDelay(
            delay,
            withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

// ============================================================================
// PulsingView - Subtle pulsing glow effect
// ============================================================================
interface PulsingViewProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    minOpacity?: number;
    maxOpacity?: number;
    duration?: number;
}

export const PulsingView = ({
    children,
    style,
    minOpacity = 0.6,
    maxOpacity = 1,
    duration = 1500,
}: PulsingViewProps) => {
    const opacity = useSharedValue(maxOpacity);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(minOpacity, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
                withTiming(maxOpacity, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
            ),
            -1, // infinite
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

// ============================================================================
// BounceView - Bounce animation (for tab icons, etc.)
// ============================================================================
interface BounceViewProps {
    children: React.ReactNode;
    trigger?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const BounceView = ({
    children,
    trigger,
    style,
}: BounceViewProps) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        if (trigger) {
            scale.value = withSequence(
                withSpring(1.15, { damping: 8, stiffness: 400 }),
                withSpring(1, { damping: 8, stiffness: 400 })
            );
        }
    }, [trigger]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

// ============================================================================
// StaggeredList - Helper for staggered animations
// ============================================================================
interface StaggeredItemProps {
    children: React.ReactNode;
    index: number;
    staggerDelay?: number;
    style?: StyleProp<ViewStyle>;
}

export const StaggeredItem = ({
    children,
    index,
    staggerDelay = 100,
    style,
}: StaggeredItemProps) => {
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(-20);

    useEffect(() => {
        const delay = index * staggerDelay;
        opacity.value = withDelay(
            delay,
            withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
        );
        translateX.value = withDelay(
            delay,
            withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

// ============================================================================
// AnimatedGlow - Animated border/shadow glow
// ============================================================================
interface AnimatedGlowProps {
    children: React.ReactNode;
    isActive?: boolean;
    glowColor?: string;
    style?: StyleProp<ViewStyle>;
}

export const AnimatedGlow = ({
    children,
    isActive = false,
    glowColor = 'rgba(77, 163, 255, 0.4)',
    style,
}: AnimatedGlowProps) => {
    const shadowOpacity = useSharedValue(0);

    useEffect(() => {
        shadowOpacity.value = withTiming(isActive ? 1 : 0, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
        });
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        shadowOpacity: interpolate(shadowOpacity.value, [0, 1], [0, 0.8]),
        shadowRadius: interpolate(shadowOpacity.value, [0, 1], [0, 12]),
        elevation: interpolate(shadowOpacity.value, [0, 1], [0, 8]),
    }));

    // Static shadow properties to avoid new architecture issues
    const staticShadowStyle = {
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
    };

    return (
        <Animated.View style={[staticShadowStyle, animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

// Re-export reanimated presets for convenience
export { FadeIn, FadeInDown, FadeInUp, SlideInRight };
