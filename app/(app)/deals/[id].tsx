import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DealDetails = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Deal Details</Text>
            <Text style={styles.description}>This is where the deal details will be displayed.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
    },
});

export default DealDetails;