import { View } from 'react-native';
import { Text } from '@components/nativewindui/Text';
import { useColorScheme } from '@hooks/useColorScheme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';

interface ScreenHeaderProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    delay?: number;
}

const ScreenHeader = ({ title, subtitle, icon: Icon, delay = 0 }: ScreenHeaderProps) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(400)}
            className="px-5 pt-4 pb-3"
        >
            <View className="flex-row items-center gap-3">
                <View
                    className="p-2.5 rounded-xl"
                    style={{
                        backgroundColor: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                    }}
                >
                    <Icon size={22} color={isDark ? '#818CF8' : '#6366F1'} strokeWidth={2} />
                </View>
                <View>
                    <Text className="text-2xl font-bold text-foreground">{title}</Text>
                    <Text className="text-sm text-muted-foreground">{subtitle}</Text>
                </View>
            </View>
        </Animated.View>
    );
};

export default ScreenHeader;
