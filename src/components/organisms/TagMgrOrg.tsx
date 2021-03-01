import { Box, Chip, Button } from '@material-ui/core'
import type { ButtonProps, ChipProps } from '@material-ui/core'
import { styled } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons'
import TagMstrData from '@/domains/TagMstrData'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as yup from 'yup';
import * as ja from 'yup-locale-ja';

yup.setLocale(ja.descriptive)
type CommandT = { addOnClick: (values: TagMstrData) => void; deleteOnClick: (id: string) => void; id: () => string }
export type TagMgrOrgProps = { tags: TagMstrData[]; command: CommandT }

export const TagMgrOrg = ({ tags, command }: TagMgrOrgProps): JSX.Element => {
  return <>
    <Formik {...formData}
      onSubmit={async (values, { setSubmitting }) => {
        await command.addOnClick(new TagMstrData({ id: command.id(), name: values.tagName }))
        setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Commands>
          <Field component={TextField} name="tagName" label="タグ名" />
          <AddButton disabled={isSubmitting} onClick={submitForm}>追加</AddButton>
        </Commands>
      )}
    </Formik >
    <Tags>{tags.map((tag, i) => <Tag key={i} label={tag.name} onDelete={() => command.deleteOnClick(tag.id)} />)}</Tags>
  </>
}

const formData = {
  initialValues: { tagName: '', },
  validationSchema: yup.object({ tagName: yup.string().max(20).required(), }),
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
    margin: theme.spacing(0, 1),
  },
}))

const AddButton = (props: ButtonProps) =>
  <Button {...props} variant="contained" color="primary" startIcon={<AddIcon />} />
