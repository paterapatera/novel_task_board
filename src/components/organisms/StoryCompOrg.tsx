import { Box, Chip, Button } from '@material-ui/core'
import type { ButtonProps, ChipProps } from '@material-ui/core'
import { styled } from '@material-ui/core/styles';
import { Save as SaveIcon } from '@material-ui/icons'
import TagMstrData from '@/domains/TagMstrData'
import TitleData from '@/domains/TitleData'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';
import * as ja from 'yup-locale-ja';

yup.setLocale(ja.descriptive)
type CommandT = {
  saveOnClick: (title: TitleData, values: {
    name: string;
    description: string;
    tags: string
  }) => Promise<void>;
  tagOnClick: (id: string) => Promise<void>;
}
export type StoryCompOrgProps = { title: TitleData; tags: TagMstrData[]; command: CommandT }

export const StoryCompOrg = ({ title, tags, command }: StoryCompOrgProps): JSX.Element => {
  return <>
    <Formik {...formData}
      initialValues={{ name: title.name, description: title.description, tags: title.tags.map((tag) => tag.name).join(), }}
      onSubmit={async (values, { setSubmitting }) => {
        await command.saveOnClick(title, values)
        setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Commands>
          <Field component={TextField} name="name" label="タイトル" fullWidth />
          <Field component={TextField} name="description" label="説明文" multiline rows={3} fullWidth />
          <Field component={TextField} name="tags" label="タグ" fullWidth />
          <Tags>{tags.map((tag, i) => <Tag key={i} label={tag.name} onClick={() => command.tagOnClick(tag.id)} />)}</Tags>
          <SaveButton disabled={isSubmitting} onClick={submitForm}>保存</SaveButton>
        </Commands>
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
const Tag = (props: ChipProps) => <Chip {...props} />

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

const SaveButton = (props: ButtonProps) =>
  <Button {...props} variant="contained" color="primary" startIcon={<SaveIcon />} />
