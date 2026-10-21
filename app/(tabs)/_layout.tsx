import {Tabs} from "expo-router";
import {tabs} from "@/assets/constants/data"
import {View} from "react-native";
import {Image} from "react-native";
import clsx from "clsx";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {components, colors} from "@/assets/constants/theme";
import {SubscriptionsProvider} from "@/lib/subscriptions-context";

const tabBar=components.tabBar;

const TabLayout = () => {
        const insets = useSafeAreaInsets();
        const TabIcon=({focused, icon}: TabIconProps)=>{
                return(
                    <View className="tabs-icon">
                            <View className={clsx('tabs-pill', focused && 'tabs-active')}>
                                    <Image source={icon} resizeMode="contain" className='tabs-glyph' />
                            </View>
                    </View>
                )
        }

        return(
    <SubscriptionsProvider>
    <Tabs
        screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle:{
                        position: "absolute",
                        bottom: Math.max(insets.bottom,tabBar.horizontalInset),
                        height: tabBar.height,
                        marginHorizontal: tabBar.horizontalInset,
                        borderRadius: tabBar.radius,
                        backgroundColor: colors.primary,
                        borderTopWidth:0,
                        elevation:0,
                },
                tabBarItemStyle:{
                        paddingVertical: tabBar.height /2 - tabBar.iconFrame / 1.6
                },
                tabBarIconStyle:{
                        width: tabBar.iconFrame,
                        height: tabBar.iconFrame,
                        alignItems: "center",
                },
        }}
    >
            {tabs.map((tabs)=>(
                <Tabs.Screen
                    key={tabs.name}
                    name={tabs.name}
                    options={{
                            title: tabs.title,
                            tabBarIcon: ({focused})=>(
                                <TabIcon focused={focused} icon={tabs.icon}/>
                            )
                    }}
                />
            ))}
    </Tabs>
    </SubscriptionsProvider>
)
}
export default TabLayout
