import { Sheet } from '@components/nativewindui/Sheet'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { View } from 'react-native'
import { SiteAuthFlowSheet } from './AddSite'
import { Text } from '@components/nativewindui/Text'
import { Avatar, AvatarImage } from '@components/nativewindui/Avatar'
import { useSiteSwitcher } from '@hooks/useSiteSwitcher'
import { useMemo } from 'react'
import useSiteContext from '@hooks/useSiteContext'
import ChevronRightIcon from '@assets/icons/ChevronRightIconThin.svg'
import { useColorScheme } from '@hooks/useColorScheme'
import PlusIcon from '@assets/icons/PlusIcon.svg'
import ServerIcon from '@assets/icons/ServerIcon.svg'
import { AnimatedPressableScale, StaggeredItem } from '@components/common/AnimatedComponents'
import Animated, { FadeIn } from 'react-native-reanimated'

const SiteSwitcher = ({ openAddSiteSheet }: { openAddSiteSheet: () => void }) => {

    const currentSite = useSiteContext()

    const { colors, colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    const { sites, siteInformation, handleSitePress, clearSiteInformation, hasSites, bottomSheetRef } = useSiteSwitcher()

    const otherSites = useMemo(() => {
        const otherSites = []
        for (const siteName in sites) {
            if (siteName !== currentSite?.sitename) {
                otherSites.push(sites[siteName])
            }
        }
        return otherSites
    }, [sites, currentSite])

    if (!hasSites) {
        return (
            <></>
        )
    }

    return (
        <>
            <View className='flex w-full gap-3'>
                <Animated.View entering={FadeIn.duration(300)}>
                    <Text className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
                        Switch Workspace
                    </Text>
                </Animated.View>

                <View className='gap-2'>
                    {otherSites.map((siteInfo, index) => (
                        <StaggeredItem key={siteInfo.sitename} index={index} staggerDelay={60}>
                            <AnimatedPressableScale
                                scaleValue={0.98}
                                onPress={() => handleSitePress(siteInfo.sitename)}
                                className='rounded-xl overflow-hidden'
                                style={{
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                    borderWidth: 1,
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                                }}
                            >
                                <View className='flex flex-row px-3.5 py-3 items-center justify-between'>
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
                                            <Avatar alt="Site Logo" className='w-11 h-11'>
                                                <AvatarImage source={{ uri: (siteInfo.url) + (siteInfo.logo) }} />
                                            </Avatar>
                                        </View>
                                        <View>
                                            <Text className='text-base font-semibold text-foreground'>{siteInfo.app_name}</Text>
                                            <Text className='text-sm text-muted-foreground'>{siteInfo.url.replace('https://', '')}</Text>
                                        </View>
                                    </View>
                                    <View className='flex-row items-center'>
                                        <ChevronRightIcon
                                            height={20}
                                            width={20}
                                            color={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'}
                                        />
                                    </View>
                                </View>
                            </AnimatedPressableScale>
                        </StaggeredItem>
                    ))}

                    {/* Add Site Button */}
                    <StaggeredItem index={otherSites.length} staggerDelay={60}>
                        <AnimatedPressableScale
                            scaleValue={0.98}
                            onPress={openAddSiteSheet}
                            className='rounded-xl overflow-hidden'
                            style={{
                                backgroundColor: isDark ? 'rgba(91, 159, 219, 0.1)' : 'rgba(77, 163, 255, 0.08)',
                                borderWidth: 1,
                                borderColor: isDark ? 'rgba(91, 159, 219, 0.2)' : 'rgba(77, 163, 255, 0.15)',
                                borderStyle: 'dashed',
                            }}
                        >
                            <View className='flex flex-row px-3.5 py-3 items-center justify-between'>
                                <View className='flex-row items-center gap-3'>
                                    <View
                                        className='h-11 w-11 flex items-center justify-center rounded-xl'
                                        style={{
                                            backgroundColor: isDark ? 'rgba(91, 159, 219, 0.15)' : 'rgba(77, 163, 255, 0.12)',
                                        }}
                                    >
                                        <ServerIcon height={22} width={22} fill={colors.primary} />
                                    </View>
                                    <Text className='text-base font-medium text-primary'>Add New Site</Text>
                                </View>
                                <View className='flex-row items-center'>
                                    <View
                                        className='w-7 h-7 rounded-full items-center justify-center'
                                        style={{
                                            backgroundColor: isDark ? 'rgba(91, 159, 219, 0.2)' : 'rgba(77, 163, 255, 0.15)',
                                        }}
                                    >
                                        <PlusIcon height={16} width={16} fill={colors.primary} />
                                    </View>
                                </View>
                            </View>
                        </AnimatedPressableScale>
                    </StaggeredItem>
                </View>
            </View>

            <Sheet ref={bottomSheetRef} snapPoints={[420]} onDismiss={clearSiteInformation}>
                <BottomSheetView className='pb-16'>
                    {siteInformation && <SiteAuthFlowSheet siteInformation={siteInformation} onDismiss={clearSiteInformation} />}
                </BottomSheetView>
            </Sheet>
        </>
    )
}

export default SiteSwitcher