// Quick test to verify notification screen JSX structure
import React from 'react';
import { View, Text } from 'react-native';

// Simulate the key problematic patterns to ensure they're fixed
const TestComponent = () => {
  const notifications = [];
  const error = "Test error";
  
  return (
    <View style={{ flex: 1 }}>
      {/* Test the header title fix */}
      <Text>
        Notifications{notifications.length > 0 ? ` (${notifications.filter(n => !n.is_read).length})` : ''}
      </Text>
      
      {/* Test error rendering */}
      <Text>{error}</Text>
      
      {/* Test debug info structure */}
      <View>
        <Text>Debug Info:</Text>
        <Text>ID: N/A</Text>
      </View>
    </View>
  );
};

export default TestComponent;
