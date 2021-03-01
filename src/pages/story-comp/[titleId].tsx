import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import moment from 'moment'
import { StoryCompTmpl, StoryCompTmplProps } from '@/components/templates/StoryCompTmpl';
import TagMstrData, { TagMstrQueryT } from '@/domains/TagMstrData'
import TitleData, { TitleQueryT, TagData, TitleRepo } from '@/domains/TitleData'
import TaskData, { TaskQueryT, TaskRepo } from '@/domains/TaskData'
import { uuid } from '@/utils/core'

export const StoryComp = (): JSX.Element => {
  const { titleId: t } = useRouter().query
  if (!t) return <p>Loading...</p>
  const titleId = Array.isArray(t) ? t[0] : t
  const [tasks, updateTasks] = useState<TaskData[]>([]);
  const { loading, error, data } = useQuery<{ tasks: TaskQueryT[], tags: TagMstrQueryT[], title: TitleQueryT }>(
    TaskRepo.ListQuery,
    { variables: { titleId }, onCompleted: ({ tasks }) => { updateTasks(tasks.map(({ id, titleId, priority, groupName, memo }) => new TaskData({ id, titleId, priority, groupName, memo }))) } }
  );
  const [saveTitleGql] = useMutation<{ id: string }>(TitleRepo.SaveQuery)
  const [saveTaskGql] = useMutation<{ id: string }>(TaskRepo.SaveQuery)
  const [saveTasksGql] = useMutation<{ id: string }>(TaskRepo.SaveAllQuery)
  const [deleteTaskGql] = useMutation<string>(TaskRepo.DeleteQuery)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  const tags = data.tags.map(({ id, name }) => new TagMstrData({ id, name }))
  const title = new TitleData({
    id: data.title.id,
    name: data.title.name,
    description: data.title.description,
    updated: moment(data.title.updated),
    image: data.title.image,
    tags: data.title.tags.split(',').map((t) => new TagData({ name: t })),
  });
  const p: StoryCompTmplProps = {
    storyCompTmplProps: {
      tasks, title, tags,
      command: {
        saveTitle: TitleRepo.addTitle(saveTitleGql),
        id: uuid,
        updated: moment,
      },
      taskRepo: {
        moveTask: TaskRepo.moveTask(tasks, updateTasks),
        moveTaskGroup: TaskRepo.moveTaskGroup(tasks, updateTasks),
        deleteTask: TaskRepo.deleteTask(titleId, tasks, updateTasks, deleteTaskGql),
        addTask: TaskRepo.addTask(titleId, tasks, updateTasks, saveTaskGql),
        updateMemo: TaskRepo.updateMemo(titleId, tasks, updateTasks, saveTaskGql),
        saveTask: TaskRepo.saveAll(titleId, tasks, saveTasksGql),
      },
    }
  }
  return <StoryCompTmpl {...p} />
}

export default StoryComp
