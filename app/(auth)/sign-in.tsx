import {View, Text} from "react-native";
import {Link} from "expo-router";

const Signin = () => {
    return (
        <View>
            <Text className="">Sign In</Text>
            <Link href="/(auth)/sign-up" className="m-4 rounded bg-primary text-white p-4">Create Account</Link>
            <Link href="/onboarding" className="m-4 rounded bg-primary text-white p-4">Go to Onboard</Link>
        </View>
    )
}

export default Signin;