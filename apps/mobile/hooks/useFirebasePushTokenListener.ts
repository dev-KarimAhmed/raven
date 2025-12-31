import { useContext, useEffect, useRef } from 'react'
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import useSiteContext from './useSiteContext';
import { FrappeConfig, FrappeContext } from 'frappe-react-sdk';

let messaging: any = null;
let AuthorizationStatus: any = null;

if (Platform.OS !== 'web') {
    const mod = require('@react-native-firebase/messaging');
    messaging = mod.getMessaging();
    AuthorizationStatus = mod.AuthorizationStatus;
}

const useFirebasePushTokenListener = () => {

    const siteInfo = useSiteContext()

    const { call } = useContext(FrappeContext) as FrappeConfig

    const callMade = useRef(false)

    useEffect(() => {

        if (callMade.current) return
        callMade.current = true

        // When the site is switched, fetch the token and store it in the database
        if (siteInfo && messaging) {
            messaging.requestPermission().then(async (authorizationStatus: any) => {
                if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
                    const token = await messaging.getToken()
                    call.post('raven.api.notification.subscribe', {
                        fcm_token: token,
                        environment: 'Mobile',
                        device_information: Device.deviceName
                    })
                }
            })
        }

    }, [siteInfo])
}

export default useFirebasePushTokenListener