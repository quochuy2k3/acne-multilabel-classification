import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const HomeScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processedImageUri, setProcessedImageUri] = useState<string | null>(
    null
  );
  const [labelcnn, setLabelcnn] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Use useEffect to send image to server after imageUri is updated
  useEffect(() => {
    if (imageUri) {
      sendImageToServer(imageUri);
    }
  }, [imageUri]);

  const handleModelSelection = (model: string) => {
    setSelectedModel(model);
    setImageUri(null);
    setLabelcnn(null);
    setProcessedImageUri(null);
  };

  const handleChooseImage = async () => {
    if (!selectedModel) {
      Alert.alert("Chọn model", "Vui lòng chọn model trước khi tiếp tục.");
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Quyền truy cập bị từ chối",
        "Bạn cần cấp quyền truy cập vào thư viện ảnh để chọn ảnh."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      console.log("User cancelled image picker");
    } else {
      if (result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setImageUri(selectedUri); // State is updated asynchronously
      } else {
        console.log("No image uri found");
      }
    }
  };

  const sendImageToServer = async (uri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    const apiUrl =
      selectedModel === "model1"
        ? "http://127.0.0.1:5000/predict_w_yolov8"
        : "http://127.0.0.1:5000/predict_w_simplecnn";

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from server:", response.data);

      if (selectedModel === "model2") {
        setProcessedImageUri(uri); // Use the original image for Model 2
        setLabelcnn(response.data.predicted_labels.join(", "));
      } else if (selectedModel === "model1") {
        const imgBase64 = response.data.image;
        setProcessedImageUri(`data:image/jpeg;base64,${imgBase64}`);
      }
    } catch (error) {
      console.error("Error sending image to server:", error);
      Alert.alert("Có lỗi xảy ra", "Không thể gửi hình ảnh đến server.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-center mt-3 text-2xl font-light text-black">
        Hãy chọn hình và trải nghiệm thôi nào
      </Text>

      <View className="flex-row mt-5">
        <TouchableOpacity
          onPress={() => handleModelSelection("model1")}
          className={`w-32 h-12 justify-center items-center rounded-md mx-2 ${
            selectedModel === "model1" ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white">Model YOLOv8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleModelSelection("model2")}
          className={`w-32 h-12 justify-center items-center rounded-md mx-2 ${
            selectedModel === "model2" ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white">Model SimpleCNN</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleChooseImage}
        className="w-52 h-52 border-2 border-dashed border-gray-300 flex justify-center items-center mt-5 bg-gray-100"
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full rounded-md"
            resizeMode="contain"
          />
        ) : (
          <Text className="text-center text-gray-500">
            Nhấn vào đây để chọn ảnh
          </Text>
        )}
      </TouchableOpacity>

      {processedImageUri && (
        <View className="mt-5">
          <Text className="text-center mt-3 text-2xl font-light text-black">
            Kết quả:
          </Text>
          {labelcnn && (
            <Text className="text-center mb-[-50px] text-xl font-light text-black">
              {labelcnn}
            </Text>
          )}

          <Image
            source={{ uri: processedImageUri }}
            className="w-80 h-80 rounded-md"
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
