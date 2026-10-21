import {SplashScreen, Stack} from "expo-router";
import "@/global.css";
import {useFonts} from "expo-font";
import {useEffect} from "react";
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

    useEffect(() => {
        if (fontLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontLoaded, fontError]);

    if (!fontLoaded && !fontError) return null;
    if (!isLoaded) return null;

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Protected guard={isSignedIn}>
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>
            <Stack.Protected guard={!isSignedIn}>
                <Stack.Screen name="(auth)" />
            </Stack.Protected>
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