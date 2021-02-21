import React, { useRef, useState } from 'react'
import { TextField, Box, Paper, Grid, Typography, IconButton, Card, CardActions, CardContent } from '@material-ui/core'
import { HighlightOff as HighlightOffIcon } from '@material-ui/icons'
import { styled } from '@material-ui/core/styles';
import { TaskRepo } from '@/domains/TaskData'
import { useDrag, useDrop } from 'react-dnd';
import type { DragObjectWithType } from 'react-dnd';

export type TaskRepoT = {
  moveTask: ReturnType<typeof TaskRepo.moveTask>;
  moveTaskGroup: ReturnType<typeof TaskRepo.moveTaskGroup>;
  deleteTask: ReturnType<typeof TaskRepo.deleteTask>;
  addTask: ReturnType<typeof TaskRepo.addTask>;
  updateMemo: ReturnType<typeof TaskRepo.updateMemo>;
  saveTask: ReturnType<typeof TaskRepo.saveAll>;
}
type TaskType = { id: string; group: string; memo: string; priority: number; taskRepo: TaskRepoT; }
type TaskWithType = DragObjectWithType & TaskType
export const Task: React.FC<TaskType> =
  ({ taskRepo, ...props }) => {
    const [state, setState] = useState({ isShowAction: false, isShowMemoEdit: false })
    const [, dragRef] = useDrag({ item: { type: ItemTypes.TASK, ...props }, })
    const [, dropRef] = useDrop({
      accept: ItemTypes.TASK,
      hover: (item: TaskWithType) => {
        const hoverPriority = props.priority;
        taskRepo.moveTask(item.id, hoverPriority)
      },
    });

    const ref = useRef<HTMLDivElement>(null);
    dragRef(dropRef(ref));

    const updateMemo = (e) => {
      if (e.ctrlKey && e.key == 'Enter') {
        setState({ ...state, isShowMemoEdit: false })
        const value = e.currentTarget.getElementsByTagName('textarea').namedItem('memo')?.value
        if (value === undefined || value === null) return
        taskRepo.updateMemo(props.id, value)
      }
    }

    return <Grid key={props.id} ref={ref} item xs={2}
      onMouseEnter={() => setState({ ...state, isShowAction: true })}
      onMouseLeave={() => setState({ ...state, isShowAction: false })}
    ><CardStyled elevation={3}>
        <CardContentStyled>
          {!state.isShowMemoEdit && <Typography variant="body1" component="p" onClick={() => setState({ ...state, isShowMemoEdit: true })}>{props.memo || '　'}</Typography>}
          {state.isShowMemoEdit && <TextField name="memo" label="Memo" defaultValue={props.memo} multiline fullWidth onKeyDown={updateMemo} />}
        </CardContentStyled>
        {state.isShowAction && <CardActionsStyled>
          <CardActionSpace />
          <IconButton onClick={() => taskRepo.deleteTask(props.id)}><HighlightOffIcon /></IconButton>
        </CardActionsStyled>}
      </CardStyled></Grid>
  };
const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  whiteSpace: 'pre-wrap',
  backgroundColor: '#ffc',
}))
const CardActionSpace = styled(Box)({ flex: '1 1 auto' })
const CardContentStyled = styled(CardContent)(({ theme }) => ({ padding: theme.spacing(0, 1) }))
const CardActionsStyled = styled(CardActions)(({ theme }) => ({ padding: theme.spacing(0, 1) }))

export const Board: React.FC<{ group: string; name: string; taskRepo: TaskRepoT; }> =
  ({ group, name, taskRepo, children }) => {
    const [, ref] = useDrop({
      accept: ItemTypes.TASK,
      hover: (item: TaskWithType) => {
        const hoverGroup = group;
        taskRepo.moveTaskGroup(item.id, hoverGroup)
      },
      drop: taskRepo.saveTask,
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
