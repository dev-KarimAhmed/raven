import { View, Platform } from 'react-native'
import BellOutlineIcon from '@assets/icons/BellOutlineIcon.svg'
import { useColorScheme } from '@hooks/useColorScheme'
import { Text } from '@components/nativewindui/Text'
import { Toggle } from '@components/nativewindui/Toggle'
import { useCallback, useContext, useEffect, useState } from 'react'
import { FrappeConfig, FrappeContext } from 'frappe-react-sdk'
import { toast } from 'sonner-native'
import * as Device from 'expo-device';

let messaging: any = null;
let AuthorizationStatus: any = null;

if (Platform.OS !== 'web') {
    try {
        const mod = require('@react-native-firebase/messaging');
        messaging = mod.getMessaging();
        AuthorizationStatus = mod.AuthorizationStatus;
    } catch (error) {
        console.warn('Firebase messaging not available:', error);
    }
}

const NotificationSetting = () => {

    const { colors } = useColorScheme()
    const [enabled, setEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { call } = useContext(FrappeContext) as FrappeConfig

    useEffect(() => {
        const checkPermission = async () => {
            if (messaging) {
                try {
                    const hasPermission = await messaging.hasPermission();
                    setEnabled(hasPermission === AuthorizationStatus.AUTHORIZED || hasPermission === AuthorizationStatus.PROVISIONAL);
                } catch (error) {
                    console.warn('Error checking notification permission:', error);
                }
            }
        };
        checkPermission();
    }, [])

    const onToggle = useCallback(async (toggleEnabled: boolean) => {
        if (!messaging || isLoading) return;

        setIsLoading(true);

        try {
            if (toggleEnabled) {
                // Request permission
                const authorizationStatus = await messaging.requestPermission();

                if (authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
                    authorizationStatus !== AuthorizationStatus.PROVISIONAL) {
                    toast.error('Permission not granted for notifications.');
                    setIsLoading(false);
                    return;
                }

                // Get FCM token
                const token = await messaging.getToken();

                if (!token) {
                    toast.error('Failed to get device token.');
                    setIsLoading(false);
                    return;
                }

                // Subscribe to push notifications on the server
                await call.post('raven.api.notification.subscribe', {
                    fcm_token: token,
                    environment: 'Mobile',
                    device_information: Device.deviceName || 'Unknown Device'
                });

                setEnabled(true);
                toast.success('Push notifications enabled!');
            } else {
                // Unsubscribe from push notifications
                try {
                    const token = await messaging.getToken();
                    if (token) {
                        await call.post('raven.api.notification.unsubscribe', {
                            fcm_token: token
                        });
                    }
                } catch (unsubError) {
                    console.warn('Error unsubscribing:', unsubError);
                }

                setEnabled(false);
                toast.success('Push notifications disabled.');
            }
        } catch (error: any) {
            console.error('Notification toggle error:', error);
            const errorMessage = error?.message || error?.httpStatus || 'Unknown error';
            toast.error(`Failed to update notifications: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [call, isLoading])

    return (
        <View>
            <View className='flex flex-row py-2.5 px-4 rounded-xl justify-between bg-background dark:bg-card'>
                <View className='flex-row items-center gap-2'>
                    <BellOutlineIcon height={18} width={18} fill={colors.icon} />
                    <Text className='text-base'>Push Notifications</Text>
                </View>
                <Toggle value={enabled} onValueChange={onToggle} disabled={isLoading} />
            </View>
        </View>
    )
}

export default NotificationSetting