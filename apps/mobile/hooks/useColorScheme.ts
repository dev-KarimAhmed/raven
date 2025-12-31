import * as NavigationBar from 'expo-navigation-bar';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { COLORS } from '@theme/colors';
import { useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage, loadable } from 'jotai/utils';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from 'react-native';

const themeAsyncAtom = atomWithStorage<'light' | 'dark' | 'system' | undefined>('theme', 'system',
    createJSONStorage(() => AsyncStorage), {
    getOnInit: true
});

export const themeAtom = loadable(themeAsyncAtom);

function useColorScheme() {

    // Always call the hook but only use it on native platforms
    let nativewindColorScheme = { colorScheme: 'light' };
    try {
        nativewindColorScheme = useNativewindColorScheme();
    } catch (error) {
        // On web, the hook might fail or return undefined
        console.warn('Nativewind color scheme not available on this platform');
    }

    const colorScheme = Platform.OS !== 'web' 
        ? (nativewindColorScheme.colorScheme ?? 'light')
        : 'light';

    const [theme, setTheme] = useAtom(themeAsyncAtom);

    async function setColorScheme(newColorScheme: 'light' | 'dark' | 'system') {
        // Only update theme storage, skip nativewind setColorScheme on web
        setTheme(newColorScheme);
    }

    return {
        themeValue: theme,
        colorScheme,
        isDarkColorScheme: colorScheme === 'dark',
        setColorScheme,
        colors: COLORS[colorScheme ?? 'light'],
    };
}

export { useColorScheme };

export function setNavigationBar(colorScheme: 'light' | 'dark') {
    return Promise.all([
        NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark'),
        NavigationBar.setPositionAsync('absolute'),
        NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? '#00000030' : '#ffffff80'),
    ]);
}