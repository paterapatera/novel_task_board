import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0'
import { action } from '@storybook/addon-actions';
import { range } from '@/utils/core'
import moment from 'moment'
import { StoryCompTmpl, StoryCompTmplProps } from '@/components/templates/StoryCompTmpl';
import TagMstrData from '@/domains/TagMstrData'
import TagData from '@/domains/TitleData/TagData'
import TitleData from '@/domains/TitleData'
import TaskData from '@/domains/TaskData'

const args: StoryCompTmplProps = {
  storyCompTmplProps: {
    tags: [
      new TagMstrData({ id: '1', name: 'アドベンチャー' }),
      new TagMstrData({ id: '2', name: 'SF' }),
      new TagMstrData({ id: '3', name: 'コメディー' }),
      new TagMstrData({ id: '4', name: 'ファミリー向け' })
    ],
    title: new TitleData({
      id: 'aaa',
      name: 'バック・トゥ・ザ・フューチャー',
      description: range(0, 12).map(() => '未来に行って戻ってくる話').join(''),
      updated: moment('2000-01-01T00:00:00+09:00'),
      image: '/test/testThumb.png',
      tags: [new TagData({ name: 'アドベンチャー' }), new TagData({ name: 'SF' }), new TagData({ name: 'コメディー' }), new TagData({ name: 'ファミリー向け' })],
    }),
    command: {
      saveOnClick: (title, values) =>
        new Promise((ok) => setTimeout(ok, 500))
          .then(action(JSON.stringify(values)))
          .then(action(JSON.stringify(title))),
      tagOnClick: async (id) => action('tagOnClick')(id)
    },
    tasks: [],
    taskCommand: {
      moveTask: action('moveTask'),
      moveTaskGroup: action('moveTaskGroup'),
      saveTask: action('saveTask'),
    },
  }
}

export default {
  title: 'Pages/物語の構成',
} as Meta

export const IndexStory: Story<StoryCompTmplProps> = (props) => {
  const [tasks, setTasks] = useState<TaskData[]>([
    new TaskData({ id: 'a1', priority: 0, group: 'A', memo: "1aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'a2', priority: 1, group: 'A', memo: "2aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'a3', priority: 2, group: 'A', memo: "3aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'b1', priority: 0, group: 'B', memo: "4aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'c1', priority: 0, group: 'C', memo: "5aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'c2', priority: 1, group: 'C', memo: "6aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'd1', priority: 0, group: 'D', memo: "7aaa\nbbbbbbb\nccccc" }),
  ]);
  const taskCommand = {
    moveTask: (id: string, dropPriority: number) => {
      const task = tasks.find((t) => t.id === id)
      if (task.priority === dropPriority) return
      const newTasks = tasks
        .sort((a, b) => a.priority - b.priority)
        .filter((t) => t.group === task.group)
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
        .map((t, i) => t.set('priority', i))
      const filteredTasks = tasks
        .filter((t) => t.group !== task.group)
      action('dropPriority: ' + dropPriority + ', ' + JSON.stringify(task) + ', ' + JSON.stringify([...filteredTasks, ...newTasks]))()
      setTasks([...filteredTasks, ...newTasks])
    },
    moveTaskGroup: (id: string, group: string) => {
      const task = tasks.find((t) => t.id === id)
      if (task.group === group) return
      const oldGroup = task.group
      const newTasks = [...tasks.filter((t) => t.id !== id), task.merge({ group, priority: -1 })]
      const oldGroupTasks = newTasks
        .filter((t) => t.group === oldGroup)
        .map((t, i) => t.set('priority', i))
      const newGroupTasks = newTasks
        .filter((t) => t.group === group)
        .map((t, i) => t.set('priority', i))
      const filteredTasks = tasks
        .filter((t) => t.group !== oldGroup && t.group !== group)
      action('group: ' + group + ', ' + JSON.stringify(task) + ', ' + JSON.stringify([...filteredTasks, ...oldGroupTasks, ...newGroupTasks]))()
      setTasks([...filteredTasks, ...oldGroupTasks, ...newGroupTasks])
    },
    saveTask: action('saveTask'),
  }
  const p = { ...props, storyCompTmplProps: { ...props.storyCompTmplProps, tasks, taskCommand } }
  return <StoryCompTmpl {...p} />
}
IndexStory.args = args
IndexStory.storyName = '物語の構成'
