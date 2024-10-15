import React, { useReducer, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./screens/StartScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen"; // Nếu bạn cần thêm màn hình Settings
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons"; // Đảm bảo cài đặt thư viện này

// Định nghĩa context cho người dùng
export const MyContext = createContext<any>(null);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: true,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 80,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
};

// Giả lập hàm giảm thiểu cho người dùng
interface UserState {
  user: any;
}

const MyUserReducer = (
  state: UserState | null,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Start"
    >
      <Stack.Screen name="Start" component={StartScreen} />
    </Stack.Navigator>
  );
};

const AppNav = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center gap-1">
              <Text
                className={`text-sm ${
                  focused ? "text-[#16247d]" : "text-[#838487]"
                }`}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      {/* Nếu bạn có thêm màn hình Tab khác, có thể thêm vào đây */}
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        {user === null ? <AuthStack /> : <AppNav />}
      </NavigationContainer>
    </MyContext.Provider>
  );
};

export default App;
