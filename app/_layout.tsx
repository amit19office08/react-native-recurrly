import {SplashScreen, Stack, useRouter} from "expo-router";
import "@/global.css";
import {useFonts} from "expo-font";
import {useEffect, useRef} from "react";
import {ClerkProvider, useAuth} from "@clerk/expo";
import {tokenCache} from "@clerk/expo/token-cache";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file');
}

function AppContent() {
    const [fontLoaded, fontError] = useFonts({
        'sans-ragular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
        'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
        'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
        'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
        'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
        'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    });

    const {isLoaded, isSignedIn} = useAuth();
    const router = useRouter();
    const hasRouted = useRef(false);

    useEffect(() => {
        if (fontLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontLoaded, fontError]);

    useEffect(() => {
        if (!isLoaded || hasRouted.current) return;
        hasRouted.current = true;

        if (isSignedIn) {
            router.replace("/(tabs)");
        } else {
            router.replace("/(auth)/sign-in");
        }
    }, [isLoaded, isSignedIn, router]);

    if (!fontLoaded && !fontError) return null;

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="onboarding" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <AppContent />
        </ClerkProvider>
    );
}