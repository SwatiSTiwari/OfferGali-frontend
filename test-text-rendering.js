// Test to verify notification structure
console.log('Testing notification text rendering...');

// Simulate the problematic pattern that was causing the error
const testData = {
  id: 'test-1',
  message: 'Test notification',
  is_read: false,
  created_at: new Date().toISOString(),
  deals: null
};

// Test the text that was causing issues
const testComponent = () => {
  return {
    notificationTitle: testData.deals ? "New Deal Alert" : "Notification",
    message: testData.message || "No message",
    timestamp: testData.created_at ? 
      `${new Date(testData.created_at).toLocaleDateString()} at ${new Date(testData.created_at).toLocaleTimeString()}` :
      'Unknown time'
  };
};

const result = testComponent();
console.log('Test results:', result);
console.log('All text values are strings:', 
  typeof result.notificationTitle === 'string' &&
  typeof result.message === 'string' &&
  typeof result.timestamp === 'string'
);
