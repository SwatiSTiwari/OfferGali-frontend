import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { getAllDeals, editDeal } from "@/api/deals/deals";
import { useRoute } from "@react-navigation/native";
import { Link } from "expo-router";

const categories = [
  "Clothing",
  "Groceries",
  "Electronics",
  "Beauty Products",
  "Sports & Fitness",
  "Home & Furniture",
  "Toys & Baby products",
  "Books & Stationery",
];

export default function EditDeal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Select Category");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [price, setPrice] = useState<undefined | number>(undefined);
  const [originalPrice, setOriginalPrice] = useState<undefined | number>(
    undefined
  );
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [redemptionMethod, setRedemptionMethod] = useState("QR Code");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const route = useRoute();
  const { id }: any = route.params; // Get the deal ID from the route parameters

  useEffect(() => {
    const fetchDeal = async () => {
      const response = await getAllDeals();
      if (response.success) {
        const deal = response.deals.deals.find(
          (deal: any) => deal.id === parseInt(id)
        );
        if (deal) {
          setTitle(deal.title);
          setDescription(deal.description);
          setExpirationDate(new Date(deal.expiration_date));
          setRedemptionMethod(deal.redemption_instructions);
          setImage(deal.image);
          setPrice(deal.price);
          setOriginalPrice(deal.original_price);
          setCategory(deal.category || "General");
        } else {
          Alert.alert("Error", "Deal not found");
        }
      } else {
        Alert.alert("Error", response.message || "Failed to fetch deals");
      }
    };

    fetchDeal();
  }, [id]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false); // Close picker on Android
    if (selectedDate) setExpirationDate(selectedDate);
  };

  // Open Date Picker
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  // Function to Pick Image from Device
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Add selected image
    }
  };

  const handleUpdateDeal = async () => {
     if (
          !title ||
          !description ||
          !expirationDate ||
          !redemptionMethod ||
          !price ||
          !originalPrice ||
          !image
        ) {
          Alert.alert(
            "Error",
            "Please fill all required fields and upload at least one image."
          );
          return;
        }
    
        if (originalPrice < price) {
          Alert.alert(
            "Error",
            "Original price must be greater than the deal price."
          );
          return;
        }
    
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const ext = match ? `.${match[1]}` : ".jpg";
        const mimeType = `image/${ext.substring(1)}`;
    
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append(
          "expiration_date",
          expirationDate.toISOString().split("T")[0]
        );
        formData.append("redemption_instructions", redemptionMethod);
        formData.append("engagements", String(0));
        formData.append("views", String(0));
        formData.append("price", String(price));
        formData.append("original_price", String(originalPrice));
    
        // Append the image
        formData.append(
          "image",
          {
            uri: image,
            name: filename || `dealimage${ext}`,
            type: mimeType,
          } as any
        );

    const response = await editDeal(id, formData);

    if (response.success) {
      Alert.alert("Success", "Deal updated successfully");
      router.push("/dashboard");
    } else {
      Alert.alert("Error", response.message || "Failed to update deal");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Deal</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Deal Title*</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter deal title"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description*</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter deal description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Upload Images</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <FontAwesome name="cloud-upload" size={24} color="#999" />
              <Text style={styles.uploadText}>Tap to upload</Text>
            </TouchableOpacity>
            {image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Expiration Date*</Text>
            <TouchableOpacity style={styles.input} onPress={openDatePicker}>
              <Text style={styles.dateText}>
                {expirationDate.toDateString()}
              </Text>
              <FontAwesome name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={expirationDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Redemption Method*</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDropdown(true)}
            >
              <Text style={styles.selectText}>{redemptionMethod}</Text>
              <FontAwesome name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Deal Price*</Text>
            <TextInput
              style={styles.input}
              value={price !== undefined ? price.toString() : ""}
              onChangeText={(text) => {
                // Remove non-digit characters and parse to integer
                const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10);
                setPrice(isNaN(numericValue) ? undefined : numericValue);
              }}
              placeholder="Enter deal price"
              placeholderTextColor="#999"
              keyboardType="numeric"
              multiline={false}
              numberOfLines={1}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Original Price</Text>
            <TextInput
              style={styles.input}
              value={
                originalPrice !== undefined ? originalPrice.toString() : ""
              }
              onChangeText={(text) => {
                // Remove non-digit characters and parse to integer
                const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10);
                setOriginalPrice(
                  isNaN(numericValue) ? undefined : numericValue
                );
              }}
              placeholder="Enter original deal price"
              placeholderTextColor="#999"
              keyboardType="numeric"
              multiline={false}
              numberOfLines={1}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category*</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowCategoryDropdown(true)}
            >
              <Text style={styles.selectText}>{category}</Text>
              <FontAwesome name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Dropdown Modal */}
          <Modal
            visible={showDropdown}
            transparent
            animationType="fade"
            onRequestClose={() => setShowDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowDropdown(false)}
            >
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={redemptionMethod}
                  onValueChange={(itemValue) => {
                    setRedemptionMethod(itemValue);
                    setShowDropdown(false); // Close modal after selection
                  }}
                  style={styles.picker}
                  dropdownIconColor="#999"
                >
                  <Picker.Item
                    label="QR Code"
                    value="QR Code"
                    style={styles.pickerItem}
                  />
                  <Picker.Item
                    label="Coupon Code"
                    value="Coupon Code"
                    style={styles.pickerItem}
                  />
                  <Picker.Item
                    label="Physical Voucher"
                    value="Physical Voucher"
                    style={styles.pickerItem}
                  />
                  <Picker.Item
                    label="Online Redemption"
                    value="Online Redemption"
                    style={styles.pickerItem}
                  />
                </Picker>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Category Modal */}
          <Modal
            visible={showCategoryDropdown}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCategoryDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowCategoryDropdown(false)}
              activeOpacity={1}
            >
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => {
                    setCategory(itemValue);
                    setShowCategoryDropdown(false);
                  }}
                  style={styles.picker}
                  dropdownIconColor="#999"
                >
                  {categories.map((cat) => (
                    <Picker.Item
                      key={cat}
                      label={cat}
                      value={cat}
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUpdateDeal}
        >
          <Text style={styles.submitButtonText}>Update Deal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="home" size={24} color="#666" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/analytics" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="bar-chart" size={24} color="#666" />
            <Text style={styles.navText}>Analytics</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/dashboard" asChild>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="tag" size={24} color="#666" />
            <Text style={styles.navText}>Deal</Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={{
            pathname: "/profile",
            params: { role: "users" }, // add your props here
          }}
          asChild
        >
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="user" size={24} color="#666" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    borderStyle: "dashed",
  },
  uploadText: {
    color: "#666",
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  pickerItem: {
    fontSize: 16,
    color: "#666", // Ensure picker items are visible
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  dateText: {
    color: "#666",
  },
  selectText: {
    color: "#666",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  submitButton: {
    backgroundColor: "#FF4B55",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
