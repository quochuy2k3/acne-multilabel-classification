// screens/StartScreen.tsx
import React, { useContext } from "react"; // Thêm useContext
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, ImageBackground } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MyContext } from "../App"; // Import MyContext

type StartScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const [user, dispatch] = useContext(MyContext); // Lấy context

  // Giả lập một đối tượng user (thay đổi giá trị này theo yêu cầu của bạn)
  const userData = { name: "User Name", email: "user@example.com" };

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/premium-photo/view-vague-medical-horizon-stock-photo-perfection-medical-background-blur-vertical-mobile-wallpaper_904318-11987.jpg",
      }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <StatusBar style="auto" />
      <Text className="text-center mt-3 text-2xl font-light text-stone-900">
        Chào Mừng!
      </Text>
      <TouchableOpacity
        className="bg-orange-300 rounded-md mt-4 p-3 w-3/4"
        onPress={() => {
          dispatch({ type: "LOGIN", payload: userData }); // Thiết lập user khác null
        }}
      >
        <Text className="text-center text-white font-semibold">Bắt đầu</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default StartScreen;
