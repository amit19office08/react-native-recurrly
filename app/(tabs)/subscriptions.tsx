import {View, Text, FlatList, TextInput} from 'react-native'
import React, {useState, useMemo} from 'react'
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import SubscriptionCard from "@/components/SubscriptionCard";
import {useSubscriptions} from "@/lib/subscriptions-context";

const SafeAreaView=styled(RNSafeAreaView);

const Subscriptions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const {subscriptions} = useSubscriptions();

    const filteredSubscriptions = useMemo(() => {
        if (searchQuery.trim() === '') return subscriptions;
        const query = searchQuery.toLowerCase().trim();
        return subscriptions.filter((sub) => {
            const searchable = [sub.name, sub.category, sub.plan, sub.paymentMethod, sub.status]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return searchable.includes(query);
        });
    }, [searchQuery, subscriptions]);

    const handleCardPress = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="p-5">
                <Text className="mb-4 text-2xl font-sans-bold text-primary">Subscriptions</Text>
                <TextInput
                    className="rounded-2xl border border-border bg-card px-4 py-4 text-base font-sans-medium text-primary"
                    placeholder="Search subscriptions..."
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                />
            </View>
            <FlatList
                data={filteredSubscriptions}
                keyExtractor={(item) => item.id}
                contentContainerClassName="px-5 pb-5"
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                    <View className="mb-3">
                        <SubscriptionCard
                            {...item}
                            expanded={expandedId === item.id}
                            onPress={() => handleCardPress(item.id)}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Text className="text-lg font-sans-semibold text-muted-foreground">
                            No subscriptions found
                        </Text>
                        <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
                            Try a different search term
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}
export default Subscriptions
