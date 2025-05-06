import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X, Calendar, Clock, Flag, Link, Image as ImageIcon, Video, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Task, TaskAttachment } from '@/types';
import { generateId } from '@/utils/helpers';
import DateTimePicker from './DateTimePicker';
import MediaPicker from './MediaPicker';

interface NewTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  parentTaskId?: string;
}

export default function NewTaskModal({ visible, onClose, onSave, parentTaskId }: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [dueTime, setDueTime] = useState<string | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentType, setAttachmentType] = useState<TaskAttachment['type']>('link');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      priority,
      isToday: dueDate === 'Today',
      parentTaskId,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    onSave(newTask);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setDueTime(null);
    setPriority(null);
    setAttachments([]);
    setShowAttachmentInput(false);
    setAttachmentUrl('');
    setAttachmentType('link');
  };

  const handleAddAttachment = () => {
    if (!attachmentUrl.trim()) return;

    const newAttachment: TaskAttachment = {
      id: generateId(),
      type: attachmentType,
      url: attachmentUrl.trim(),
      title: attachmentUrl.split('/').pop() || attachmentUrl,
    };

    setAttachments(prev => [...prev, newAttachment]);
    setAttachmentUrl('');
    setShowAttachmentInput(false);
  };

  const handleAddMediaAttachment = (uri: string) => {
    const newAttachment: TaskAttachment = {
      id: generateId(),
      type: attachmentType,
      url: uri,
      title: uri.split('/').pop() || uri,
    };

    setAttachments(prev => [...prev, newAttachment]);
    setShowMediaPicker(false);
    setShowAttachmentInput(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const priorityOptions: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {parentTaskId ? 'New Follow-up Task' : 'New Task'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="What needs to be done?"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add details about this task..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={20} color="#64748B" />
                  <Text style={styles.dateTimeButtonText}>
                    {dueDate ? dueDate : 'Select date'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Due Time</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock size={20} color="#64748B" />
                  <Text style={styles.dateTimeButtonText}>
                    {dueTime ? dueTime : 'Select time'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.optionsContainer}>
                  {priorityOptions.map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.optionChip,
                        priority === p && styles.optionChipSelected,
                        priority === p && styles[`priority${p.charAt(0).toUpperCase() + p.slice(1)}`]
                      ]}
                      onPress={() => setPriority(p)}
                    >
                      <Flag size={16} color={priority === p ? '#FFFFFF' : '#64748B'} />
                      <Text
                        style={[
                          styles.optionText,
                          priority === p && styles.optionTextSelected
                        ]}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.attachmentsHeader}>
                  <Text style={styles.label}>Attachments</Text>
                  {!showAttachmentInput && (
                    <TouchableOpacity
                      style={styles.addAttachmentButton}
                      onPress={() => setShowAttachmentInput(true)}
                    >
                      <Plus size={16} color="#3B82F6" />
                      <Text style={styles.addAttachmentText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {showAttachmentInput && (
                  <View style={styles.attachmentInput}>
                    <View style={styles.attachmentTypeButtons}>
                      <TouchableOpacity
                        style={[
                          styles.attachmentTypeButton,
                          attachmentType === 'link' && styles.attachmentTypeButtonActive
                        ]}
                        onPress={() => setAttachmentType('link')}
                      >
                        <Link size={16} color={attachmentType === 'link' ? '#3B82F6' : '#64748B'} />
                        <Text
                          style={[
                            styles.attachmentTypeText,
                            attachmentType === 'link' && styles.attachmentTypeTextActive
                          ]}
                        >
                          Link
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.attachmentTypeButton,
                          attachmentType === 'image' && styles.attachmentTypeButtonActive
                        ]}
                        onPress={() => {
                          setAttachmentType('image');
                          setShowMediaPicker(true);
                        }}
                      >
                        <ImageIcon size={16} color={attachmentType === 'image' ? '#3B82F6' : '#64748B'} />
                        <Text
                          style={[
                            styles.attachmentTypeText,
                            attachmentType === 'image' && styles.attachmentTypeTextActive
                          ]}
                        >
                          Image
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.attachmentTypeButton,
                          attachmentType === 'video' && styles.attachmentTypeButtonActive
                        ]}
                        onPress={() => {
                          setAttachmentType('video');
                          setShowMediaPicker(true);
                        }}
                      >
                        <Video size={16} color={attachmentType === 'video' ? '#3B82F6' : '#64748B'} />
                        <Text
                          style={[
                            styles.attachmentTypeText,
                            attachmentType === 'video' && styles.attachmentTypeTextActive
                          ]}
                        >
                          Video
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {attachmentType === 'link' && (
                      <View style={styles.attachmentUrlContainer}>
                        <TextInput
                          style={styles.attachmentUrlInput}
                          value={attachmentUrl}
                          onChangeText={setAttachmentUrl}
                          placeholder="Enter URL..."
                          placeholderTextColor="#94A3B8"
                          autoCapitalize="none"
                        />
                        <TouchableOpacity
                          style={styles.attachmentAddButton}
                          onPress={handleAddAttachment}
                        >
                          <Plus size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                {attachments.length > 0 && (
                  <View style={styles.attachmentsList}>
                    {attachments.map((attachment) => (
                      <View key={attachment.id} style={styles.attachmentItem}>
                        {attachment.type === 'link' && <Link size={16} color="#64748B" />}
                        {attachment.type === 'image' && <ImageIcon size={16} color="#64748B" />}
                        {attachment.type === 'video' && <Video size={16} color="#64748B" />}
                        <Text style={styles.attachmentItemText} numberOfLines={1}>
                          {attachment.title}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeAttachmentButton}
                          onPress={() => handleRemoveAttachment(attachment.id)}
                        >
                          <X size={14} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DateTimePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(value) => {
          setDueDate(value);
          setShowDatePicker(false);
        }}
        mode="date"
        currentValue={dueDate}
      />

      <DateTimePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelect={(value) => {
          setDueTime(value);
          setShowTimePicker(false);
        }}
        mode="time"
        currentValue={dueTime}
      />

      <Modal
        visible={showMediaPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <View style={styles.overlay}>
          <MediaPicker
            type={attachmentType === 'image' ? 'image' : 'video'}
            onSelect={handleAddMediaAttachment}
            onClose={() => setShowMediaPicker(false)}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateTimeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1E293B',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  optionChipSelected: {
    backgroundColor: '#4361EE',
  },
  optionText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  priorityLow: {
    backgroundColor: '#10B981',
  },
  priorityMedium: {
    backgroundColor: '#F59E0B',
  },
  priorityHigh: {
    backgroundColor: '#EF4444',
  },
  attachmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addAttachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addAttachmentText: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 4,
  },
  attachmentInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  attachmentTypeButtons: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  attachmentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  attachmentTypeButtonActive: {
    backgroundColor: '#EFF6FF',
  },
  attachmentTypeText: {
    fontSize: 14,
    color: '#64748B',
  },
  attachmentTypeTextActive: {
    color: '#3B82F6',
  },
  attachmentUrlContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  attachmentUrlInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attachmentAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentsList: {
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  attachmentItemText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
  },
  removeAttachmentButton: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  saveButton: {
    backgroundColor: '#4361EE',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});