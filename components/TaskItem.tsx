import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Check, Clock, CalendarClock, Plus, ChevronDown, ChevronRight, Link, Image as ImageIcon, Video } from 'lucide-react-native';
import { useState } from 'react';
import { Task, TaskAttachment } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle?: (id: string) => void;
  onAddFollowUp?: (parentTaskId: string) => void;
  showConnectedCount?: boolean;
}

export default function TaskItem({ task, onToggle, onAddFollowUp, showConnectedCount }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleToggle = () => {
    onToggle?.(task.id);
  };

  const handleAddFollowUp = () => {
    onAddFollowUp?.(task.id);
  };

  const followUpCount = task.followUpTasks?.length || 0;

  const renderAttachmentIcon = (type: TaskAttachment['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={16} color="#64748B" />;
      case 'video':
        return <Video size={16} color="#64748B" />;
      case 'link':
        return <Link size={16} color="#64748B" />;
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity 
          style={[
            styles.checkbox, 
            task.completed && styles.checkboxCompleted
          ]}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          {task.completed && <Check size={16} color="#FFFFFF" />}
        </TouchableOpacity>
        <View style={styles.content}>
          <Text 
            style={[
              styles.title, 
              task.completed && styles.titleCompleted
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description && (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          )}
          {task.attachments && task.attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {task.attachments.map((attachment, index) => (
                <View key={attachment.id} style={styles.attachmentItem}>
                  {attachment.type === 'image' && attachment.url && (
                    <Image 
                      source={{ uri: attachment.url }} 
                      style={styles.attachmentThumbnail}
                    />
                  )}
                  {(attachment.type === 'video' || attachment.type === 'link') && (
                    <View style={styles.attachmentIconContainer}>
                      {renderAttachmentIcon(attachment.type)}
                    </View>
                  )}
                  <Text style={styles.attachmentTitle} numberOfLines={1}>
                    {attachment.title || attachment.url}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.metaContainer}>
            <View style={styles.metaGroup}>
              {task.dueDate && (
                <View style={styles.metaItem}>
                  <CalendarClock size={14} color="#64748B" />
                  <Text style={styles.metaText}>{task.dueDate}</Text>
                </View>
              )}
              {task.dueTime && (
                <View style={styles.metaItem}>
                  <Clock size={14} color="#64748B" />
                  <Text style={styles.metaText}>{task.dueTime}</Text>
                </View>
              )}
              {!task.parentTaskId && showConnectedCount && followUpCount > 0 && (
                <View style={styles.connectedGroup}>
                  <TouchableOpacity 
                    style={styles.followUpButton}
                    onPress={handleAddFollowUp}
                  >
                    <Plus size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.connectedCount}
                    onPress={() => setIsExpanded(!isExpanded)}
                  >
                    <Text style={styles.connectedCountText}>
                      +{followUpCount} connected
                    </Text>
                    {isExpanded ? (
                      <ChevronDown size={14} color="#3B82F6" />
                    ) : (
                      <ChevronRight size={14} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        {task.priority && (
          <View 
            style={[
              styles.priorityBadge, 
              task.priority === 'high' && styles.highPriority,
              task.priority === 'medium' && styles.mediumPriority,
              task.priority === 'low' && styles.lowPriority,
            ]}
          >
            <Text style={styles.priorityText}>
              {task.priority.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      {task.followUpTasks && task.followUpTasks.length > 0 && isExpanded && (
        <View style={styles.followUpContainer}>
          {task.followUpTasks.map((followUpTask) => (
            <View key={followUpTask.id} style={styles.followUpTask}>
              <View style={styles.followUpLine} />
              <TaskItem 
                task={followUpTask}
                onToggle={onToggle}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  titleCompleted: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 20,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 6,
    maxWidth: 200,
  },
  attachmentThumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 6,
  },
  attachmentIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  attachmentTitle: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 4,
  },
  connectedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followUpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  connectedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  connectedCountText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
    marginRight: 4,
  },
  priorityBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highPriority: {
    backgroundColor: '#FEE2E2',
  },
  mediumPriority: {
    backgroundColor: '#FEF3C7',
  },
  lowPriority: {
    backgroundColor: '#DCFCE7',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  followUpContainer: {
    paddingLeft: 32,
  },
  followUpTask: {
    position: 'relative',
  },
  followUpLine: {
    position: 'absolute',
    left: -16,
    top: 0,
    bottom: 12,
    width: 2,
    backgroundColor: '#E2E8F0',
  },
});