import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useRandomUser} from '../states/queries/getRandomUser';
import {RefreshCw} from 'lucide-react-native';

const RandomUser = () => {
  const {data, isLoading, error, refetch, isRefetching} = useRandomUser();

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Có lỗi xảy ra khi tải dữ liệu</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data?.results?.[0]) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không có dữ liệu người dùng</Text>
      </View>
    );
  }

  const user = data.results[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{uri: user.picture.large}} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>
            {user.name.title} {user.name.first} {user.name.last}
          </Text>
          <Text style={styles.gender}>
            {user.gender === 'male' ? 'Nam' : 'Nữ'} • {user.dob.age} tuổi
          </Text>
          <Text style={styles.nationality}>{user.nat}</Text>
        </View>
        <TouchableOpacity
          disabled={isRefetching}
          style={styles.refreshButton}
          onPress={handleRefresh}>
          <RefreshCw size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Điện thoại:</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Di động:</Text>
          <Text style={styles.infoValue}>{user.cell}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Địa chỉ:</Text>
          <Text style={styles.infoValue}>
            {user.location.street.number} {user.location.street.name}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Thành phố:</Text>
          <Text style={styles.infoValue}>{user.location.city}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tỉnh/Bang:</Text>
          <Text style={styles.infoValue}>{user.location.state}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quốc gia:</Text>
          <Text style={styles.infoValue}>{user.location.country}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mã bưu điện:</Text>
          <Text style={styles.infoValue}>{user.location.postcode}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ngày sinh:</Text>
          <Text style={styles.infoValue}>
            {new Date(user.dob.date).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ngày đăng ký:</Text>
          <Text style={styles.infoValue}>
            {new Date(user.registered.date).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID:</Text>
          <Text style={styles.infoValue}>
            {user.id.name}: {user.id.value}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin đăng nhập</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{user.login.username}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>UUID:</Text>
          <Text style={styles.infoValue}>{user.login.uuid}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tọa độ</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Vĩ độ:</Text>
          <Text style={styles.infoValue}>
            {user.location.coordinates.latitude}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Kinh độ:</Text>
          <Text style={styles.infoValue}>
            {user.location.coordinates.longitude}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Múi giờ:</Text>
          <Text style={styles.infoValue}>
            {user.location.timezone.offset} -{' '}
            {user.location.timezone.description}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Seed: {data.info.seed} • Version: {data.info.version}
        </Text>
      </View>
    </ScrollView>
  );
};

export default RandomUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  gender: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  nationality: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    width: 100,
    marginRight: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});
