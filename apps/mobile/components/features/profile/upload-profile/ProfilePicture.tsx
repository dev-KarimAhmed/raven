import { TouchableOpacity, View } from 'react-native';
import { Text } from '@components/nativewindui/Text';
import useCurrentRavenUser from '@raven/lib/hooks/useCurrentRavenUser';
import useFileURL from '@hooks/useFileURL';
import { Sheet, useSheetRef } from '@components/nativewindui/Sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import RemoveImage from '@components/features/profile/upload-profile/RemoveImage';
import ViewImage from '@components/features/profile/upload-profile/ViewImage';
import UploadImage from '@components/features/profile/upload-profile/UploadImage';
import UserAvatar from '@components/layout/UserAvatar';
import { useColorScheme } from '@hooks/useColorScheme';
import { Camera } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const ProfilePicture = () => {

    const { myProfile, mutate } = useCurrentRavenUser();
    const source = useFileURL(myProfile?.user_image ?? "");
    const bottomSheetRef = useSheetRef();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.95, { damping: 15 });
    };

    const onPressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const onSheetClose = (isMutate: boolean = true) => {
        bottomSheetRef.current?.close();
        if (isMutate) {
            mutate();
        }
    };

    return (
        <View
            className="items-center py-4 rounded-2xl"
            style={{
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(39, 39, 42, 0.6)' : 'rgba(229, 231, 235, 0.8)',
            }}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => bottomSheetRef.current?.present()}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                className='relative'
            >
                <Animated.View style={animatedStyle}>
                    <UserAvatar
                        src={myProfile?.user_image}
                        alt={`${myProfile?.full_name}`}
                        availabilityStatus={myProfile?.availability_status ? myProfile?.availability_status : 'Available'}
                        imageProps={{ className: 'w-28 h-28' }}
                        fallbackProps={{ className: 'w-28 h-28 border border-border rounded-2xl' }}
                        textProps={{ className: 'text-4xl' }}
                        indicatorProps={{ className: 'w-4 h-4 border-2 border-background' }}
                        avatarProps={{ className: "w-28 h-28" }}
                        borderRadius={20}
                    />

                    {/* Camera overlay */}
                    <View
                        className="absolute bottom-0 right-0 p-2 rounded-xl"
                        style={{
                            backgroundColor: isDark ? '#59168B' : '#3C0366',
                            shadowColor: isDark ? '#59168B' : '#3C0366',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 4,
                        }}
                    >
                        <Camera size={16} color="#ffffff" strokeWidth={2.5} />
                    </View>
                </Animated.View>
            </TouchableOpacity>

            {/* User Name */}
            <View className="items-center mt-3 gap-0.5">
                <Text className="text-lg font-semibold text-foreground">
                    {myProfile?.full_name}
                </Text>
                <Text className="text-sm text-muted-foreground">
                    {myProfile?.name}
                </Text>
            </View>

            <Sheet ref={bottomSheetRef}>
                <BottomSheetView className='pb-16'>
                    <View className="flex-col gap-4">
                        <Text className="text-xl font-semibold px-5">Update profile picture</Text>
                        <View className="flex-col justify-start items-start px-3 w-full gap-1">
                            <UploadImage onSheetClose={onSheetClose} />
                            {source ? <ViewImage uri={source?.uri ?? ""} onSheetClose={onSheetClose} /> : null}
                            {source ? <RemoveImage onSheetClose={onSheetClose} /> : null}
                        </View>
                    </View>
                </BottomSheetView>
            </Sheet>
        </View>
    );
};

export default ProfilePicture;