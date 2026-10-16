import {View, Text} from "react-native";
import {Link} from "expo-router";

const Signup = () => {
    return (
        <View style={{ flex: 1 }}>
            <Text className="">Sign Up</Text>
            <Link href="/(auth)/sign-in" className="m-4 rounded bg-primary text-white p-4">Sign In</Link>
        </View>
    )
}

export default Signup;