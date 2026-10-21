import "@/global.css";
import {FlatList, Image, Text, View, Pressable} from "react-native";
import {Link} from "expo-router";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import {useUser} from "@clerk/expo";
import {HOME_BALANCE, UPCOMING_SUBSCRIPTIONS} from "@/assets/constants/data";
import {icons} from "@/assets/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import {useState} from "react";
import {useSubscriptions} from "@/lib/subscriptions-context";
import {posthog} from "@/lib/posthog";
import {posthogLog} from "@/lib/posthog-logger";

const SafeAreaView=styled(RNSafeAreaView);

export default function App() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] =useState<string| null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const {user} = useUser();
    const {subscriptions, addSubscription} = useSubscriptions();

    const userName = user
        ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.primaryEmailAddress?.emailAddress || 'User'
        : 'User';

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
                <FlatList
                    ListHeaderComponent={()=>(
                        <>
                            <View className="home-header">
                                <View className="home-user">
                                    <Image source={user?.imageUrl ? {uri: user.imageUrl} : require('@/assets/images/avatar.png')} className="home-avatar" />
                                    <Text className="home-user-name">{userName}</Text>
                                </View>
                                <Pressable onPress={() => setModalVisible(true)}>
                                    <Image source={icons.add} className="home-add-icon" />
                                </Pressable>
                            </View>
                            <View className="home-balance-card">
                                <Text className="home-balance-label">Balance</Text>
                                <View className="home-balance-row">
                                    <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
                                    <Text className="home-balance-date">{dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}</Text>
                                </View>
                            </View>
                            <View className="mb-5">
                                <ListHeading title="Upcoming"/>
                                <FlatList
                                    data={UPCOMING_SUBSCRIPTIONS}
                                    renderItem={({item}) => (<UpcomingSubscriptionCard {...item}/>)}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
                                />
                            </View>
                            <ListHeading title="All Subscriptions"/>
                        </>
                    )}
                    data={subscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <SubscriptionCard
                            {...item}
                            expanded={expandedSubscriptionId === item.id}
                            onPress={()=> {
                                const isExpanded = expandedSubscriptionId !== item.id;
                                posthog?.capture('subscription_details_toggled', {
                                    is_expanded: isExpanded,
                                });
                                posthogLog.subscriptionDetailsToggled(isExpanded);
                                setExpandedSubscriptionId((currentId)=>
                                    (currentId=== item.id?null: item.id));
                            }}
                        />
                    )}
                    extraData={expandedSubscriptionId}
                    ItemSeparatorComponent={()=><View className="h-4" />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text className="home-empty-state">No Subscriptions yet.</Text>}
                    contentContainerClassName="pb-18"
                />
                <CreateSubscriptionModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onAdd={addSubscription}
                />
        </SafeAreaView>
    );
}