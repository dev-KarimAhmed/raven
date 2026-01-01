import 'expo-dev-client';
import { router, Slot, usePathname } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import "../global.css";
import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { setNavigationBar, themeAtom } from '@hooks/useColorScheme';
import { useColorScheme } from '@hooks/useColorScheme';
import { NAV_THEME } from '@theme/index';
import { StatusBar } from 'expo-status-bar';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { PortalHost } from '@rn-primitives/portal';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Toaster } from 'sonner-native';
import { LogBox, Platform } from 'react-native';
import { setDefaultSite } from '@lib/auth';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAtom } from 'jotai';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

/** Suppressing this for now - see https://github.com/meliorence/react-native-render-html/issues/661 */
LogBox.ignoreLogs([
    /Support for defaultProps will be removed/,
]);

if (__DEV__) {
    LogBox.ignoreLogs([
        /Support for defaultProps will be removed/,
    ]);
}

let messaging: any = null;
// Only initialize Firebase messaging on native platforms
if (Platform.OS !== 'web') {
    try {
        const { getMessaging } = require('@react-native-firebase/messaging');
        messaging = getMessaging();
    } catch (error) {
        // Firebase messaging not available
        console.warn('Firebase messaging not available:', error);
    }
}

export default function RootLayout() {

    // const path = usePathname()
    // console.log(path)

    const { getItem } = useAsyncStorage(`default-site`)
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {

        const onMount = async () => {
            // Only proceed if component is still mounted
            if (!isMountedRef.current) return;

            try {
                // Get the defualt site from the async storage
                // Also check if the app was started by a notification
                if (messaging) {
                    const initialNotification = await messaging.getInitialNotification();

                    if (initialNotification && isMountedRef.current) {
                        if (initialNotification.data?.channel_id && initialNotification.data?.sitename) {
                            setDefaultSite(initialNotification.data.sitename as string)
                            let path = 'chat'
                            if (initialNotification.data.is_thread) {
                                path = 'thread'
                            }
                            router.navigate(`/${initialNotification.data.sitename}/${path}/${initialNotification.data.channel_id}`, {
                                withAnchor: true
                            })

                            return
                        }
                    }
                }

                // If not started by notification
                // On load, check if the user has a site set
                if (isMountedRef.current) {
                    const defaultSite = await getItem()
                    if (defaultSite) {
                        router.replace(`/${defaultSite}`)
                    } else {
                        router.replace('/landing')
                    }
                }
            } catch (error) {
                console.error('Error initializing app:', error);
                if (isMountedRef.current) {
                    router.replace('/landing')
                }
            }
        }

        // Handle notification open when app is in background
        let unsubscribeOnNotificationOpen: (() => void) | null = null;
        if (messaging) {
            unsubscribeOnNotificationOpen = messaging.onNotificationOpenedApp(async (remoteMessage: any) => {
                if (!isMountedRef.current) return;
                // console.log('Notification opened app from background state:', remoteMessage);
                if (remoteMessage.data?.channel_id && remoteMessage.data?.sitename) {
                    setDefaultSite(remoteMessage.data.sitename as string)
                    let path = 'chat'
                    if (remoteMessage.data.is_thread === '1') {
                        path = 'thread'
                    }
                    router.navigate(`/${remoteMessage.data.sitename}/${path}/${remoteMessage.data.channel_id}`, {
                        withAnchor: true
                    })
                }
            });
        }

        onMount()
        // Cleanup function
        return () => {
            if (unsubscribeOnNotificationOpen) {
                unsubscribeOnNotificationOpen();
            }
        };
    }, []);

    const { colorScheme: nativewindColorScheme, setColorScheme: setNativewindColorScheme } = useNativewindColorScheme();
    const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();

    const [theme] = useAtom(themeAtom);

    // Determine the effective color scheme for ThemeProvider (must be 'light' or 'dark')
    const effectiveColorScheme: 'light' | 'dark' = colorScheme === 'system' ? (nativewindColorScheme ?? 'light') : (colorScheme as 'light' | 'dark' | undefined) ?? 'light';
    const effectiveIsDarkColorScheme = effectiveColorScheme === 'dark' || isDarkColorScheme;

    useEffect(() => {
        if (Platform.OS === 'web') return; // Skip color scheme setting on web
        if (theme.state === 'hasData') {
            if (theme.data && theme.data !== 'system') {
                setNativewindColorScheme(theme.data);
            } else if (theme.data === 'system') {
                // Reset to system default
                const systemColorScheme = nativewindColorScheme;
                if (systemColorScheme) {
                    setNativewindColorScheme(systemColorScheme);
                }
            }
        }
    }, [theme, setNativewindColorScheme, nativewindColorScheme]);

    useEffect(() => {
        if (Platform.OS !== 'android' || !effectiveColorScheme) return;
        try {
            setNavigationBar(effectiveColorScheme)
        } catch (error) {
            console.error('useColorScheme.tsx", "setColorScheme', error);
        }
    }, [effectiveColorScheme])

    return (
        <>
            <StatusBar
                key={`root-status-bar-${effectiveIsDarkColorScheme ? 'light' : 'dark'}`}
                style={effectiveIsDarkColorScheme ? 'light' : 'dark'}
            />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <ActionSheetProvider>
                        <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
                            <ThemeProvider value={NAV_THEME[effectiveColorScheme]}>
                                <ErrorBoundary>
                                    <Slot />
                                </ErrorBoundary>
                                <PortalHost />
                            </ThemeProvider>
                        </KeyboardProvider>
                    </ActionSheetProvider>
                </BottomSheetModalProvider>
                <Toaster
                    position="top-center"
                    duration={2000}
                    visibleToasts={4}
                    closeButton={true}
                    toastOptions={{}}
                    pauseWhenPageIsHidden
                    theme={effectiveIsDarkColorScheme ? 'dark' : 'light'}
                    swipeToDismissDirection='up'
                />
            </GestureHandlerRootView>
        </>
    )
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any) {
        // Suppress the "No filename found" error from expo-router on web
        if (error?.message?.includes?.('No filename found')) {
            this.setState({ hasError: false });
            return;
        }
    }

    render() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    }
}