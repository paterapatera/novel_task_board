import React from 'react'
import TaskData from '@/domains/TaskData'

type UpdateTasksT = React.Dispatch<React.SetStateAction<TaskData[]>>
type SaveTasksT = (titleId: string, tasks: TaskData[]) => void

export default class T {
  static moveTask(tasks: TaskData[], updateTasks: UpdateTasksT) {
    return (id: string, dropPriority: number): void => {
      const task = tasks.find(this.idFilter(id))

      if (task.priority === dropPriority) return

      const newTasks = tasks
        .sort(this.prioritySort)
        .filter(this.groupFilter(task.group))
        .flatMap((t, i) => {
          if (t.id === task.id)
            return []
          else if (t.priority !== dropPriority)
            return [t.set('priority', i)]
          else if (task.priority > t.priority)
            return [task.set('priority', -1), t.set('priority', i)]
          else
            return [t.set('priority', i), task.set('priority', -1)]
        })
        .map(this.priorityMap)

      const filteredTasks = tasks.filter(this.notGroupFilter(task.group))

      updateTasks([...filteredTasks, ...newTasks])
    }
  }

  static moveTaskGroup(tasks: TaskData[], updateTasks: UpdateTasksT) {
    return (id: string, group: string): void => {
      const task = tasks.find(this.idFilter(id))

      if (task.group === group) return

      const oldGroup = task.group
      const newTasks = [...tasks.filter(this.notIdFilter(id)), task.merge({ group, priority: -1 })]

      const oldGroupTasks = newTasks.filter(this.groupFilter(oldGroup)).map(this.priorityMap)
      const newGroupTasks = newTasks.filter(this.groupFilter(group)).map(this.priorityMap)
      const filteredTasks = tasks.filter((t) => t.group !== oldGroup && t.group !== group)

      updateTasks([...filteredTasks, ...oldGroupTasks, ...newGroupTasks])
    }
  }

  static deleteTask(titleId: string, tasks: TaskData[], updateTasks: UpdateTasksT, saveTasks: SaveTasksT) {
    return (id: string): void => {
      const newTasks = tasks.filter(this.notIdFilter(id))
      updateTasks(newTasks)
      saveTasks(titleId, newTasks)
    }
  }

  static addTask(titleId: string, tasks: TaskData[], updateTasks: UpdateTasksT, saveTasks: SaveTasksT) {
    return (id: string, group: string): void => {
      const newTasks = [...tasks, new TaskData({ id, priority: -1, group, memo: '' })]
        .sort(this.prioritySort)
        .filter(this.groupFilter(group))
        .map(this.priorityMap)
      const filteredTasks = tasks.filter(this.notGroupFilter(group))
      const compTasks = [...filteredTasks, ...newTasks]
      updateTasks(compTasks)
      saveTasks(titleId, compTasks)
    }
  }

  static updateMemo(titleId: string, tasks: TaskData[], updateTasks: UpdateTasksT, saveTasks: SaveTasksT) {
    return (id: string, memo: string): void => {
      const task = tasks.find(this.idFilter(id))
      const filteredTasks = tasks.filter(this.notIdFilter(id))
      const compTasks = [...filteredTasks, task.set('memo', memo)]
      updateTasks(compTasks)
      saveTasks(titleId, compTasks)
    }
  }

  static groupFilter = (group: string) => (t: TaskData): boolean => t.group === group
  static notGroupFilter = (group: string) => (t: TaskData): boolean => t.group !== group
  static idFilter = (id: string) => (t: TaskData): boolean => t.id === id
  static notIdFilter = (id: string) => (t: TaskData): boolean => t.id !== id
  static prioritySort = (a: TaskData, b: TaskData): number => a.priority - b.priority
  static priorityMap = (t: TaskData, i: number): TaskData => t.set('priority', i)

  static saveAll(titleId: string, tasks: TaskData[], saveTasks: SaveTasksT) { return (): void => { saveTasks(titleId, tasks) } }
}
