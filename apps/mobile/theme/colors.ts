import { Platform } from 'react-native';

/**
 * Premium Color Palette for Beam Chat App
 * 
 * Design Philosophy:
 * - Light Mode: Clean, airy, professional with subtle depth
 * - Dark Mode: True black OLED-friendly with purple accent
 * - Primary: Purple - sophisticated and distinctive
 * - Accent: Cyan/Teal - modern complement to purple
 * - Greens: Success states
 * - Reds: Destructive actions
 */

const IOS_SYSTEM_COLORS = {
    white: 'rgb(255, 255, 255)',
    black: 'rgb(0, 0, 0)',
    light: {
        // Grays - Tailwind Slate/Gray scale
        grey6: 'rgb(248, 250, 252)',  // slate-50
        grey5: 'rgb(241, 245, 249)',  // slate-100
        grey4: 'rgb(226, 232, 240)',  // slate-200
        grey3: 'rgb(203, 213, 225)',  // slate-300
        grey2: 'rgb(148, 163, 184)',  // slate-400
        grey: 'rgb(100, 116, 139)',   // slate-500

        // Core colors
        background: 'rgb(255, 255, 255)',
        foreground: 'rgb(15, 23, 42)',      // slate-900
        root: 'rgb(255, 255, 255)',
        card: 'rgb(248, 250, 252)',         // slate-50

        // UI elements
        icon: '#475569',                     // slate-600
        greyText: 'rgb(100, 116, 139)',     // slate-500
        destructive: 'rgb(239, 68, 68)',    // red-500
        primary: '#3C0366',                  // beam purple (dark)
        secondary: '#F1F5F9',                // slate-100
        linkColor: '#F8FAFC',                // slate-50

        // Additional
        accent: '#00D4FF',                   // cyan accent
        success: '#22C55E',                  // green-500
        warning: '#F59E0B',                  // amber-500
    },
    dark: {
        // Grays - Tailwind Zinc scale (true blacks)
        grey6: 'rgb(24, 24, 27)',     // zinc-900
        grey5: 'rgb(39, 39, 42)',     // zinc-800
        grey4: 'rgb(52, 52, 56)',     // zinc-700
        grey3: 'rgb(63, 63, 70)',     // zinc-600
        grey2: 'rgb(82, 82, 91)',     // zinc-500
        grey: 'rgb(113, 113, 122)',   // zinc-500

        // Core colors
        background: 'rgb(9, 9, 11)',        // zinc-950
        foreground: 'rgb(250, 250, 250)',   // zinc-50
        root: 'rgb(9, 9, 11)',              // zinc-950
        card: 'rgb(24, 24, 27)',            // zinc-900

        // UI elements
        icon: '#A1A1AA',                     // zinc-400
        greyText: 'rgb(113, 113, 122)',     // zinc-500
        destructive: 'rgb(248, 113, 113)',  // red-400
        primary: '#59168B',                  // beam purple (light)
        secondary: '#27272A',                // zinc-800
        linkColor: '#18181B',                // zinc-900

        // Additional
        accent: '#00D4FF',                   // cyan accent
        success: '#4ADE80',                  // green-400
        warning: '#FBBF24',                  // amber-400
    },
} as const;

const ANDROID_COLORS = {
    white: 'rgb(255, 255, 255)',
    black: 'rgb(0, 0, 0)',
    light: {
        grey6: 'rgb(248, 250, 252)',
        grey5: 'rgb(241, 245, 249)',
        grey4: 'rgb(226, 232, 240)',
        grey3: 'rgb(203, 213, 225)',
        grey2: 'rgb(148, 163, 184)',
        grey: 'rgb(100, 116, 139)',
        background: 'rgb(255, 255, 255)',
        foreground: 'rgb(15, 23, 42)',
        root: 'rgb(255, 255, 255)',
        card: 'rgb(248, 250, 252)',
        icon: '#475569',
        greyText: 'rgb(100, 116, 139)',
        destructive: 'rgb(239, 68, 68)',
        primary: '#3C0366',
        secondary: '#F1F5F9',
        linkColor: '#F8FAFC',
        accent: '#00D4FF',
        success: '#22C55E',
        warning: '#F59E0B',
    },
    dark: {
        grey6: 'rgb(24, 24, 27)',
        grey5: 'rgb(39, 39, 42)',
        grey4: 'rgb(52, 52, 56)',
        grey3: 'rgb(63, 63, 70)',
        grey2: 'rgb(82, 82, 91)',
        grey: 'rgb(113, 113, 122)',
        background: 'rgb(9, 9, 11)',
        foreground: 'rgb(250, 250, 250)',
        root: 'rgb(9, 9, 11)',
        card: 'rgb(24, 24, 27)',
        icon: '#A1A1AA',
        greyText: 'rgb(113, 113, 122)',
        destructive: 'rgb(248, 113, 113)',
        primary: '#59168B',
        secondary: '#27272A',
        linkColor: '#18181B',
        accent: '#00D4FF',
        success: '#4ADE80',
        warning: '#FBBF24',
    },
} as const;

const COLORS = Platform.OS === 'ios' ? IOS_SYSTEM_COLORS : ANDROID_COLORS;

export { COLORS };