import React, { useRef } from 'react'
import { Paper, Grid, Box, Chip, Button, Typography } from '@material-ui/core'
import type { ButtonProps, ChipProps } from '@material-ui/core'
import { styled } from '@material-ui/core/styles';
import { Save as SaveIcon } from '@material-ui/icons'
import TagMstrData from '@/domains/TagMstrData'
import TitleData from '@/domains/TitleData'
import TaskData from '@/domains/TaskData'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';
import * as ja from 'yup-locale-ja';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import type { DragObjectWithType } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

yup.setLocale(ja.descriptive)
type TaskCommandT = {
  saveTask: () => void;
  moveTask: (id: string, dropPriority: number) => void;
  moveTaskGroup: (id: string, group: string) => void;
}
type CommandT = {
  saveOnClick: (title: TitleData, values: {
    name: string;
    description: string;
    tags: string
  }) => Promise<void>;
  tagOnClick: (id: string) => Promise<void>;
}
export type StoryCompOrgProps = { title: TitleData; tags: TagMstrData[]; tasks: TaskData[]; command: CommandT; taskCommand: TaskCommandT; }

export const StoryCompOrg = ({ title, tags, tasks, command, taskCommand }: StoryCompOrgProps): JSX.Element => {
  const taskFilter = (group: string) => (task: TaskData) => task.group === group
  const taskMap = (task, i) => <Task key={i} id={task.id} priority={task.priority} group={task.group} memo={task.memo} taskCommand={taskCommand} />

  return <>
    <Formik {...formData}
      initialValues={{ name: title.name, description: title.description, tags: title.tags.map((tag) => tag.name).join(), }}
      onSubmit={async (values, { setSubmitting }) => {
        await command.saveOnClick(title, values)
        setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <>
          <Commands>
            <Field component={TextField} name="name" label="タイトル" fullWidth />
            <Field component={TextField} name="description" label="説明文" multiline rows={3} fullWidth />
            <Field component={TextField} name="tags" label="タグ" fullWidth />
            <Tags>{tags.map((tag, i) => <Tag key={i} label={tag.name} onClick={() => command.tagOnClick(tag.id)} />)}</Tags>
            <SaveButton disabled={isSubmitting} onClick={submitForm}>保存</SaveButton>
          </Commands>
          <DndProvider backend={HTML5Backend}>
            <Board group={'A'} name={'起'} taskCommand={taskCommand}>
              {tasks.filter(taskFilter('A')).map(taskMap)}
            </Board>
            <Board group={'B'} name={'承'} taskCommand={taskCommand}>
              {tasks.filter(taskFilter('B')).map(taskMap)}
            </Board>
            <Board group={'C'} name={'転'} taskCommand={taskCommand}>
              {tasks.filter(taskFilter('C')).map(taskMap)}
            </Board>
            <Board group={'D'} name={'結'} taskCommand={taskCommand}>
              {tasks.filter(taskFilter('D')).map(taskMap)}
            </Board>
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
  '& > *': {
    margin: theme.spacing(1, 0),
  },
}))

const SaveButton: React.FC<ButtonProps> = (props) =>
  <Button {...props} variant="contained" color="primary" startIcon={<SaveIcon />} />

type TaskType = { id: string; group: string; memo: string; priority: number; taskCommand: TaskCommandT }
type TaskWithType = DragObjectWithType & TaskType
const Task: React.FC<TaskType> =
  (props) => {
    const [, dragRef] = useDrag({
      item: { type: ItemTypes.TASK, ...props },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag(),
      })
    })
    const [, dropRef] = useDrop({
      accept: ItemTypes.TASK,
      hover: (item: TaskWithType) => {
        const hoverPriority = props.priority;
        props.taskCommand.moveTask(item.id, hoverPriority)
      },
    });

    const ref = useRef<HTMLDivElement>(null);
    dragRef(dropRef(ref));
    const PaperStyled = styled(Paper)(({ theme }) => ({
      padding: theme.spacing(1),
      whiteSpace: 'pre-wrap',
      backgroundColor: '#ffc',
    }))
    return <Grid key={props.id} ref={ref} item xs={2}><PaperStyled elevation={3}>
      <Typography variant="body1" component="p">{props.memo}</Typography>
    </PaperStyled></Grid>
  };

const Board: React.FC<{ group: string; name: string; taskCommand: TaskCommandT; }> =
  ({ group, name, taskCommand, children }) => {
    const [, ref] = useDrop({
      accept: ItemTypes.TASK,
      hover: (item: TaskWithType) => {
        const hoverGroup = group;
        taskCommand.moveTaskGroup(item.id, hoverGroup)
      },
      drop: taskCommand.saveTask,
    });
    const DivStyled = styled('div')(({ theme }) => ({
      padding: theme.spacing(1.5),
    }))
    const BoardStyled = styled(Grid)({ border: '1px solid black' })
    const PaperStyled = styled(Paper)(({ theme }) => ({
      padding: theme.spacing(1),
      whiteSpace: 'pre-wrap',
      backgroundColor: '#ccf',
    }))
    const GroupName = () => <Grid item xs={1}><PaperStyled elevation={1}>
      <Typography variant="body1" component="p" align="center">{name}</Typography>
    </PaperStyled></Grid>
    return <DivStyled><BoardStyled ref={ref} container spacing={3} color={'#f00'}>
      <GroupName />{children}
    </BoardStyled></DivStyled>
  }


const ItemTypes = {
  TASK: 'task'
}
