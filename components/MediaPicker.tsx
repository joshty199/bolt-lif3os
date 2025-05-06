import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera, Image as ImageIcon, Video, Upload } from 'lucide-react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { CameraView } from 'expo-camera';

interface MediaPickerProps {
  type: 'image' | 'video';
  onSelect: (uri: string) => void;
  onClose: () => void;
}

export default function MediaPicker({ type, onSelect, onClose }: MediaPickerProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();

  const handlePickMedia = async () => {
    if (!mediaPermission?.granted) {
      const permission = await requestMediaPermission();
      if (!permission.granted) return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets[0]) {
      onSelect(result.assets[0].uri);
      onClose();
    }
  };

  const handleOpenCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) return;
    }
    setShowCamera(true);
  };

  const handleCapture = async () => {
    if (!showCamera) return;
    
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchCameraAsync(options);

    if (!result.canceled && result.assets[0]) {
      onSelect(result.assets[0].uri);
      onClose();
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera}>
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={handleCapture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Add {type === 'image' ? 'Image' : 'Video'}
        </Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity 
          style={styles.option}
          onPress={handlePickMedia}
        >
          <View style={styles.optionIcon}>
            <Upload size={24} color="#3B82F6" />
          </View>
          <Text style={styles.optionTitle}>Choose from library</Text>
          <Text style={styles.optionDescription}>
            Select {type === 'image' ? 'an image' : 'a video'} from your device
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.option}
          onPress={handleOpenCamera}
        >
          <View style={styles.optionIcon}>
            <Camera size={24} color="#3B82F6" />
          </View>
          <Text style={styles.optionTitle}>Take {type === 'image' ? 'photo' : 'video'}</Text>
          <Text style={styles.optionDescription}>
            Use your camera to capture {type === 'image' ? 'an image' : 'a video'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onClose}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  options: {
    gap: 16,
    marginBottom: 24,
  },
  option: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  closeButton: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
});