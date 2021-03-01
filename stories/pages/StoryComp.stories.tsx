import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Story, Meta } from '@storybook/react/types-6-0'
import { range } from '@/utils/core'
import moment from 'moment'
import { StoryCompTmpl, StoryCompTmplProps } from '@/components/templates/StoryCompTmpl';
import TagMstrData, { TagMstrQueryT } from '@/domains/TagMstrData'
import TitleData, { TitleQueryT, TagData, TitleRepo } from '@/domains/TitleData'
import TaskData, { TaskQueryT, TaskRepo } from '@/domains/TaskData'

export default {
  title: 'Pages/物語の構成',
} as Meta

export const IndexStory: Story<StoryCompTmplProps> = () => {
  const [tasks, updateTasks] = useState<TaskData[]>([]);
  const { loading: l1, error: e1, data } = useQuery<{ tasks: TaskQueryT[], tags: TagMstrQueryT[], title: TitleQueryT }>(
    TaskRepo.ListQuery,
    { variables: { titleId: 'aaa' }, onCompleted: ({ tasks }) => { updateTasks(tasks.map(({ id, titleId, priority, groupName, memo }) => new TaskData({ id, titleId, priority, groupName, memo }))) } }
  );
  const [saveTitleGql, { loading: l4, error: e4 }] = useMutation<{ id: string }>(TitleRepo.SaveQuery);
  const [saveTaskGql, { loading: l5, error: e5 }] = useMutation<{ id: string }>(TaskRepo.SaveQuery);
  const [saveTasksGql, { loading: l6, error: e6 }] = useMutation<{ id: string }>(TaskRepo.SaveAllQuery);
  const [deleteTaskGql, { loading: l7, error: e7 }] = useMutation<string>(TaskRepo.DeleteQuery);
  if (l1 || l4 || l5 || l6 || l7) return <p>Loading...</p>;
  if (e1 || e4 || e5 || e6 || e7) return <p>Error!</p>;

  // const [tasks, updateTasks] = useState<TaskData[]>(taskData.tasks.map(({ id, titleId, priority, group, memo }) =>
  // updateTasks(data.tasks.map(({ id, titleId, priority, group, memo }) => new TaskData({ id, titleId, priority, group, memo })))
  // const [tasks, updateTasks] = useState<TaskData[]>([]);
  // const tasks = data.tasks.map(({ id, titleId, priority, group, memo }) => new TaskData({ id, titleId, priority, group, memo }))
  // const updateTasks = action('')
  const tags = data.tags.map(({ id, name }) => new TagMstrData({ id, name }))
  const title = new TitleData({
    id: data.title.id,
    name: data.title.name,
    description: data.title.description,
    updated: moment(data.title.updated),
    image: data.title.image,
    tags: data.title.tags.split(',').map((t) => new TagData({ name: t })),
  });
  const p = {
    storyCompTmplProps: {
      tasks, title, tags,
      command: {
        saveTitle: TitleRepo.addTitle(saveTitleGql),
        id: () => 'aaa',
        updated: () => moment('2000-01-01T00:00:00+09:00'),
      },
      taskRepo: {
        moveTask: TaskRepo.moveTask(tasks, updateTasks),
        moveTaskGroup: TaskRepo.moveTaskGroup(tasks, updateTasks),
        deleteTask: TaskRepo.deleteTask('titleId1', tasks, updateTasks, deleteTaskGql),
        addTask: TaskRepo.addTask('titleId1', tasks, updateTasks, saveTaskGql),
        updateMemo: TaskRepo.updateMemo('titleId1', tasks, updateTasks, saveTaskGql),
        saveTask: TaskRepo.saveAll('titleId1', tasks, saveTasksGql),
      },
    }
  }
  return <StoryCompTmpl {...p} />
}
IndexStory.storyName = '物語の構成'
IndexStory.parameters = {
  apolloClient: {
    mocks: [
      {
        request: { query: TaskRepo.ListQuery, variables: { titleId: 'aaa' } },
        result: {
          data: {
            tags: range(0, 9).map((i) => ({
              id: 'aaa' + i,
              name: 'タグ' + i,
            })),
            title: {
              id: 'aaa',
              name: 'バック・トゥ・ザ・フューチャー',
              description: range(0, 12).map(() => '未来に行って戻ってくる話').join(''),
              updated: '2000-01-01T00:00:00+09:00',
              image: '/test/testThumb.png',
              tags: 'アドベンチャー,SF,コメディー,ファミリー向け',
            },
            tasks: range(0, 9).map((i) => ({
              id: 'id' + i,
              titleId: 'aaa',
              groupName: 'A',
              priority: i,
              memo: 'memo' + i,
            })),
          },
        },
      },
      {
        request: { query: TaskRepo.DeleteQuery, variables: { id: 'id0' } },
        result: { data: { deleteTask: 'dleteId1' } },
      },
      {
        request: {
          query: TaskRepo.SaveQuery, variables: {
            id: 'id1',
            titleId: 'aaa',
            groupName: 'A',
            priority: -1,
            memo: '',
          }
        },
        result: { data: { saveTask: { id: 'dleteId1' } } },
      },
      {
        request: {
          query: TaskRepo.SaveAllQuery, variables: {
            titleId: 'id0', tasks: [{
              id: 'id1',
              titleId: 'aaa',
              groupName: 'A',
              priority: -1,
              memo: '',
            }]
          },
          result: { data: { saveTasks: 'dleteId1' } },
        }
      },
    ],
  },
};
