import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home as HomeIcon, Search, ShoppingCart, User } from 'lucide-react-native';
import { CartProvider, useCart } from './src/CartContext';
import { ToastProvider } from './src/components/Toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from './src/theme';

// ─── Screens ──────────────────────────────────────────────────────────────────
import HomeScreen           from './src/screens/HomeScreen';
import CartScreen           from './src/screens/CartScreen';
import CategoriesScreen     from './src/screens/CategoriesScreen';
import ProfileScreen        from './src/screens/ProfileScreen';
import CheckoutScreen       from './src/screens/CheckoutScreen';
import OrdersScreen         from './src/screens/OrdersScreen';
import SearchScreen         from './src/screens/SearchScreen';
import ProductDetailScreen  from './src/screens/ProductDetailScreen';
import AddressListScreen    from './src/screens/AddressListScreen';
import AddAddressScreen     from './src/screens/AddAddressScreen';
import CategoryProductsScreen from './src/screens/CategoryProductsScreen';
import OrderTrackingScreen  from './src/screens/OrderTrackingScreen';
import OrderDetailScreen    from './src/screens/OrderDetailScreen';
import MembershipTiersScreen from './src/screens/MembershipTiersScreen';
import SettingsScreen       from './src/screens/SettingsScreen';
import EditProfileScreen    from './src/screens/EditProfileScreen';
import SupportChatScreen   from './src/screens/SupportChatScreen';
import PhoneInputScreen     from './src/screens/auth/PhoneInputScreen';
import OTPVerifyScreen      from './src/screens/auth/OTPVerifyScreen';
import ProfileSetupScreen   from './src/screens/auth/ProfileSetupScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Auth Stack ──────────────────────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneInput"   component={PhoneInputScreen} />
      <Stack.Screen name="OTPVerify"    component={OTPVerifyScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

// ─── Cart badge icon ─────────────────────────────────────────────────────────
function CartTabIcon({ color, size }: { color: string; size: number }) {
  const { totalItems } = useCart();
  return (
    <View>
      <ShoppingCart color={color} size={size} />
      {totalItems > 0 && (
        <View style={badge.wrap}>
          <Text style={badge.text}>{totalItems > 99 ? '99+' : totalItems}</Text>
        </View>
      )}
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  text: { color: '#fff', fontSize: 10, fontWeight: '800' },
});

// ─── Home Stack ───────────────────────────────────────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain"      component={HomeScreen} />
      <Stack.Screen name="Search"        component={SearchScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="MembershipTiers" component={MembershipTiersScreen} />
    </Stack.Navigator>
  );
}

// ─── Categories Stack ────────────────────────────────────────────────────────
function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriesMain" component={CategoriesScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

// ─── Cart Stack ───────────────────────────────────────────────────────────────
function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartMain" component={CartScreen} />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerShown: true,
          title: 'Checkout',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{
          headerShown: true,
          title: 'My Addresses',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddressScreen}
        options={{
          headerShown: true,
          title: 'Add New Address',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

// ─── Profile Stack ────────────────────────────────────────────────────────────
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          headerShown: true,
          title: 'My Orders',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          headerShown: true,
          title: 'Order Details',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{
          headerShown: true,
          title: 'My Addresses',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddressScreen}
        options={{
          headerShown: true,
          title: 'Add New Address',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerTintColor: Colors.primary,
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="SupportChat"
        component={SupportChatScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home')       return <HomeIcon color={color} size={size} />;
          if (route.name === 'Categories') return <Search color={color} size={size} />;
          if (route.name === 'Cart')       return <CartTabIcon color={color} size={size} />;
          if (route.name === 'Profile')    return <User color={color} size={size} />;
          return null;
        },
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: '#aaa',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderColor: '#eee',
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Home"       component={HomeStack}       options={{ title: 'Home' }} />
      <Tab.Screen name="Categories" component={CategoriesStack} options={{ title: 'Categories' }} />
      <Tab.Screen name="Cart"       component={CartStack}       options={{ title: 'Cart' }} />
      <Tab.Screen name="Profile"    component={ProfileStack}    options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <ToastProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth"    component={AuthStack} />
              <Stack.Screen name="MainApp" component={RootNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}
