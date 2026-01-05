import { Divider } from '@components/layout/Divider'
import { Sheet } from '@components/nativewindui/Sheet'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { Pressable, View } from 'react-native'
import { SiteAuthFlowSheet } from './AddSite'
import { Text } from '@components/nativewindui/Text'
import { Avatar, AvatarImage } from '@components/nativewindui/Avatar'
import { useSiteSwitcher } from '@hooks/useSiteSwitcher'
import { useColorScheme } from '@hooks/useColorScheme'
import { StaggeredItem, AnimatedPressableScale } from '@components/common/AnimatedComponents'
import ChevronRightIcon from '@assets/icons/ChevronRightIcon.svg'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

const SitesList = () => {

    const { colors, colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const { sites, siteInformation, handleSitePress, clearSiteInformation, hasSites, bottomSheetRef } = useSiteSwitcher()

    if (!hasSites) {
        return (
            <></>
        )
    }

    const siteEntries = Object.entries(sites)

    return (
        <>
            <View className='flex w-full gap-3'>
                <Animated.View entering={FadeIn.duration(400)}>
                    <Text className='text-foreground text-base font-medium'>Your Workspaces</Text>
                </Animated.View>

                <View className='gap-2'>
                    {siteEntries.map(([siteName, siteInfo], index) => (
                        <StaggeredItem key={siteName} index={index} staggerDelay={80}>
                            <AnimatedPressableScale
                                scaleValue={0.98}
                                onPress={() => handleSitePress(siteName)}
                                className='rounded-2xl overflow-hidden'
                                style={{
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                }}
                            >
                                <View
                                    className='flex flex-row px-4 py-3.5 items-center justify-between'
                                    style={{
                                        borderWidth: 1,
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: 16,
                                    }}
                                >
                                    <View className='flex-row items-center gap-3'>
                                        <View
                                            className='rounded-xl overflow-hidden'
                                            style={{
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.08,
                                                shadowRadius: 4,
                                                elevation: 2,
                                            }}
                                        >
                                            <Avatar alt="Site Logo" className='w-12 h-12'>
                                                <AvatarImage source={{ uri: (siteInfo.url) + (siteInfo.logo) }} />
                                            </Avatar>
                                        </View>
                                        <View>
                                            <Text className='text-base font-semibold text-foreground'>{siteInfo.app_name}</Text>
                                            <Text className='text-sm text-muted-foreground'>{siteInfo.url.replace('https://', '')}</Text>
                                        </View>
                                    </View>
                                    <View className='flex-row h-10 items-center'>
                                        <ChevronRightIcon
                                            height={22}
                                            width={22}
                                            fill={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'}
                                        />
                                    </View>
                                </View>
                            </AnimatedPressableScale>
                        </StaggeredItem>
                    ))}
                </View>

                {/* Animated Divider */}
                <Animated.View
                    entering={FadeInDown.delay(siteEntries.length * 80 + 100).duration(400)}
                    className='w-full flex-row items-center gap-3 pt-2'
                >
                    <View className='flex-1 h-[1px] overflow-hidden'>
                        <LinearGradient
                            colors={isDark
                                ? ['transparent', 'rgba(255,255,255,0.15)', 'transparent']
                                : ['transparent', 'rgba(0,0,0,0.08)', 'transparent']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ flex: 1 }}
                        />
                    </View>
                    <Text className='text-muted-foreground text-sm'>or add a new site</Text>
                    <View className='flex-1 h-[1px] overflow-hidden'>
                        <LinearGradient
                            colors={isDark
                                ? ['transparent', 'rgba(255,255,255,0.15)', 'transparent']
                                : ['transparent', 'rgba(0,0,0,0.08)', 'transparent']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ flex: 1 }}
                        />
                    </View>
                </Animated.View>
            </View>

            <Sheet ref={bottomSheetRef} snapPoints={[420]} onDismiss={clearSiteInformation}>
                <BottomSheetView className='pb-16'>
                    {siteInformation && <SiteAuthFlowSheet siteInformation={siteInformation} onDismiss={clearSiteInformation} />}
                </BottomSheetView>
            </Sheet>
        </>
    )
}

export default SitesList