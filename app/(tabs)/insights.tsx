import {Text, View, Image, ScrollView, Pressable} from 'react-native'
import React from 'react'
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import {useSubscriptions} from "@/lib/subscriptions-context";

const SafeAreaView=styled(RNSafeAreaView);

interface ChartData {
    day: string;
    value: number;
    highlight?: boolean;
}

const weeklyChartData: ChartData[] = [
    {day: 'Mon', value: 35},
    {day: 'Tue', value: 28},
    {day: 'Wed', value: 22},
    {day: 'Thr', value: 40, highlight: true},
    {day: 'Fri', value: 32},
    {day: 'Sat', value: 15},
    {day: 'Sun', value: 24},
];

const Insights = () => {
    const {subscriptions} = useSubscriptions();
    const maxValue = Math.max(...weeklyChartData.map(d => d.value));
    
    // Calculate total expenses
    const totalExpenses = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
    
    // Get recent subscriptions for history
    const recentSubscriptions = subscriptions.slice(0, 2);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-5 pb-18">
                {/* Header */}
                <View className="insights-header">
                    <View />
                    <Text className="insights-title">Monthly Insights</Text>
                    <Pressable className="insights-menu">
                        <Text className="insights-menu-text">•••</Text>
                    </Pressable>
                </View>

                {/* Upcoming Section */}
                <View className="list-head">
                    <Text className="list-title">Upcoming</Text>
                    <Pressable className="list-action">
                        <Text className="list-action-text">View all</Text>
                    </Pressable>
                </View>

                {/* Chart */}
                <View className="insights-chart-container">
                    <View className="insights-chart">
                        {weeklyChartData.map((data, index) => (
                            <View key={index} className="insights-chart-bar">
                                {data.highlight && (
                                    <View className="insights-chart-tooltip">
                                        <Text className="insights-chart-tooltip-text">
                                            {formatCurrency(data.value)}
                                        </Text>
                                    </View>
                                )}
                                <View 
                                    className={`insights-chart-bar-fill ${data.highlight ? 'insights-chart-bar-highlight' : ''}`}
                                    style={{height: `${(data.value / maxValue) * 100}%`}}
                                />
                                <Text className="insights-chart-label">{data.day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Expenses Card */}
                <View className="insights-expenses-card">
                    <View className="insights-expenses-row">
                        <View>
                            <Text className="insights-expenses-label">Expenses</Text>
                            <Text className="insights-expenses-date">
                                {dayjs().format('MMMM YYYY')}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="insights-expenses-amount">
                                -{formatCurrency(totalExpenses)}
                            </Text>
                            <Text className="insights-expenses-change">+12%</Text>
                        </View>
                    </View>
                </View>

                {/* History Section */}
                <View className="list-head">
                    <Text className="list-title">History</Text>
                    <Pressable className="list-action">
                        <Text className="list-action-text">View all</Text>
                    </Pressable>
                </View>

                {/* History Items */}
                {recentSubscriptions.map((sub) => (
                    <View key={sub.id} className="insights-history-item" style={{backgroundColor: sub.color}}>
                        <View className="insights-history-row">
                            <View className="insights-history-main">
                                <Image source={sub.icon} className="insights-history-icon" />
                                <View>
                                    <Text className="insights-history-name">{sub.name}</Text>
                                    <Text className="insights-history-date">
                                        {sub.renewalDate ? dayjs(sub.renewalDate).format('MMMM DD, HH:mm') : 'N/A'}
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="insights-history-price">
                                    {formatCurrency(sub.price)}
                                </Text>
                                <Text className="insights-history-billing">per month</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}
export default Insights
