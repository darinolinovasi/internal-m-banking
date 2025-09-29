import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#001F3F' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>PTDII</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="globe-outline" size={22} color="#222" style={{ marginRight: 16 }} />
            <Feather name="copy" size={22} color="#222" />
          </View>
        </View>
        <Text style={styles.greeting}>
          HALO, <Text style={styles.greetingName}>TAKUYA OHSAWA</Text>
        </Text>

        {/* Account Card */}
        <View style={styles.accountCard}>
          <LinearGradient colors={[
            "#007BFF",
            "#004A99"
          ]}
            style={{ padding: 16 }}
          >
            <TouchableOpacity style={styles.changeAccountBtn}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M4.2 4.79999C3.72261 4.79999 3.26477 4.98963 2.92721 5.3272C2.58964 5.66476 2.4 6.1226 2.4 6.59999V15C2.4 15.4774 2.58964 15.9352 2.92721 16.2728C3.26477 16.6103 3.72261 16.8 4.2 16.8H17.4C17.8774 16.8 18.3352 16.6103 18.6728 16.2728C19.0104 15.9352 19.2 15.4774 19.2 15V6.59999C19.2 6.1226 19.0104 5.66476 18.6728 5.3272C18.3352 4.98963 17.8774 4.79999 17.4 4.79999H4.2ZM7.2 5.99999V7.19999C7.2 7.83651 6.94714 8.44696 6.49706 8.89704C6.04697 9.34713 5.43652 9.59999 4.8 9.59999H3.6V8.39999H4.8C5.11826 8.39999 5.42348 8.27356 5.64853 8.04852C5.87357 7.82347 6 7.51825 6 7.19999V5.99999H7.2ZM10.8 12.9C10.243 12.9 9.7089 12.6787 9.31508 12.2849C8.92125 11.8911 8.7 11.3569 8.7 10.8C8.7 10.243 8.92125 9.70889 9.31508 9.31506C9.7089 8.92124 10.243 8.69999 10.8 8.69999C11.357 8.69999 11.8911 8.92124 12.2849 9.31506C12.6788 9.70889 12.9 10.243 12.9 10.8C12.9 11.3569 12.6788 11.8911 12.2849 12.2849C11.8911 12.6787 11.357 12.9 10.8 12.9ZM3.6 13.2V12H4.8C5.43652 12 6.04697 12.2528 6.49706 12.7029C6.94714 13.153 7.2 13.7635 7.2 14.4V15.6H6V14.4C6 14.0817 5.87357 13.7765 5.64853 13.5515C5.42348 13.3264 5.11826 13.2 4.8 13.2H3.6ZM16.8 13.2C16.4817 13.2 16.1765 13.3264 15.9515 13.5515C15.7264 13.7765 15.6 14.0817 15.6 14.4V15.6H14.4V14.4C14.4 13.7635 14.6529 13.153 15.1029 12.7029C15.553 12.2528 16.1635 12 16.8 12H18V13.2H16.8ZM16.8 8.39999H18V9.59999H16.8C16.1635 9.59999 15.553 9.34713 15.1029 8.89704C14.6529 8.44696 14.4 7.83651 14.4 7.19999V5.99999H15.6V7.19999C15.6 7.51825 15.7264 7.82347 15.9515 8.04852C16.1765 8.27356 16.4817 8.39999 16.8 8.39999ZM20.4 15C20.4 15.7956 20.0839 16.5587 19.5213 17.1213C18.9587 17.6839 18.1957 18 17.4 18H4.902C5.02613 18.3511 5.2561 18.655 5.56021 18.87C5.86432 19.0849 6.22761 19.2002 6.6 19.2H17.4C18.5139 19.2 19.5822 18.7575 20.3699 17.9698C21.1575 17.1822 21.6 16.1139 21.6 15V8.99999C21.6002 8.6276 21.4849 8.26431 21.27 7.9602C21.055 7.65609 20.7511 7.42612 20.4 7.30199V15Z" fill="white" />
              </Svg>
              <Text style={styles.changeAccountText}>Ubah Rekening</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.accountNumberLabel}>Rekening: <Text style={styles.accountNumber}>111223334445555</Text></Text>
              <TouchableOpacity>
                <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <Path d="M5 9.16666C5 6.80999 5 5.63082 5.7325 4.89916C6.46417 4.16666 7.64333 4.16666 10 4.16666H12.5C14.8567 4.16666 16.0358 4.16666 16.7675 4.89916C17.5 5.63082 17.5 6.80999 17.5 9.16666V13.3333C17.5 15.69 17.5 16.8692 16.7675 17.6008C16.0358 18.3333 14.8567 18.3333 12.5 18.3333H10C7.64333 18.3333 6.46417 18.3333 5.7325 17.6008C5 16.8692 5 15.69 5 13.3333V9.16666Z" stroke="white" strokeWidth="1.5" />
                  <Path d="M5 15.8333C4.33696 15.8333 3.70107 15.5699 3.23223 15.1011C2.76339 14.6323 2.5 13.9964 2.5 13.3333V8.33332C2.5 5.19082 2.5 3.61916 3.47667 2.64332C4.45333 1.66749 6.02417 1.66666 9.16667 1.66666H12.5C13.163 1.66666 13.7989 1.93005 14.2678 2.39889C14.7366 2.86773 15 3.50362 15 4.16666" stroke="white" strokeWidth="1.5" />
                </Svg>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View style={{ padding: 16 }}>
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceLabel}>Saldo Aktif</Text>
                <Text style={styles.balanceValue}>IDR 10,000,000,000.00</Text>
              </View>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#0062CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M1 12C8.33333 22.6667 15.6667 22.6667 23 12C15.6667 1.33333 8.33333 1.33333 1 12Z" stroke="#0062CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={{ borderBottomWidth: 0.5, borderColor: "#000" }} />
            <TouchableOpacity style={styles.mutasiBtn}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M19 11V10C19 6.229 19 4.343 17.828 3.172C16.656 2.001 14.771 2 11 2C7.229 2 5.343 2 4.172 3.172C3.001 4.344 3 6.229 3 10V14C3 17.771 3 19.657 4.172 20.828C5.344 21.999 7.229 22 11 22" stroke="#0062CB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M21 22L19.286 20.286M19.857 17.429C19.8648 17.8842 19.7818 18.3363 19.613 18.7591C19.4442 19.1819 19.1929 19.5668 18.8738 19.8914C18.5546 20.2161 18.1741 20.4739 17.7542 20.6499C17.3344 20.8259 16.8837 20.9166 16.4285 20.9166C15.9733 20.9166 15.5226 20.8259 15.1028 20.6499C14.6829 20.4739 14.3024 20.2161 13.9832 19.8914C13.6641 19.5668 13.4128 19.1819 13.244 18.7591C13.0752 18.3363 12.9922 17.8842 13 17.429C13.0154 16.5299 13.3833 15.6727 14.0246 15.0423C14.6659 14.4118 15.5292 14.0586 16.4285 14.0586C17.3278 14.0586 18.1911 14.4118 18.8324 15.0423C19.4737 15.6727 19.8416 16.5299 19.857 17.429Z" stroke="#0062CB" strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M7 7H15M7 11H11" stroke="#0062CB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.mutasiText}>Mutasi Rekening</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.mainActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Svg height={52} width={52} viewBox="0 0 52 52" fill="none">
              <Path d="M11.66 34.435a6.086 6.086 0 00-.285 1.848c0-.635.102-1.26.29-1.848h-.006zm3.874-13.214h-6.19v9.558h6.19l.655.264 26.467 10.633V10.324L16.19 20.957l-.655.264z"
                fill="#0062CB" fillOpacity=".15" />
              <Path
                d="M44.688 5.688c-.194 0-.392.035-.59.116l-29.27 11.761H6.5c-.447 0-.813.376-.813.843v15.184c0 .467.366.843.813.843h5.165a6.09 6.09 0 00-.29 1.848c0 3.347 2.732 6.069 6.094 6.069a6.105 6.105 0 005.885-4.49l20.75 8.339c.198.076.396.117.589.117.858 0 1.625-.721 1.625-1.686V7.373c-.005-.964-.767-1.686-1.63-1.686zM17.468 38.71a2.433 2.433 0 01-2.437-2.428c0-.569.198-1.112.559-1.544l4.311 1.732a2.444 2.444 0 01-2.432 2.24zm25.188 2.965L16.19 31.043l-.655-.264h-6.19V21.22h6.19l.655-.264 26.467-10.633v31.352z"
                fill="#0062CB" />
            </Svg>
            <Text style={styles.actionText}>Daftar Notifikasi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <Path d="M13 37.8016L26 42.5293L39 37.8016V9.34375H13V37.8016ZM18.266 15.8945C18.327 15.859 18.393 15.8438 18.459 15.8438H21.2875C21.3623 15.8442 21.4356 15.8652 21.4992 15.9047C21.5629 15.9441 21.6144 16.0003 21.648 16.0672L25.9492 24.6391H26.1168L30.418 16.0672C30.484 15.9301 30.6262 15.8438 30.7785 15.8438H33.5461C33.7695 15.8438 33.9523 16.0266 33.9574 16.2449C33.9574 16.3109 33.9371 16.377 33.9066 16.4379L28.6406 26.1676H31.5656C31.7891 26.1676 31.9719 26.3504 31.9719 26.5738V27.95C31.9719 28.1734 31.7891 28.3563 31.5656 28.3563H27.691V30.3367H31.5656C31.7891 30.3367 31.9719 30.5195 31.9719 30.743V32.1191C31.9719 32.3426 31.7891 32.5254 31.5656 32.5254H27.691V35.75C27.691 35.9734 27.5082 36.1562 27.2848 36.1562H24.7508C24.5273 36.1562 24.3445 35.9734 24.3445 35.75V32.5305H20.4852C20.2617 32.5305 20.0789 32.3477 20.0789 32.1242V30.748C20.0789 30.5246 20.2617 30.3418 20.4852 30.3418H24.3445V28.3613H20.4852C20.2617 28.3613 20.0789 28.1785 20.0789 27.9551V26.5789C20.0789 26.3555 20.2617 26.1727 20.4852 26.1727H23.3797L18.1035 16.443C17.9969 16.25 18.068 16.0012 18.266 15.8945Z" fill="#0062CB" fillOpacity="0.15" />
              <Path d="M46.2871 35.5824C46.269 35.5319 46.241 35.4855 46.2048 35.4459C46.1687 35.4063 46.125 35.3742 46.0764 35.3515C46.0278 35.3289 45.9751 35.3161 45.9215 35.3139C45.8679 35.3117 45.8144 35.3201 45.7641 35.3387L42.6562 36.4711V9.14062C42.6562 7.23125 41.1125 5.6875 39.2031 5.6875H12.7969C10.8875 5.6875 9.34375 7.23125 9.34375 9.14062V36.4711L6.23086 35.3387C6.18516 35.3234 6.13945 35.3133 6.09375 35.3133C5.87031 35.3133 5.6875 35.4961 5.6875 35.7195V38.7461C5.6875 38.9137 5.79414 39.066 5.95664 39.1269L25.4414 46.216C25.802 46.348 26.193 46.348 26.5535 46.216L46.0434 39.132C46.2059 39.0711 46.3125 38.9187 46.3125 38.7512V35.7246C46.3125 35.6738 46.3023 35.6281 46.2871 35.5824ZM39 37.8016L26 42.5293L13 37.8016V9.34375H39V37.8016Z" fill="#0062CB" />
              <Path d="M23.3797 26.1727H20.4852C20.2617 26.1727 20.0789 26.3555 20.0789 26.5789V27.9551C20.0789 28.1785 20.2617 28.3613 20.4852 28.3613H24.3445V30.3418H20.4852C20.2617 30.3418 20.0789 30.5246 20.0789 30.748V32.1242C20.0789 32.3477 20.2617 32.5305 20.4852 32.5305H24.3445V35.75C24.3445 35.9734 24.5273 36.1562 24.7508 36.1562H27.2848C27.5082 36.1562 27.691 35.9734 27.691 35.75V32.5254H31.5656C31.7891 32.5254 31.9719 32.3426 31.9719 32.1191V30.743C31.9719 30.5195 31.7891 30.3367 31.5656 30.3367H27.691V28.3563H31.5656C31.7891 28.3563 31.9719 28.1734 31.9719 27.95V26.5738C31.9719 26.3504 31.7891 26.1676 31.5656 26.1676H28.6406L33.9066 16.4379C33.9371 16.377 33.9574 16.3109 33.9574 16.2449C33.9523 16.0266 33.7695 15.8438 33.5461 15.8438H30.7785C30.6262 15.8438 30.484 15.9301 30.418 16.0672L26.1168 24.6391H25.9492L21.648 16.0672C21.6144 16.0003 21.5629 15.9441 21.4993 15.9047C21.4356 15.8652 21.3624 15.8442 21.2875 15.8438H18.459C18.393 15.8438 18.327 15.859 18.266 15.8945C18.068 16.0012 17.9969 16.25 18.1035 16.443L23.3797 26.1727Z" fill="#0062CB" />
            </Svg>
            <Text style={styles.actionText}>Daftar Reimburse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <Path d="M41.6 19.5H6.06668C5.60697 19.5 5.16609 19.6826 4.84103 20.0077C4.51596 20.3327 4.33334 20.7736 4.33334 21.2333V39.4333C4.33334 39.893 4.51596 40.3339 4.84103 40.659C5.16609 40.9841 5.60697 41.1667 6.06668 41.1667H41.6C42.0597 41.1667 42.5006 40.9841 42.8257 40.659C43.1507 40.3339 43.3333 39.893 43.3333 39.4333V21.2333C43.3333 20.7736 43.1507 20.3327 42.8257 20.0077C42.5006 19.6826 42.0597 19.5 41.6 19.5Z" fill="#0062CB" fillOpacity="0.16" />
              <Path d="M10.8333 19.5V14.7333C10.8333 13.78 11.6133 13 12.5667 13H48.1C49.0533 13 49.8333 13.78 49.8333 14.7333V32.9333C49.8333 33.8867 49.0533 34.6667 48.1 34.6667H43.3333M6.06668 19.5H41.6C42.0597 19.5 42.5006 19.6826 42.8257 20.0077C43.1507 20.3327 43.3333 20.7736 43.3333 21.2333V39.4333C43.3333 39.893 43.1507 40.3339 42.8257 40.659C42.5006 40.9841 42.0597 41.1667 41.6 41.1667H6.06668C5.60697 41.1667 5.16609 40.9841 4.84103 40.659C4.51596 40.3339 4.33334 39.893 4.33334 39.4333V21.2333C4.33334 20.7736 4.51596 20.3327 4.84103 20.0077C5.16609 19.6826 5.60697 19.5 6.06668 19.5ZM26 30.3333C26 30.908 25.7717 31.4591 25.3654 31.8654C24.9591 32.2717 24.408 32.5 23.8333 32.5C23.2587 32.5 22.7076 32.2717 22.3013 31.8654C21.895 31.4591 21.6667 30.908 21.6667 30.3333C21.6667 29.7587 21.895 29.2076 22.3013 28.8013C22.7076 28.3949 23.2587 28.1667 23.8333 28.1667C24.408 28.1667 24.9591 28.3949 25.3654 28.8013C25.7717 29.2076 26 29.7587 26 30.3333Z" stroke="#0062CB" strokeWidth="3.25" strokeMiterlimit="10" strokeLinejoin="round" />
            </Svg>

            <Text style={styles.actionText}>Daftar Rekening</Text>
          </TouchableOpacity>
        </View>

        {/* Menunggu Pembayaran */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Menunggu Pembayaran</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Lihat Lainnya</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.paymentCard}>
            <View>
              <Text style={styles.paymentTitle}>Pembayaran Wazapbro</Text>
              <Text style={styles.paymentDesc}>Disbursement • VA</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={styles.paymentAmount}>IDR </Text>
              <Text style={{ ...styles.paymentAmountValue, ...styles.paymentAmount }}>1,500,000.00</Text>
            </View>
          </View>
          <View style={styles.paymentCard}>
            <View>
              <Text style={styles.paymentTitle}>Biaya Reimburse Alif Firdi</Text>
              <Text style={styles.paymentDesc}>Reimbursement • Transfer Bank</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={styles.paymentAmount}>IDR </Text>
              <Text style={{ ...styles.paymentAmountValue, ...styles.paymentAmount }}>600,000.00</Text>
            </View>
          </View>
          <View style={styles.paymentCard}>
            <View>
              <Text style={styles.paymentTitle}>Pembayaran Tokopedia</Text>
              <Text style={styles.paymentDesc}>Disbursement • VA</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={styles.paymentAmount}>IDR </Text>
              <Text style={{ ...styles.paymentAmountValue, ...styles.paymentAmount }}>1,850,000.00</Text>
            </View>
          </View>
        </ScrollView>
      </View>
      {/* Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={26} color="#fff" />
          <Text style={styles.navLabel}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="view-list-outline" size={26} color="#fff" />
          <Text style={styles.navLabel}>Transaksi</Text>
        </TouchableOpacity>
        <View style={styles.centerNavItemWrapper}>
          <TouchableOpacity style={styles.centerNavItem}>
            <MaterialIcons name="credit-card" size={32} color="#fff" />
            <MaterialIcons name="arrow-upward" size={18} color="#fff" style={styles.transferArrow} />
          </TouchableOpacity>
          <Text style={styles.centerNavLabel}>Transfer</Text>
        </View>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="history" size={26} color="#fff" />
          <Text style={styles.navLabel}>Jadwal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={26} color="#fff" />
          <Text style={styles.navLabel}>Akun Saya</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'Inter_900Black_Italic',
    fontSize: 28,
    color: '#222',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    marginTop: 4,
    fontSize: 13,
    color: '#000',
    letterSpacing: 0.5,
  },
  greetingName: {
    color: '#222',
    fontWeight: 'bold',
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  changeAccountBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1976D2',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  changeAccountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  accountNumberLabel: {
    fontSize: 13,
    color: '#FFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  accountNumber: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: 13,
    color: '#000',
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    marginTop: 2,
  },
  mutasiBtn: {
    display: 'flex',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  mutasiText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  mainActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#1976D2',
    marginTop: 6,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  sectionLink: {
    color: '#1976D2',
    fontSize: 13,
  },
  paymentCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  paymentTitle: {
    fontWeight: 600,
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  paymentDesc: {
    fontSize: 14,
    color: '#333',
    fontWeight: 300,
    marginBottom: 6,
  },
  paymentAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1976D2',
  },
  paymentAmountValue: {
    color: '#222',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#06224A',
    height: 74,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    zIndex: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  navLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
    fontWeight: '600',
  },
  centerNavItemWrapper: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  centerNavItem: {
    backgroundColor: '#178AFF',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    position: 'relative',
    zIndex: 11,
    elevation: 12,
  },
  transferArrow: {
    position: 'absolute',
    right: 14,
    top: 18,
  },
  centerNavLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});
