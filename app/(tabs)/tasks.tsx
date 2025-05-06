import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Plus, Calendar, ListTree } from 'lucide-react-native';
import TaskItem from '@/components/TaskItem';
import EmptyState from '@/components/EmptyState';
import NewTaskModal from '@/components/NewTaskModal';
import { useTasks } from '@/hooks/useTasks';

export default function TasksScreen() {
  const { tasks, addTask, toggleTaskCompletion } = useTasks();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isNewTaskModalVisible, setIsNewTaskModalVisible] = useState(false);
  const [selectedParentTaskId, setSelectedParentTaskId] = useState<string | undefined>();

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'by-task', label: 'By Task' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Done' }
  ];

  const groupTasks = (tasksToGroup: Task[]) => {
    return tasksToGroup.reduce((groups, task) => {
      if (!task.parentTaskId) {
        if (task.completed) {
          groups.completed.push(task);
        } else if (task.isToday) {
          groups.today.push(task);
        } else if (task.dueDate === 'Tomorrow') {
          groups.tomorrow.push(task);
        } else if (task.dueDate) {
          groups.upcoming.push(task);
        } else {
          groups.noDate.push(task);
        }
      }
      return groups;
    }, {
      today: [],
      tomorrow: [],
      upcoming: [],
      completed: [],
      noDate: []
    });
  };

  const getTasksWithFollowUps = () => {
    return tasks.filter(task => !task.parentTaskId && (task.followUpTasks?.length || 0) > 0);
  };

  const filteredGroups = () => {
    switch (selectedFilter) {
      case 'active':
        const activeGroups = groupTasks(tasks);
        return {
          today: activeGroups.today,
          tomorrow: activeGroups.tomorrow,
          upcoming: activeGroups.upcoming,
          noDate: activeGroups.noDate
        };
      case 'completed':
        return { completed: groupTasks(tasks).completed };
      case 'by-task':
        const tasksWithFollowUps = getTasksWithFollowUps();
        const connectedGroups = groupTasks(tasksWithFollowUps);
        return {
          'Today\'s Connected': connectedGroups.today,
          'Tomorrow\'s Connected': connectedGroups.tomorrow,
          'Upcoming Connected': connectedGroups.upcoming,
          'Other Connected': connectedGroups.noDate,
        };
      default:
        return groupTasks(tasks);
    }
  };

  const handleAddFollowUp = (parentTaskId: string) => {
    setSelectedParentTaskId(parentTaskId);
    setIsNewTaskModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Tasks</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setSelectedParentTaskId(undefined);
              setIsNewTaskModalVisible(true);
            }}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New Task</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              {filter.id === 'by-task' ? (
                <ListTree size={14} color={selectedFilter === filter.id ? '#FFFFFF' : '#64748B'} />
              ) : null}
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {tasks.length > 0 ? (
          Object.entries(filteredGroups()).map(([group, groupTasks]) => {
            if (groupTasks.length === 0) return null;
            
            return (
              <View key={group} style={styles.section}>
                <View style={styles.sectionHeader}>
                  {group.includes('Connected') ? (
                    <ListTree size={16} color="#64748B" />
                  ) : (
                    <Calendar size={16} color="#64748B" />
                  )}
                  <Text style={styles.sectionTitle}>
                    <Text>{group}</Text>
                    <Text style={styles.taskCount}> ({groupTasks.length})</Text>
                  </Text>
                </View>
                {groupTasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTaskCompletion}
                    onAddFollowUp={handleAddFollowUp}
                    showConnectedCount={selectedFilter !== 'by-task'}
                  />
                ))}
              </View>
            );
          })
        ) : (
          <EmptyState 
            title="No tasks yet" 
            message="Add your first task to get started"
            icon="clipboard-list"
          />
        )}
      </ScrollView>

      <NewTaskModal
        visible={isNewTaskModalVisible}
        onClose={() => {
          setIsNewTaskModalVisible(false);
          setSelectedParentTaskId(undefined);
        }}
        onSave={addTask}
        parentTaskId={selectedParentTaskId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 24,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'right',
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#4361EE',
  },
  filterText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  taskCount: {
    color: '#64748B',
    fontWeight: '400',
  },
});