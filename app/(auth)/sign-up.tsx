import {useState} from "react";
import {View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {useSignUp} from "@clerk/expo";
import {styled} from "nativewind";

const SafeArea = styled(SafeAreaView);

type Step = "form" | "verify";

export default function SignUpScreen() {
    const {signUp, fetchStatus} = useSignUp();
    const [step, setStep] = useState<Step>("form");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [codeError, setCodeError] = useState("");

    const isLoading = fetchStatus === "fetching";

    const validateEmail = (value: string) => {
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
    };

    const validateName = (value: string) => {
        if (!value.trim()) return "Name is required";
        return "";
    };

    const validateCode = (value: string) => {
        if (!value.trim()) return "Verification code is required";
        if (value.trim().length < 4) return "Enter a valid code";
        return "";
    };

    const handleSignUp = async () => {
        const nErr = validateName(name);
        const eErr = validateEmail(email);
        const pErr = validatePassword(password);
        setNameError(nErr);
        setEmailError(eErr);
        setPasswordError(pErr);
        if (nErr || eErr || pErr) return;
        setError("");

        const {error: createErr} = await signUp.password({
            emailAddress: email,
            password,
            firstName: name.trim(),
        });
        if (createErr) {
            console.error('Sign up error:', JSON.stringify(createErr, null, 2));
            setError(createErr.longMessage || createErr.message || "Failed to create account. Please try again.");
            return;
        }

        const {error: sendErr} = await signUp.verifications.sendEmailCode();
        if (sendErr) {
            console.error('Send email code error:', JSON.stringify(sendErr, null, 2));
            setError(sendErr.longMessage || sendErr.message || "Failed to send verification email.");
            return;
        }

        setStep("verify");
    };

    const handleVerify = async () => {
        const cErr = validateCode(code);
        setCodeError(cErr);
        if (cErr) return;

        setError("");

        const {error: verifyErr} = await signUp.verifications.verifyEmailCode({code: code.trim()});
        if (verifyErr) {
            console.error('Verify code error:', JSON.stringify(verifyErr, null, 2));
            setError(verifyErr.longMessage || verifyErr.message || "Invalid verification code.");
            return;
        }

        const {error: finalizeErr} = await signUp.finalize();
        if (finalizeErr) {
            console.error('Finalize error:', JSON.stringify(finalizeErr, null, 2));
            setError(finalizeErr.longMessage || finalizeErr.message || "Failed to complete sign up.");
            return;
        }

        router.replace("/(tabs)");
    };

    const handleResendCode = async () => {
        setError("");

        const {error: sendErr} = await signUp.verifications.sendEmailCode();
        if (sendErr) {
            console.error('Resend code error:', JSON.stringify(sendErr, null, 2));
            setError(sendErr.longMessage || sendErr.message || "Failed to resend verification email.");
        }
    };

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
                        <Text className="auth-title">
                            {step === "form" ? "Create account" : "Verify email"}
                        </Text>
                        <Text className="auth-subtitle">
                            {step === "form"
                                ? "Start tracking your subscriptions & never miss the payment."
                                : `We&apos;ve sent a verification code to ${email}. Enter it below to continue.`}
                        </Text>

                        {/* Form Card */}
                        <View className="auth-card">
                            <View className="auth-form">
                                {step === "form" ? (
                                    <>
                                        {/* Name field */}
                                        <View className="auth-field">
                                            <Text className="auth-label">Name</Text>
                                            <TextInput
                                                className={["auth-input", nameError && "auth-input-error"].filter(Boolean).join(" ")}
                                                placeholder="Enter your name"
                                                placeholderTextColor="rgba(0,0,0,0.35)"
                                                value={name}
                                                onChangeText={(text) => {
                                                    setName(text);
                                                    if (nameError) setNameError("");
                                                }}
                                                autoCapitalize="words"
                                                autoCorrect={false}
                                                editable={!isLoading}
                                                blurOnSubmit={false}
                                            />
                                            {nameError ? <Text className="auth-error">{nameError}</Text> : null}
                                        </View>

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
                                            <TextInput
                                                className={["auth-input", passwordError && "auth-input-error"].filter(Boolean).join(" ")}
                                                placeholder="Create a password"
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
                                                onSubmitEditing={handleSignUp}
                                                returnKeyType="go"
                                            />
                                            {passwordError ? <Text className="auth-error">{passwordError}</Text> : null}
                                            <Text className="auth-helper">At least 8 characters</Text>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        {/* Code field */}
                                        <View className="auth-field">
                                            <Text className="auth-label">Verification code</Text>
                                            <TextInput
                                                className={["auth-input", codeError && "auth-input-error"].filter(Boolean).join(" ")}
                                                placeholder="Enter code"
                                                placeholderTextColor="rgba(0,0,0,0.35)"
                                                value={code}
                                                onChangeText={(text) => {
                                                    setCode(text);
                                                    if (codeError) setCodeError("");
                                                }}
                                                keyboardType="number-pad"
                                                textAlign="center"
                                                style={{letterSpacing: 8, fontSize: 20}}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                editable={!isLoading}
                                                onSubmitEditing={handleVerify}
                                                returnKeyType="go"
                                                maxLength={8}
                                            />
                                            {codeError ? <Text className="auth-error">{codeError}</Text> : null}
                                        </View>

                                        {/* Resend code */}
                                        <View className="flex-row items-center justify-center gap-1 mt-1">
                                            <Text className="auth-helper">Didn&apos;t receive a code?</Text>
                                            <Pressable onPress={handleResendCode} disabled={isLoading}>
                                                <Text className="text-sm font-sans-bold text-accent">
                                                    Resend
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </>
                                )}

                                {/* General error */}
                                {error ? <Text className="auth-error">{error}</Text> : null}

                                {/* Primary button */}
                                <Pressable
                                    className={["auth-button", isLoading && "auth-button-disabled"].filter(Boolean).join(" ")}
                                    onPress={step === "form" ? handleSignUp : handleVerify}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#081126" />
                                    ) : (
                                        <Text className="auth-button-text">
                                            {step === "form" ? "Create account" : "Verify & continue"}
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Sign in link */}
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">Already have an account?</Text>
                            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
                                <Text className="auth-link">Sign in</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeArea>
    );
}