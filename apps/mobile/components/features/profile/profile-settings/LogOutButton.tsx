import { Pressable, View } from 'react-native';
import { Text } from '@components/nativewindui/Text';
import { useColorScheme } from '@hooks/useColorScheme';
import { LogOut } from 'lucide-react-native';
import { useLogout } from '@hooks/useLogout';

const LogOutButton = () => {

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const onLogout = useLogout();

    return (
        <Pressable
            onPress={onLogout}
            className="flex flex-row items-center py-3.5 px-4 rounded-2xl justify-between"
            style={({ pressed }) => ({
                backgroundColor: pressed
                    ? (isDark ? 'rgba(248, 113, 113, 0.15)' : 'rgba(239, 68, 68, 0.1)')
                    : (isDark ? 'rgba(248, 113, 113, 0.08)' : 'rgba(239, 68, 68, 0.05)'),
                borderWidth: 1,
                borderColor: isDark ? 'rgba(248, 113, 113, 0.2)' : 'rgba(239, 68, 68, 0.15)',
            })}
        >
            <View className="flex-row items-center gap-3">
                <View
                    className="p-2 rounded-xl"
                    style={{
                        backgroundColor: isDark ? 'rgba(248, 113, 113, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                    }}
                >
                    <LogOut size={18} color={isDark ? '#F87171' : '#EF4444'} strokeWidth={2} />
                </View>
                <Text
                    className="font-semibold text-base"
                    style={{ color: isDark ? '#F87171' : '#EF4444' }}
                >
                    Log Out
                </Text>
            </View>
        </Pressable>
    );
};

export default LogOutButton;