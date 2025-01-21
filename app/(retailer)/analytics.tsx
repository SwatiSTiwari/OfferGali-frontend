import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

export default function Analytics() {
  const router = useRouter();

  const viewsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43]
    }]
  };

  const engagementData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      data: [20, 45, 28, 80]
    }]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>23.6K</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8.2%</Text>
            <Text style={styles.statLabel}>Engagement Rate</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filters</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
              <Text style={styles.filterButtonTextActive}>Last 1 week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>All Categories</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Views Over Time</Text>
          <LineChart
            data={viewsData}
            width={350}
            height={200}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 75, 85, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Engagement Metrics</Text>
          <BarChart
            data={engagementData}
            width={350}
            height={200}
            yAxisLabel="$"
            yAxisSuffix="k"
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 75, 85, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        </View>

        <View style={styles.exportContainer}>
          <TouchableOpacity style={styles.exportButton}>
            <FontAwesome name="download" size={20} color="#FF4B55" />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
          <View style={styles.exportFormats}>
            <TouchableOpacity style={styles.formatButton}>
              <Text style={styles.formatButtonText}>CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <Text style={styles.formatButtonText}>PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#FF4B55',
    borderColor: '#FF4B55',
  },
  filterButtonText: {
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  chartContainer: {
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 16,
  },
  exportContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4B55',
    marginBottom: 10,
  },
  exportButtonText: {
    color: '#FF4B55',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  exportFormats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  formatButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  formatButtonText: {
    color: '#666',
  },
});

