import React, { useState } from 'react'
import { Typography, Box, Chip, Button } from '@material-ui/core'
import type { ButtonProps, ChipProps } from '@material-ui/core'
import { styled } from '@material-ui/core/styles';
import { Save as SaveIcon, Add as AddIcon } from '@material-ui/icons'
import TagMstrData from '@/domains/TagMstrData'
import TitleData, { TagData } from '@/domains/TitleData'
import TaskData, { TaskRepo } from '@/domains/TaskData'
import { Task, Board } from '@/components/molecules/StoryCompMol'
import type { TaskRepoT } from '@/components/molecules/StoryCompMol'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';
import * as ja from 'yup-locale-ja';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

yup.setLocale(ja.descriptive)
type CommandT = {
  saveTitle: (title: TitleData) => void;
  id: () => string;
  updated: () => moment.Moment;
}

export type StoryCompOrgProps = { title: TitleData; tags: TagMstrData[]; tasks: TaskData[]; command: CommandT; taskRepo: TaskRepoT; }

export const StoryCompOrg = ({ title, tags, tasks, command, taskRepo }: StoryCompOrgProps): JSX.Element => {
  const [state, setState] = useState({ isShowTitleEdit: false })
  return <>
    <Formik {...formData}
      initialValues={{ name: title.name, description: title.description, tags: title.tags.map((tag) => tag.name).join(), }}
      onSubmit={(values, { setSubmitting }) => {
        command.saveTitle(title.merge({ ...values, updated: command.updated(), tags: values.tags.split(',').map((name) => new TagData({ name })) }))
        setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting, handleChange, values, setFieldValue }) => (
        <>
          <Commands>
            {!state.isShowTitleEdit && <Box><Typography variant="h5" component="h1">{title.name}</Typography></Box>}
            <div hidden={!state.isShowTitleEdit}>
              <Field component={TextField} name="name" label="タイトル" fullWidth />
              <Field component={TextField} name="description" label="説明文" multiline rows={3} fullWidth />
              <Field id={'tagsForm'} component={TextField} name="tags" label="タグ" fullWidth onChange={handleChange} value={values.tags} />
              <Tags>{tags.map((tag, i) => <Tag key={i} label={tag.name} onClick={() => setFieldValue('tags', [...values.tags.split(','), tag.name].join())} />)}</Tags>
            </div>
            {state.isShowTitleEdit && <SaveButton disabled={isSubmitting} onClick={submitForm}>保存</SaveButton>}
            <ExpandButton onClick={() => setState({ ...state, isShowTitleEdit: !state.isShowTitleEdit })}>展開</ExpandButton>
          </Commands>
          <Commands>
            <AddButton onClick={() => taskRepo.addTask(command.id(), 'A')}>追加</AddButton>
          </Commands>
          <DndProvider backend={HTML5Backend}>
            {[
              { group: 'A', name: '起' },
              { group: 'B', name: '承' },
              { group: 'C', name: '転' },
              { group: 'D', name: '結' },
            ].map((v, i) => <Board key={i} group={v.group} name={v.name} taskRepo={taskRepo}>
              {tasks.filter(TaskRepo.groupFilter(v.group))
                .sort(TaskRepo.prioritySort)
                .map((task, i) => <Task key={i} id={task.id} priority={task.priority} group={task.groupName} memo={task.memo} taskRepo={taskRepo} />)}
            </Board>)}
          </DndProvider>
        </>
      )}
    </Formik >
  </>
}

const formData = {
  validationSchema: yup.object({
    name: yup.string().max(100).required(),
    description: yup.string().max(1000).required(),
    tags: yup.string().max(1000).required(),
  }),
}

// タグ
const Tag: React.FC<ChipProps> = (props) => <Chip {...props} />

const Tags = styled(Box)(({ theme }) => ({
  '& > *': {
    margin: theme.spacing(0.5),
  },
}))

// ボタン
const Commands = styled(Form)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '& > div > *': {
    margin: theme.spacing(1, 0),
  },
  '& > *': {
    margin: theme.spacing(0, 1),
  },
}))

const SaveButton: React.FC<ButtonProps> = (props) =>
  <Button {...props} variant="contained" color="primary" startIcon={<SaveIcon />} />

const ExpandButton = styled((props: ButtonProps) => <Button {...props} variant="contained" color="primary" />)({
  backgroundColor: '#d86100',
  '&:hover': {
    backgroundColor: '#be5600',
  },
})

const AddButton = (props: ButtonProps) =>
  <Button {...props} variant="contained" color="primary" startIcon={<AddIcon />} />
