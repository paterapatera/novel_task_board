import React from 'react'
import { gql } from '@apollo/client';
import TaskData, { TaskQueryT } from '@/domains/TaskData'

type UpdateTasksT = React.Dispatch<React.SetStateAction<TaskData[]>>
type SaveTaskT = (value: {
  variables: {
    task: {
      id: string;
      titleId: string;
      groupName: string;
      priority: number;
      memo: string;
    }
  }
}) => void
type SaveTasksT = (value: {
  variables: {
    titleId: string;
    tasks: {
      id: string;
      titleId: string;
      groupName: string;
      priority: number;
      memo: string;
    }[]
  }
}) => void
type DeleteTaskT = (value: { variables: { id: string } }) => void

export default class T {
  static moveTask(tasks: TaskData[], updateTasks: UpdateTasksT) {
    return (id: string, dropPriority: number): void => {
      const task = tasks.find(this.idFilter(id))

      if (task.priority === dropPriority) return

      const newTasks = tasks
        .sort(this.prioritySort)
        .filter(this.groupFilter(task.groupName))
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

      const filteredTasks = tasks.filter(this.notGroupFilter(task.groupName))

      updateTasks([...filteredTasks, ...newTasks])
    }
  }

  static moveTaskGroup(tasks: TaskData[], updateTasks: UpdateTasksT) {
    return (id: string, groupName: string): void => {
      const task = tasks.find(this.idFilter(id))

      if (task.groupName === groupName) return

      const oldGroup = task.groupName
      const newTasks = [...tasks.filter(this.notIdFilter(id)), task.merge({ groupName, priority: -1 })]

      const oldGroupTasks = newTasks.filter(this.groupFilter(oldGroup)).map(this.priorityMap)
      const newGroupTasks = newTasks.filter(this.groupFilter(groupName)).map(this.priorityMap)
      const filteredTasks = tasks.filter((t) => t.groupName !== oldGroup && t.groupName !== groupName)

      updateTasks([...filteredTasks, ...oldGroupTasks, ...newGroupTasks])
    }
  }

  static deleteTask(titleId: string, tasks: TaskData[], updateTasks: UpdateTasksT, deleteTask: DeleteTaskT) {
    return (id: string): void => {
      const newTasks = tasks.filter(this.notIdFilter(id))
      updateTasks(newTasks)
      deleteTask({ variables: { id } })
    }
  }

  static addTask(titleId: string, tasks: TaskData[], updateTasks: UpdateTasksT, saveTask: SaveTaskT) {
    return (id: string, groupName: string): void => {
      const newTask = new TaskData({ id, titleId, priority: -1, groupName, memo: '' })
      const newTasks = [...tasks, newTask]
        .sort(this.prioritySort)
        .filter(this.groupFilter(groupName))
        .map(this.priorityMap)
      const filteredTasks = tasks.filter(this.notGroupFilter(groupName))
      const compTasks = [...filteredTasks, ...newTasks]
      updateTasks(compTasks)
      saveTask({
        variables: {
          task: newTask
        }
      })
    }
  }

  static updateMemo(titleId: string, tasks: TaskData[], updateTasks: UpdateTasksT, saveTask: SaveTaskT) {
    return (id: string, memo: string): void => {
      const task = tasks.find(this.idFilter(id))
      const filteredTasks = tasks.filter(this.notIdFilter(id))
      const newTask = task.merge({ memo })
      // TODO
      // const newTask = task.merge({ memo, titleId })
      const compTasks = [...filteredTasks, newTask]
      updateTasks(compTasks)
      saveTask({
        variables: {
          task: newTask
        }
      })
    }
  }

  static groupFilter = (group: string) => (t: TaskData): boolean => t.groupName === group
  static notGroupFilter = (group: string) => (t: TaskData): boolean => t.groupName !== group
  static idFilter = (id: string) => (t: TaskData): boolean => t.id === id
  static notIdFilter = (id: string) => (t: TaskData): boolean => t.id !== id
  static prioritySort = (a: TaskData, b: TaskData): number => a.priority - b.priority
  static priorityMap = (t: TaskData, i: number): TaskData => t.set('priority', i)

  static saveAll(titleId: string, tasks: TaskData[], saveTasks: SaveTasksT) {
    return (): void => { saveTasks({ variables: { titleId, tasks } }) }
  }

  static ListQuery = gql`
    query GetData($titleId: String!){
      title(id: $titleId) {
        id,
        name,
        description,
        image,
        tags,
        updated,
      }
      tasks(titleId: $titleId) {
        id,
        titleId,
        groupName,
        priority,
        memo,
      }
      tags {
        id,
        name,
      }
    }
  `

  static DeleteQuery = gql`
    mutation DeleteTask($id: String!) {
      deleteTask(id: $id)
    }
  `

  static SaveQuery = gql`
    mutation SaveTask($task: TaskInput!) {
      saveTask(task: $task) {
        id
      }
    }
  `
  static SaveAllQuery = gql`
    mutation SaveTasks($titleId: String!, $tasks: [TaskInput!]!) {
      saveTasks(
        titleId: $titleId,
        tasks: $tasks
      )
    }
  `
}

export type TaskListQueryResultT = { tasks: TaskQueryT[] }
