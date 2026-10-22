import {SplashScreen, Stack} from "expo-router";
import "@/global.css";
import {useFonts} from "expo-font";
import {useEffect, useRef} from "react";
import {ClerkProvider, useAuth, useUser} from "@clerk/expo";
import {tokenCache} from "@clerk/expo/token-cache";
import {PostHogProvider} from "posthog-react-native";
import {posthog} from "@/lib/posthog";

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
    const {user, isLoaded: isUserLoaded} = useUser();
    const identifiedUserId = useRef<string | null>(null);

    useEffect(() => {
        if (!posthog || !isLoaded || !isUserLoaded) return;

        if (!isSignedIn || !user) {
            if (identifiedUserId.current) {
                posthog.reset();
                identifiedUserId.current = null;
            }
            return;
        }

        if (identifiedUserId.current === user.id) return;

        if (identifiedUserId.current) {
            posthog.reset();
        }

        const email = user.primaryEmailAddress?.emailAddress;
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ');

        posthog.identify(user.id, {
            $set: {
                ...(email ? {email} : {}),
                ...(name ? {name} : {}),
            },
        });
        identifiedUserId.current = user.id;
    }, [isLoaded, isSignedIn, isUserLoaded, user]);

    useEffect(() => {
        if (fontLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontLoaded, fontError]);

    if (!fontLoaded && !fontError) return null;
    if (!isLoaded) return null;

    const stack = (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Protected guard={isSignedIn}>
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>
            <Stack.Protected guard={!isSignedIn}>
                <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="splash" />
        </Stack>
    );

    return posthog ? <PostHogProvider client={posthog}>{stack}</PostHogProvider> : stack;
}

export default function RootLayout() {
    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <AppContent />
        </ClerkProvider>
    );
}