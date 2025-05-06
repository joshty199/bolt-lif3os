import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { X, Smile, Hash, Mic, Send } from 'lucide-react-native';
import { JournalEntry } from '@/types';
import { generateId } from '@/utils/helpers';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface NewJournalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
}

const TEMPLATES = [
  {
    id: 'daily',
    name: 'Daily Reflection',
    questions: [
      'What was the highlight of your day?',
      'What challenged you today?',
      'What are you grateful for?',
      'What did you learn today?',
      'What would you like to focus on tomorrow?'
    ]
  },
  {
    id: 'goals',
    name: 'Goal Setting',
    questions: [
      'What are your main goals for today/this week?',
      'What steps will you take to achieve them?',
      'What potential obstacles might you face?',
      'How will you measure success?',
      'What support or resources do you need?'
    ]
  },
  {
    id: 'mood',
    name: 'Mood Check-in',
    questions: [
      'How are you feeling right now?',
      'What contributed to this mood?',
      'How has your mood changed throughout the day?',
      'What could help improve your mood?',
      'What activities made you feel good today?'
    ]
  },
  {
    id: 'creativity',
    name: 'Creative Thoughts',
    questions: [
      'What new ideas came to you today?',
      'What inspired you recently?',
      'What would you like to create or express?',
      'What creative challenges are you facing?',
      'How can you nurture your creativity?'
    ]
  }
];

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'productive', emoji: '💪', label: 'Productive' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic' },
  { id: 'tired', emoji: '😴', label: 'Tired' }
];

const POPULAR_TAGS = ['productivity', 'goals', 'reflection', 'gratitude', 'work', 'health', 'ideas', 'learning'];

export default function NewJournalModal({ visible, onClose, onSave }: NewJournalModalProps) {
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const { isRecording, startRecording, stopRecording } = useVoiceInput({
    onTranscript: (text) => {
      setContent(prev => prev + ' ' + text);
    }
  });

  const handleSave = () => {
    if (!content.trim()) return;

    const entry: JournalEntry = {
      id: generateId(),
      content: content.trim(),
      date: 'Today',
      mood: mood || undefined,
      tags: tags.length > 0 ? tags : undefined,
      isToday: true,
      isThisWeek: true,
      hasMood: !!mood
    };

    onSave(entry);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setContent('');
    setSelectedTemplate(null);
    setMood(null);
    setTags([]);
    setNewTag('');
    setShowTagInput(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
    }
    setNewTag('');
    setShowTagInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setContent(template.questions.join('\n\n'));
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>New Journal Entry</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {!selectedTemplate && (
              <View style={styles.templatesSection}>
                <Text style={styles.sectionTitle}>Choose a Template</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.templatesContainer}
                >
                  {TEMPLATES.map(template => (
                    <TouchableOpacity
                      key={template.id}
                      style={styles.templateCard}
                      onPress={() => handleSelectTemplate(template.id)}
                    >
                      <Text style={styles.templateName}>{template.name}</Text>
                      <Text style={styles.templatePreview}>
                        {template.questions[0]}...
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>How are you feeling?</Text>
              <View style={styles.moodsContainer}>
                {MOODS.map(moodOption => (
                  <TouchableOpacity
                    key={moodOption.id}
                    style={[
                      styles.moodChip,
                      mood === moodOption.id && styles.moodChipSelected
                    ]}
                    onPress={() => setMood(moodOption.id)}
                  >
                    <Text style={styles.moodEmoji}>{moodOption.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        mood === moodOption.id && styles.moodLabelSelected
                      ]}
                    >
                      {moodOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.textInputHeader}>
                <Text style={styles.label}>Your Thoughts</Text>
                <TouchableOpacity
                  style={[
                    styles.voiceButton,
                    isRecording && styles.voiceButtonActive
                  ]}
                  onPress={() => {
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording();
                    }
                  }}
                >
                  <Mic size={16} color={isRecording ? '#FFFFFF' : '#3B82F6'} />
                  <Text
                    style={[
                      styles.voiceButtonText,
                      isRecording && styles.voiceButtonTextActive
                    ]}
                  >
                    {isRecording ? 'Stop' : 'Voice'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textArea}
                value={content}
                onChangeText={setContent}
                placeholder="Write your thoughts here..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.tagsHeader}>
                <Text style={styles.label}>Tags</Text>
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={() => setShowTagInput(true)}
                >
                  <Hash size={14} color="#3B82F6" />
                  <Text style={styles.addTagText}>Add Tag</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                showsVerticalScrollIndicator={false}
                style={styles.popularTagsContainer}
                contentContainerStyle={{ 
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingBottom: 8,
                }}
              >
                {POPULAR_TAGS.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.popularTagChip,
                      tags.includes(tag) && styles.popularTagChipSelected
                    ]}
                    onPress={() => {
                      if (tags.includes(tag)) {
                        setTags(prev => prev.filter(t => t !== tag));
                      } else {
                        setTags(prev => [...prev, tag]);
                      }
                    }}
                  >
                    <Text 
                      style={[
                        styles.popularTagText,
                        tags.includes(tag) && styles.popularTagTextSelected
                      ]}
                    >
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {showTagInput && (
                <View style={styles.tagInput}>
                  <TextInput
                    style={styles.tagInputField}
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder="Enter tag..."
                    placeholderTextColor="#94A3B8"
                    onSubmitEditing={handleAddTag}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={styles.tagAddButton}
                    onPress={handleAddTag}
                  >
                    <Text style={styles.tagAddButtonText}>Add</Text>
                  </TouchableOpacity>
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
              style={[
                styles.button,
                styles.saveButton,
                !content.trim() && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={!content.trim()}
            >
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
  content: {
    padding: 16,
  },
  templatesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  templatesContainer: {
    paddingBottom: 8,
    gap: 12,
  },
  templateCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    width: 200,
    marginRight: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  templatePreview: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  moodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  moodChipSelected: {
    backgroundColor: '#EFF6FF',
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  moodLabelSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  textInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  voiceButtonActive: {
    backgroundColor: '#3B82F6',
  },
  voiceButtonText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  voiceButtonTextActive: {
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    height: 200,
    fontSize: 16,
    color: '#1E293B',
    textAlignVertical: 'top',
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addTagText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  tagInput: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tagInputField: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1E293B',
  },
  tagAddButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  tagAddButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#3B82F6',
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
    backgroundColor: '#3B82F6',
  },
  saveButtonDisabled: {
    backgroundColor: '#E2E8F0',
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
  popularTagsContainer: {
    marginBottom: 12,
    maxHeight: 200,
  },
  popularTagChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    marginRight: 8,
  },
  popularTagChipSelected: {
    backgroundColor: '#EFF6FF',
  },
  popularTagText: {
    fontSize: 14,
    color: '#64748B',
  },
  popularTagTextSelected: {
    color: '#3B82F6',
  },
});

export default NewJournalModal;