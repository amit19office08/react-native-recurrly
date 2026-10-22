import {View, Text, Pressable, Image} from "react-native";
import {router} from "expo-router";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import images from "@/assets/constants/images";

const SafeAreaView = styled(RNSafeAreaView);

const SplashScreen = () => {
    return (
        <SafeAreaView className="splash-safe-area">
            <View className="splash-container">
                <Image source={images.splashPattern} className="splash-pattern" resizeMode="contain" />
                
                <View className="splash-content">
                    <Text className="splash-title">Gain Financial Clarity</Text>
                    <Text className="splash-subtitle">Track, analyze and cancel with ease</Text>
                    
                    <Pressable 
                        className="splash-button" 
                        onPress={() => router.replace("/(auth)/sign-in")}
                    >
                        <Text className="splash-button-text">Get Started</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SplashScreen;
