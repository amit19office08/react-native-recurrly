import {Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform} from 'react-native'
import React, {useState, useCallback} from 'react'
import {icons} from "@/assets/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import {posthog} from "@/lib/posthog";

const categories = ["Entertainment", "AI Tools", "Developer Tools", "Design", "Productivity", "Cloud", "Music", "Other"];

const categoryColors: Record<string, string> = {
    "Entertainment": "#b8d4e3",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    "Design": "#f5c542",
    "Productivity": "#b8e8d0",
    "Cloud": "#d4c5f9",
    "Music": "#f5c5c5",
    "Other": "#f6eecf",
};

type CreateSubscriptionModalProps = {
    visible: boolean;
    onClose: () => void;
    onAdd: (subscription: Subscription) => void;
};

const CreateSubscriptionModal = ({visible, onClose, onAdd}: CreateSubscriptionModalProps) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
    const [category, setCategory] = useState<string>('');
    const [errors, setErrors] = useState<{name?: string; price?: string}>({});

    const resetForm = useCallback(() => {
        setName('');
        setPrice('');
        setFrequency('Monthly');
        setCategory('');
        setErrors({});
    }, []);

    const validate = useCallback((): boolean => {
        const newErrors: {name?: string; price?: string} = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        const priceNum = parseFloat(price);
        if (!price || isNaN(priceNum) || priceNum <= 0) {
            newErrors.price = 'Price must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [name, price]);

    const handleSubmit = useCallback(() => {
        if (!validate()) return;

        const priceNum = parseFloat(price);
        const now = dayjs();
        const startDate = now.format('YYYY-MM-DDTHH:mm:ss.000Z');
        const renewalDate = frequency === 'Monthly'
            ? now.add(1, 'month').format('YYYY-MM-DDTHH:mm:ss.000Z')
            : now.add(1, 'year').format('YYYY-MM-DDTHH:mm:ss.000Z');

        const newSubscription: Subscription = {
            id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            name: name.trim(),
            price: priceNum,
            currency: 'USD',
            billing: frequency,
            category: category || 'Other',
            status: 'active',
            startDate,
            renewalDate,
            icon: icons.plus,
            color: categoryColors[category] || categoryColors["Other"],
        };

        onAdd(newSubscription);

        posthog?.capture('subscription_created', {
            subscription_name: name.trim(),
            subscription_price: priceNum,
            subscription_frequency: frequency,
            subscription_category: category,
        });

        resetForm();
        onClose();
    }, [name, price, frequency, category, validate, onAdd, onClose, resetForm]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="modal-overlay">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                    keyboardVerticalOffset={0}
                >
                    <View className="modal-container">
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable onPress={onClose} className="modal-close">
                                <Text className="modal-close-text">×</Text>
                            </Pressable>
                        </View>

                        <View className="modal-body">
                            <View className="auth-field">
                                <Text className="auth-label">Name</Text>
                                <TextInput
                                    className={clsx('auth-input', errors.name && 'auth-input-error')}
                                    placeholder="Subscription name"
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        if (errors.name) setErrors(prev => ({...prev, name: undefined}));
                                    }}
                                    placeholderTextColor="rgba(0,0,0,0.4)"
                                />
                                {errors.name && <Text className="auth-error">{errors.name}</Text>}
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Price</Text>
                                <TextInput
                                    className={clsx('auth-input', errors.price && 'auth-input-error')}
                                    placeholder="0.00"
                                    value={price}
                                    onChangeText={(text) => {
                                        setPrice(text);
                                        if (errors.price) setErrors(prev => ({...prev, price: undefined}));
                                    }}
                                    keyboardType="decimal-pad"
                                    placeholderTextColor="rgba(0,0,0,0.4)"
                                />
                                {errors.price && <Text className="auth-error">{errors.price}</Text>}
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Frequency</Text>
                                <View className="picker-row">
                                    <Pressable
                                        onPress={() => setFrequency('Monthly')}
                                        className={clsx('picker-option', frequency === 'Monthly' && 'picker-option-active')}
                                    >
                                        <Text className={clsx('picker-option-text', frequency === 'Monthly' && 'picker-option-text-active')}>
                                            Monthly
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => setFrequency('Yearly')}
                                        className={clsx('picker-option', frequency === 'Yearly' && 'picker-option-active')}
                                    >
                                        <Text className={clsx('picker-option-text', frequency === 'Yearly' && 'picker-option-text-active')}>
                                            Yearly
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Category</Text>
                                <View className="category-scroll">
                                    {categories.map((cat) => (
                                        <Pressable
                                            key={cat}
                                            onPress={() => setCategory(cat)}
                                            className={clsx('category-chip', category === cat && 'category-chip-active')}
                                        >
                                            <Text className={clsx('category-chip-text', category === cat && 'category-chip-text-active')}>
                                                {cat}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <Pressable
                                onPress={handleSubmit}
                                className={clsx('auth-button', !name.trim() || !price || parseFloat(price) <= 0 && 'auth-button-disabled')}
                                disabled={!name.trim() || !price || parseFloat(price) <= 0}
                            >
                                <Text className="auth-button-text">Create Subscription</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default CreateSubscriptionModal;
