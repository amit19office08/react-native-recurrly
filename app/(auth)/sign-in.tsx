import {useState, useCallback} from "react";
import {View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {useSignIn} from "@clerk/expo";
import {styled} from "nativewind";

const SafeArea = styled(SafeAreaView);

export default function SignInScreen() {
    const {signIn, fetchStatus} = useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const isLoading = fetchStatus === "fetching";

    const validateEmail = (value: string) => {
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value) return "Password is required";
        return "";
    };

    const handleSignIn = useCallback(async () => {
        const eErr = validateEmail(email);
        const pErr = validatePassword(password);
        setEmailError(eErr);
        setPasswordError(pErr);
        if (eErr || pErr) return;

        setError("");

        const {error: err} = await signIn.password({identifier: email, password});
        if (err) {
            console.error('Sign in error:', JSON.stringify(err, null, 2));
            setError(err.longMessage || err.message || "Unable to sign in. Please check your credentials.");
            return;
        }

        if (signIn.status === 'complete') {
            const {error: finalizeErr} = await signIn.finalize();
            if (finalizeErr) {
                console.error('Sign in finalize error:', JSON.stringify(finalizeErr, null, 2));
                setError(finalizeErr.longMessage || finalizeErr.message || "Unable to complete sign in.");
                return;
            }

            router.replace("/(tabs)");
        } else if (signIn.status === 'needs_second_factor') {
            setError("Two-factor authentication is required. Please check your authenticator app.");
        } else {
            console.error('Unexpected sign-in status:', signIn.status);
            setError("Unable to complete sign in. Please try again.");
        }
    }, [email, password, signIn]);

    return (
        <SafeArea className="auth-safe-area">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
            >
                <ScrollView
                    className="auth-scroll"
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="auth-content">
                        {/* Brand */}
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">R</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Recurrly</Text>
                                    <Text className="auth-wordmark-sub">Subscriptions</Text>
                                </View>
                            </View>
                        </View>

                        {/* Title */}
                        <Text className="auth-title">Welcome back</Text>
                        <Text className="auth-subtitle">
                            Sign in to continue tracking your subscriptions.
                        </Text>

                        {/* Form Card */}
                        <View className="auth-card">
                            <View className="auth-form">
                                {/* Email field */}
                                <View className="auth-field">
                                    <Text className="auth-label">Email</Text>
                                    <TextInput
                                        className={["auth-input", emailError && "auth-input-error"].filter(Boolean).join(" ")}
                                        placeholder="Enter your email"
                                        placeholderTextColor="rgba(0,0,0,0.35)"
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (emailError) setEmailError("");
                                        }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        editable={!isLoading}
                                        blurOnSubmit={false}
                                    />
                                    {emailError ? <Text className="auth-error">{emailError}</Text> : null}
                                </View>

                                {/* Password field */}
                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <View className="relative">
                                        <TextInput
                                            className={["auth-input", passwordError && "auth-input-error"].filter(Boolean).join(" ")}
                                            placeholder="Enter your password"
                                            placeholderTextColor="rgba(0,0,0,0.35)"
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                if (passwordError) setPasswordError("");
                                            }}
                                            secureTextEntry
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            editable={!isLoading}
                                            onSubmitEditing={handleSignIn}
                                            returnKeyType="go"
                                        />
                                    </View>
                                    {passwordError ? <Text className="auth-error">{passwordError}</Text> : null}
                                </View>

                                {/* General error */}
                                {error ? <Text className="auth-error">{error}</Text> : null}

                                {/* Primary button */}
                                <Pressable
                                    className={["auth-button", isLoading && "auth-button-disabled"].filter(Boolean).join(" ")}
                                    onPress={handleSignIn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#081126" />
                                    ) : (
                                        <Text className="auth-button-text">Sign in</Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Sign up link */}
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">Don&apos;t have an account?</Text>
                            <Pressable onPress={() => router.push("/(auth)/sign-up")}>
                                <Text className="auth-link">Create Account</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeArea>
    );
}