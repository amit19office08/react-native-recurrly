import {Text, View, Image, Pressable, ActivityIndicator} from 'react-native'
import React from 'react'
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import {useUser, useAuth, useSignIn} from "@clerk/expo";
import {router} from "expo-router";
import {posthog} from "@/lib/posthog";

const SafeAreaView=styled(RNSafeAreaView);

const Settings = () => {
    const {fetchStatus} = useSignIn();
    const {user} = useUser();
    const {signOut} = useAuth();
    const [isSigningOut, setIsSigningOut] = React.useState(false);

    const userName = user
        ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.primaryEmailAddress?.emailAddress || 'User'
        : 'User';

    const userEmail = user?.primaryEmailAddress?.emailAddress || '';
    const isLoading = fetchStatus === "fetching";

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            posthog?.capture('user_signed_out');
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch (err) {
            console.error('Sign out error:', JSON.stringify(err, null, 2));
            setIsSigningOut(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="items-center pt-8 pb-6">
                <Image
                    source={user?.imageUrl ? {uri: user.imageUrl} : require('@/assets/images/avatar.png')}
                    className="size-24 rounded-full"
                />
                <Text className="mt-4 text-2xl font-sans-bold text-primary">{userName}</Text>
                {userEmail ? (
                    <Text className="mt-1 text-base font-sans-medium text-muted-foreground">{userEmail}</Text>
                ) : null}
            </View>

            <View className="mt-6 rounded-3xl border border-border bg-card p-5">
                {/*<Pressable*/}
                {/*    className={["auth-button", isLoading && "auth-button-disabled"].filter(Boolean).join(" ")}*/}
                {/*    onPress={handleSignIn}*/}
                {/*    disabled={isLoading}*/}
                {/*>*/}
                {/*    {isLoading ? (*/}
                {/*        <ActivityIndicator color="#081126" />*/}
                {/*    ) : (*/}
                {/*        <Text className="auth-button-text">Sign in</Text>*/}
                {/*    )}*/}
                {/*</Pressable>*/}
                <Pressable
                    className={["auth-button", isLoading && "auth-button-disabled"].filter(Boolean).join(" ")}
                    onPress={handleSignOut}
                    disabled={isSigningOut}
                >
                    {isSigningOut ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="auth-button-text">Sign out</Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    )
}
export default Settings
