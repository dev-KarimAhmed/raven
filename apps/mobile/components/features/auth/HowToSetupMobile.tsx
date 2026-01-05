import { Text } from '@components/nativewindui/Text'
import { TouchableOpacity, View } from 'react-native'
import InfoIcon from '@assets/icons/InfoIcon.svg'
import { useColorScheme } from '@hooks/useColorScheme'
import { Sheet, useSheetRef } from '@components/nativewindui/Sheet'
import { useCallback } from 'react'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { Button } from '@components/nativewindui/Button'
import { FadeInView, AnimatedPressableScale, PulsingView } from '@components/common/AnimatedComponents'
import CheckIcon from '@assets/icons/CheckIcon.svg'
import SettingsIcon from '@assets/icons/SettingsIcon.svg'
import Animated, { FadeIn } from 'react-native-reanimated'

const HowToSetupMobile = () => {

    const { colors, colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const infoSheetRef = useSheetRef()

    const onPress = useCallback(() => {
        infoSheetRef.current?.present()
    }, [])

    const onDismiss = useCallback(() => {
        infoSheetRef.current?.dismiss()
    }, [])

    return (
        <View className='mt-2'>
            <AnimatedPressableScale
                scaleValue={0.98}
                className='flex-row items-center gap-1.5 py-2'
                onPress={onPress}
            >
                <PulsingView minOpacity={0.5} maxOpacity={1} duration={2000}>
                    <InfoIcon height={16} width={16} fill={colors.primary} />
                </PulsingView>
                <Text className='text-sm text-primary'>How do I setup my site for Raven mobile?</Text>
            </AnimatedPressableScale>

            <Sheet enableDynamicSizing ref={infoSheetRef}>
                <BottomSheetView className='pb-10'>
                    <HowToSetupMobileContent onDismiss={onDismiss} />
                </BottomSheetView>
            </Sheet>
        </View>
    )
}

const HowToSetupMobileContent = ({ onDismiss }: { onDismiss: () => void }) => {

    const { colors, colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const steps = [
        { number: 1, text: 'Open Raven on your desktop browser' },
        { number: 2, text: 'Go to', highlight: 'Settings > Mobile App' },
        { number: 3, text: 'Click on', highlight: 'Configure OAuth Client' },
    ]

    return (
        <View className='p-5 flex gap-5'>
            {/* Header */}
            <FadeInView delay={0} duration={400} slideDistance={15}>
                <View className='flex-row items-center gap-3'>
                    <View
                        className='p-2.5 rounded-xl'
                        style={{
                            backgroundColor: isDark ? 'rgba(91, 159, 219, 0.15)' : 'rgba(77, 163, 255, 0.1)',
                        }}
                    >
                        <SettingsIcon width={24} height={24} fill={colors.primary} />
                    </View>
                    <Text className='text-xl text-foreground font-bold'>Setup Guide</Text>
                </View>
            </FadeInView>

            {/* Steps */}
            <View className='flex gap-3'>
                {steps.map((step, index) => (
                    <FadeInView key={step.number} delay={100 + index * 80} duration={400} slideDistance={12}>
                        <View
                            className='flex-row items-start gap-3 p-3.5 rounded-xl'
                            style={{
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                            }}
                        >
                            {/* Step Number Badge */}
                            <View
                                className='w-7 h-7 rounded-full items-center justify-center'
                                style={{
                                    backgroundColor: isDark ? 'rgba(91, 159, 219, 0.2)' : 'rgba(77, 163, 255, 0.15)',
                                }}
                            >
                                <Text
                                    className='text-sm font-bold'
                                    style={{ color: colors.primary }}
                                >
                                    {step.number}
                                </Text>
                            </View>
                            <View className='flex-1 pt-0.5'>
                                <Text className='text-base text-foreground'>
                                    {step.text}{' '}
                                    {step.highlight && (
                                        <Text className='text-base text-primary font-semibold'>
                                            {step.highlight}
                                        </Text>
                                    )}
                                </Text>
                            </View>
                        </View>
                    </FadeInView>
                ))}
            </View>

            {/* Info Note */}
            <FadeInView delay={350} duration={400} slideDistance={10}>
                <View
                    className='p-4 rounded-xl'
                    style={{
                        backgroundColor: isDark ? 'rgba(82, 174, 99, 0.1)' : 'rgba(82, 174, 99, 0.08)',
                        borderLeftWidth: 3,
                        borderLeftColor: isDark ? 'rgba(82, 174, 99, 0.6)' : 'rgba(82, 174, 99, 0.5)',
                    }}
                >
                    <View className='flex-row items-start gap-2'>
                        <CheckIcon width={18} height={18} fill='rgb(82, 174, 99)' style={{ marginTop: 2 }} />
                        <View className='flex-1'>
                            <Text className='text-sm text-foreground leading-5'>
                                This creates an OAuth client for secure mobile authentication.
                            </Text>
                            <Text className='text-xs text-muted-foreground mt-1'>
                                Only System Administrators can configure this.
                            </Text>
                        </View>
                    </View>
                </View>
            </FadeInView>

            {/* Close Button */}
            <FadeInView delay={450} duration={400} slideDistance={10}>
                <AnimatedPressableScale
                    scaleValue={0.97}
                    onPress={onDismiss}
                    className='py-3.5 rounded-xl items-center justify-center'
                    style={{
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Text className='text-foreground font-semibold'>Got it</Text>
                </AnimatedPressableScale>
            </FadeInView>
        </View>
    )
}

export default HowToSetupMobile