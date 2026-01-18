import React, { useState, useCallback } from 'react';
import { TextInput, ActivityIndicator, Platform, Keyboard, Pressable, Alert } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';
import { Globe, ChevronRight, XCircle, LogIn } from 'lucide-react-native';
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { CodeChallengeMethod, exchangeCodeAsync, makeRedirectUri, ResponseType, TokenResponse, useAuthRequest } from 'expo-auth-session';
import { router } from 'expo-router';

// Component Imports
import { useSheetRef, Sheet } from "@components/nativewindui/Sheet";
import { Text } from "@components/nativewindui/Text";
import { View } from "react-native";
import { useColorScheme } from "@hooks/useColorScheme";
import { SiteInformation } from "types/SiteInformation";
import HowToSetupMobile from "./HowToSetupMobile";
import { addSiteToStorage, discovery, setDefaultSite, storeAccessToken } from '@lib/auth';
import { Avatar, AvatarImage } from '@components/nativewindui/Avatar';
import { FadeInView, AnimatedPressableScale } from '@components/common/AnimatedComponents';

WebBrowser.maybeCompleteAuthSession();

type Props = {
    useBottomSheet?: boolean;
};

const AddSite = ({ useBottomSheet = false }: Props) => {
    const { colors, colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [siteURL, setSiteURL] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [siteInformation, setSiteInformation] = useState<SiteInformation | null>(null);

    const bottomSheetRef = useSheetRef();
    const focusAnim = useSharedValue(0);

    // Premium Color Interpolation for input border
    const animatedInputStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            focusAnim.value,
            [0, 1],
            [isDark ? '#3f3f46' : '#e4e4e7', colors.primary]
        );

        return {
            borderColor,
            borderWidth: 1.5,
            shadowColor: colors.primary,
            shadowOpacity: focusAnim.value * 0.15,
            shadowRadius: focusAnim.value * 10,
        };
    });

    // Static shadow offset to avoid new architecture issues
    const staticInputShadowStyle = {
        shadowOffset: { width: 0, height: 0 },
    };

    const handleFocus = () => {
        setIsFocused(true);
        focusAnim.value = withTiming(1, { duration: 200 });
    };

    const handleBlur = () => {
        setIsFocused(false);
        focusAnim.value = withTiming(0, { duration: 200 });
    };

    const clearSiteInformation = useCallback(() => {
        setSiteInformation(null);
    }, []);

    const handleAddSite = async () => {
        if (!siteURL.trim()) return;

        Keyboard.dismiss();
        setIsLoading(true);
        if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        let url = siteURL.toLowerCase();
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            url = 'https://' + url;
        }

        try {
            const res = await fetch(`${url}/api/method/raven.api.raven_mobile.get_client_id`);
            const data = await res.json();

            if (data.message && data.message.client_id) {
                setSiteInformation({
                    url,
                    ...data.message
                });
                bottomSheetRef.current?.present();
            } else {
                Alert.alert('Error', 'Failed to fetch site information / OAuth client not set for Beam Mobile');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to fetch site information. Please check the URL and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="gap-4">
            {/* Label */}
            <View className="flex-row items-center gap-2">
                <Globe size={14} color={isDark ? '#71717a' : '#a1a1aa'} />
                <Text className="text-sm font-medium text-muted-foreground">
                    Site URL
                </Text>
            </View>

            {/* Input Field */}
            <Animated.View
                style={[staticInputShadowStyle, animatedInputStyle]}
                className={`flex-row items-center rounded-xl ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'} px-4 h-14`}
            >
                <Text className="text-muted-foreground text-base mr-1">https://</Text>

                {useBottomSheet ? (
                    <BottomSheetTextInput
                        className={`flex-1 text-base ${isDark ? 'text-white' : 'text-black'}`}
                        placeholder="yoursite.frappe.cloud"
                        placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={siteURL}
                        onChangeText={setSiteURL}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                ) : (
                    <TextInput
                        className={`flex-1 text-base ${isDark ? 'text-white' : 'text-black'}`}
                        placeholder="yoursite.frappe.cloud"
                        placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={siteURL}
                        onChangeText={setSiteURL}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                )}

                {siteURL.length > 0 && (
                    <Pressable onPress={() => setSiteURL('')} hitSlop={10}>
                        <XCircle size={18} color={isDark ? '#52525b' : '#d4d4d8'} />
                    </Pressable>
                )}
            </Animated.View>

            {/* Submit Button */}
            <AnimatedPressableScale
                scaleValue={0.97}
                onPress={handleAddSite}
                disabled={!siteURL.trim() || isLoading}
                className={`h-14 rounded-xl flex-row items-center justify-center gap-2 ${!siteURL.trim() || isLoading ? 'bg-primary/50' : 'bg-primary'
                    }`}
                style={{
                    shadowColor: isDark ? 'rgba(91, 159, 219, 0.5)' : 'rgba(77, 163, 255, 0.4)',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                }}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <>
                        <Text className="text-white font-semibold text-base">Add Site</Text>
                        <ChevronRight size={18} color="white" strokeWidth={2.5} />
                    </>
                )}
            </AnimatedPressableScale>

            {/* How to setup */}
            <HowToSetupMobile />

            {/* Auth Sheet */}
            <Sheet ref={bottomSheetRef} snapPoints={[440]} onDismiss={clearSiteInformation}>
                <BottomSheetView style={{ paddingBottom: 40 }}>
                    {siteInformation && <SiteAuthFlowSheet siteInformation={siteInformation} onDismiss={clearSiteInformation} />}
                </BottomSheetView>
            </Sheet>
        </View>
    );
}

// Exported for use in SitesList and SiteSwitcher
export const SiteAuthFlowSheet = ({ siteInformation, onDismiss }: { siteInformation: SiteInformation, onDismiss: () => void }) => {

    const { colors, colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const discoveryWithURL = {
        authorizationEndpoint: siteInformation.url + discovery.authorizationEndpoint,
        tokenEndpoint: siteInformation.url + discovery.tokenEndpoint,
        revocationEndpoint: siteInformation.url + discovery.revocationEndpoint,
    };

    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = useAuthRequest({
        responseType: ResponseType.Code,
        clientId: siteInformation.client_id,
        usePKCE: true,
        scopes: ['all', 'openid'],
        codeChallengeMethod: CodeChallengeMethod.S256,
        redirectUri: makeRedirectUri({ native: 'raven.thecommit.company:' }),
    }, discoveryWithURL);

    const onLoginClick = () => {
        setLoading(true);
        promptAsync()
            .then(res => {
                if (res.type === 'success') {
                    exchangeCodeAsync({
                        clientId: siteInformation.client_id,
                        code: res.params.code,
                        extraParams: {
                            code_verifier: request?.codeVerifier ?? '',
                        },
                        redirectUri: makeRedirectUri({ native: 'raven.thecommit.company:' }),
                    }, discoveryWithURL).then(data => {
                        onAccessTokenReceived(data);
                    }).catch(err => {
                        Alert.alert("Authentication Error", err.message);
                    });
                } else if (res.type === "error") {
                    Alert.alert("Authentication Error", res.error?.message ?? "Unknown error");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onAccessTokenReceived = (token: TokenResponse) => {
        storeAccessToken(siteInformation.sitename, token)
            .then(() => addSiteToStorage(siteInformation.sitename, siteInformation))
            .then(() => setDefaultSite(siteInformation.sitename))
            .then(() => router.replace(`/${siteInformation.sitename}`))
            .then(() => onDismiss());
    };

    return (
        <View className='flex gap-5 px-5'>
            {/* Header */}
            <FadeInView delay={0} duration={400} slideDistance={15}>
                <Text className='text-lg font-semibold text-foreground'>Connect to Workspace</Text>
            </FadeInView>

            {/* Site Card */}
            <FadeInView delay={100} duration={400} slideDistance={15}>
                <View
                    className='flex-row items-center gap-3 p-4 rounded-2xl'
                    style={{
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    }}
                >
                    <View
                        className='rounded-xl overflow-hidden'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <Avatar alt="Site Logo" className='w-14 h-14'>
                            <AvatarImage source={{ uri: (siteInformation.url) + (siteInformation.logo) }} />
                        </Avatar>
                    </View>
                    <View className='flex-1'>
                        <Text className='text-lg font-semibold text-foreground'>{siteInformation?.app_name}</Text>
                        <Text className='text-sm text-muted-foreground'>{siteInformation?.url.replace('https://', '')}</Text>
                    </View>
                </View>
            </FadeInView>

            {/* Login Button */}
            <FadeInView delay={200} duration={400} slideDistance={15}>
                <AnimatedPressableScale
                    scaleValue={0.97}
                    onPress={onLoginClick}
                    disabled={!request || loading}
                    className={`flex-row items-center justify-center gap-2.5 py-4 rounded-xl ${!request || loading ? 'bg-primary/50' : 'bg-primary'
                        }`}
                    style={{
                        shadowColor: isDark ? 'rgba(91, 159, 219, 0.5)' : 'rgba(77, 163, 255, 0.4)',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                >
                    {loading ? (
                        <ActivityIndicator color={"#FFFFFF"} />
                    ) : (
                        <>
                            <LogIn size={20} color="#FFFFFF" />
                            <Text className="text-white font-semibold text-base">Sign In with OAuth</Text>
                        </>
                    )}
                </AnimatedPressableScale>
            </FadeInView>

            {/* Security note */}
            <FadeInView delay={300} duration={400} slideDistance={10}>
                <Text className='text-xs text-center text-muted-foreground'>
                    You'll be redirected to login securely on your Mjara site
                </Text>
            </FadeInView>
        </View>
    );
};

export default AddSite;