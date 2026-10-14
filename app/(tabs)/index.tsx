import "@/global.css";
import { Text, View } from "react-native";
import {Link} from "expo-router";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";

const SafeAreaView=styled(RNSafeAreaView);

export default function App() {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-7xl font-sans-extrabold">Home</Text>
            <Link href="/onboarding" className="m-4 font-sans-bold rounded bg-primary text-white p-4">Go to Onboard</Link>
            <Link href="/(auth)/sign-in" className="m-4 font-sans-bold rounded bg-primary text-white p-4">Go to Sign In</Link>
            <Link href="/(auth)/sign-up" className="m-4 font-sans-bold rounded bg-primary text-white p-4">Go to Sign Up</Link>
        </SafeAreaView>
    );
}