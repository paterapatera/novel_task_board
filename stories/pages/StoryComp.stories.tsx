import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0'
import { action } from '@storybook/addon-actions';
import { range } from '@/utils/core'
import moment from 'moment'
import { StoryCompTmpl, StoryCompTmplProps } from '@/components/templates/StoryCompTmpl';
import TagMstrData from '@/domains/TagMstrData'
import TitleData, { TagData } from '@/domains/TitleData'
import TaskData, { TaskRepo } from '@/domains/TaskData'

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
    command: { saveTitle: null },
    tasks: [],
    taskRepo: { moveTask: null, moveTaskGroup: null, deleteTask: null, addTask: null, updateMemo: null, saveTask: null },
  }
}

export default {
  title: 'Pages/物語の構成',
} as Meta

export const IndexStory: Story<StoryCompTmplProps> = (props) => {
  const [tasks, updateTasks] = useState<TaskData[]>([
    new TaskData({ id: 'a1', priority: 0, group: 'A', memo: "1aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'a2', priority: 1, group: 'A', memo: "2aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'a3', priority: 2, group: 'A', memo: "3aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'b1', priority: 0, group: 'B', memo: "4aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'c1', priority: 0, group: 'C', memo: "5aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'c2', priority: 1, group: 'C', memo: "6aaa\nbbbbbbb\nccccc" }),
    new TaskData({ id: 'd1', priority: 0, group: 'D', memo: "7aaa\nbbbbbbb\nccccc" }),
  ]);
  const [title] = useState<TitleData>(new TitleData({
    id: 'aaa',
    name: 'バック・トゥ・ザ・フューチャー',
    description: range(0, 12).map(() => '未来に行って戻ってくる話').join(''),
    updated: moment('2000-01-01T00:00:00+09:00'),
    image: '/test/testThumb.png',
    tags: [new TagData({ name: 'アドベンチャー' }), new TagData({ name: 'SF' }), new TagData({ name: 'コメディー' }), new TagData({ name: 'ファミリー向け' })],
  }));
  const p = {
    ...props, storyCompTmplProps: {
      ...props.storyCompTmplProps, tasks, title,
      taskRepo: {
        moveTask: TaskRepo.moveTask(tasks, updateTasks),
        moveTaskGroup: TaskRepo.moveTaskGroup(tasks, updateTasks),
        deleteTask: TaskRepo.deleteTask('titleId1', tasks, updateTasks, action('saveTask')),
        addTask: TaskRepo.addTask('titleId1', tasks, updateTasks, action('saveTask')),
        updateMemo: TaskRepo.updateMemo('titleId1', tasks, updateTasks, action('saveTask')),
        saveTask: TaskRepo.saveAll('titleId1', tasks, action('saveTask')),
      },
      command: {
        saveTitle: (title, values) =>
          new Promise((ok) => setTimeout(ok, 500))
            .then(action(JSON.stringify(values)))
            .then(action(JSON.stringify(title))),
      },
    }
  }
  return <StoryCompTmpl {...p} />
}
IndexStory.args = args
IndexStory.storyName = '物語の構成'
