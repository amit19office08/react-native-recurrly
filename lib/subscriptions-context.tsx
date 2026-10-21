import React, {createContext, useContext, useState, useCallback, ReactNode} from 'react';
import {HOME_SUBSCRIPTIONS} from "@/assets/constants/data";

type SubscriptionsContextType = {
    subscriptions: Subscription[];
    addSubscription: (sub: Subscription) => void;
};

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({children}: {children: ReactNode}) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

    const addSubscription = useCallback((sub: Subscription) => {
        setSubscriptions(prev => [sub, ...prev]);
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
