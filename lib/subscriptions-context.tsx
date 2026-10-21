import React, {createContext, useContext, useState, useCallback, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HOME_SUBSCRIPTIONS} from "@/assets/constants/data";

const SUBSCRIPTIONS_STORAGE_KEY = '@subscriptions';

type SubscriptionsContextType = {
    subscriptions: Subscription[];
    addSubscription: (sub: Subscription) => void;
};

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

async function loadSubscriptions(): Promise<Subscription[]> {
    try {
        const stored = await AsyncStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        // Fall back to default data on any error
    }
    return HOME_SUBSCRIPTIONS;
}

async function saveSubscriptions(subscriptions: Subscription[]) {
    try {
        await AsyncStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(subscriptions));
    } catch {
        // Silently fail — data is still in state
    }
}

export function SubscriptionsProvider({children}: {children: ReactNode}) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (loaded) return;
        loadSubscriptions().then((subs) => {
            setSubscriptions(subs);
            setLoaded(true);
        });
    }, [loaded]);

    const addSubscription = useCallback((sub: Subscription) => {
        setSubscriptions(prev => {
            const next = [sub, ...prev];
            saveSubscriptions(next);
            return next;
        });
    }, []);

    return (
        <SubscriptionsContext.Provider value={{subscriptions, addSubscription}}>
            {children}
        </SubscriptionsContext.Provider>
    );
}

export function useSubscriptions() {
    const context = useContext(SubscriptionsContext);
    if (!context) {
        throw new Error('useSubscriptions must be used within a SubscriptionsProvider');
    }
    return context;
}
