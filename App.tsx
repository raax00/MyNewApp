import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';

export default function App() {
  // TELEGRAM BOT SETTINGS (Yahan apna Bot Token aur Chat ID dalein)
  const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
  const CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID';
  const UPI_ID = '8406962570@ybl';

  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedItem, setSelectedItem] = useState({ name: '', price: '' });
  const [gameId, setGameId] = useState('');

  // Popularity Items list
  const products = [
    { name: 'Motorcycle (200 Pop)', price: '20', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500' },
    { name: 'Sports Car (1000 Pop)', price: '100', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500' },
    { name: 'Airplane (5000 Pop)', price: '450', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500' },
  ];

  const sendTelegramMessage = async (amount: string) => {
    const msg = `🚀 *New Order Initiated*\nGame ID: \`${gameId}\`\nItem: ${selectedItem.name}\nAmount: ₹${amount}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: msg,
          parse_mode: 'Markdown',
        }),
      });
    } catch (error) {
      console.log('Telegram Error:', error);
    }
  };

  const processPayment = () => {
    const amount = selectedItem.price;
    sendTelegramMessage(amount); 

    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=PremiumStore&am=${amount}&cu=INR`;
    Linking.openURL(upiUrl).catch(() => {
      Alert.alert('Error', 'Koi UPI App (PhonePe/Paytm/GPay) nahi mila!');
    });
  };

  // 1. Home Screen UI
  if (currentScreen === 'Home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Premium Store</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollList}>
          {products.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedItem(item);
                setCurrentScreen('Order');
              }}>
              <Image source={{ uri: item.img }} style={styles.cardImage} />
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardPrice}>₹{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 2. Order Screen UI
  if (currentScreen === 'Order') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('Home')}>
            <Text style={styles.backButton}>{"< Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Enter Details</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.selectedItemText}>Item: {selectedItem.name}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter BGMI Game ID"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={gameId}
            onChangeText={setGameId}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              if (gameId.length < 5) {
                Alert.alert('Invalid', 'Sahi Game ID dalein!');
                return;
              }
              setCurrentScreen('Payment');
            }}>
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 3. Payment Screen UI
  if (currentScreen === 'Payment') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('Order')}>
            <Text style={styles.backButton}>{"< Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Checkout</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.totalText}>Total Amount to Pay</Text>
          <Text style={styles.amountText}>₹{selectedItem.price}</Text>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#34C759' }]} onPress={processPayment}>
            <Text style={styles.buttonText}>Pay via UPI</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    color: '#0A84FF',
    fontSize: 16,
  },
  scrollList: {
    padding: 15,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardPrice: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    marginTop: 20,
  },
  selectedItemText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#0A84FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  amountText: {
    color: '#34C759',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
});
