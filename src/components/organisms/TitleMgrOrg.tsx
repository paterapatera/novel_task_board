import NImage from 'next/image'
import { Grid, Typography, Link, Box, Chip, Button } from '@material-ui/core'
import type { GridProps, TypographyProps, LinkProps, ButtonProps, ChipProps } from '@material-ui/core'
import { styled } from '@material-ui/core/styles';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { truncateString, DateFormat } from '@/utils/core'
import TitleData from '@/domains/TitleData'

type CommandT = { addOnClick: () => void; deleteOnClick: () => void; }
export type TitleMgrOrgProps = { titleList: TitleData[]; command: CommandT }

export const TitleMgrOrg = ({ titleList, command }: TitleMgrOrgProps): JSX.Element =>
  <>
    <Commands>
      <AddButton onClick={command.addOnClick}>追加</AddButton>
      <DeleteButton onClick={command.deleteOnClick}>削除</DeleteButton>
    </Commands>
    <Titles>
      {titleList.map((title) => {
        const href = '/task-board/' + title.id
        return <Title key={title.id}>
          <Image src={title.image} href={href}></Image>
          <TitleName href={href}>{title.name}</TitleName>
          <Description>{truncateString(title.description, 150)}</Description>
          <Tags>{title.tags.map((tag, i) => <Tag key={i} label={tag.name} />)}</Tags>
          <Updated>更新日: {title.updated.format(DateFormat)}</Updated>
        </Title>
      })}
    </Titles>
  </>

// タイトル
const Titles = (props: GridProps) =>
  <Grid {...props} container spacing={3} />

const Title = (props: GridProps) =>
  <Grid {...props} item xs={12} md={3} />

const TitleName = (props: LinkProps) =>
  <Typography variant="h6" component="h3"><Link {...props} /></Typography>

const Description = (props: TypographyProps<'p'>) =>
  <Typography {...props} variant="body1" component="p" />

const Updated = styled((props: TypographyProps<'p'>) =>
  <Typography {...props} variant="body2" component="p" />)({ textAlign: 'right' })

const Image = styled(({ href, src }: { href: string, src: string }) =>
  <Link href={href}><NImage src={src} width={400} height={225} /></Link>)({ objectFit: 'cover' })

// タイトル > タグ
const Tag = (props: ChipProps) => <Chip {...props} />

const Tags = styled(Box)(({ theme }) => ({
  '& > *': {
    margin: theme.spacing(0.5),
  },
}))

// ボタン
const Commands = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '& > *': {
    margin: theme.spacing(0, 1),
  },
}))

const AddButton = (props: ButtonProps) =>
  <Button {...props} variant="contained" color="primary" startIcon={<AddIcon />} />

const DeleteButton = (props: ButtonProps) =>
  <Button {...props} variant="contained" color="secondary" startIcon={<DeleteIcon />} />
