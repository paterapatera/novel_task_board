import NImage from 'next/image'
import moment from 'moment'
import { Grid, Typography, Link, Box, Chip, Button } from '@material-ui/core'
import type { GridProps, TypographyProps, LinkProps, ButtonProps, ChipProps } from '@material-ui/core'
import { styled } from '@material-ui/core/styles';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { truncateString, DateFormat } from '@/utils/core'
import TagData from '@/domains/TagData'

type TitleT = { id: string; title: string; description: string; updated: moment.Moment; image: string; tags: TagData[]; }
type CommandT = { addOnClick: () => void; deleteOnClick: () => void; }
export type TitleListProps = { titleList: TitleT[]; command: CommandT }

export const TitleList = ({ titleList, command }: TitleListProps): JSX.Element =>
  <>
    <CommandList>
      <AddButton onClick={command.addOnClick}>追加</AddButton>
      <DeleteButton onClick={command.deleteOnClick}>削除</DeleteButton>
    </CommandList>
    <Titles>
      {titleList.map(({ id, title, description, updated, image, tags }) => {
        const href = '/task-board/' + id
        return <Title key={id}>
          <Image src={image} href={href}></Image>
          <TitleName href={href}>{title}</TitleName>
          <Description>{truncateString(description, 150)}</Description>
          <TagList tags={tags} />
          <Updated>更新日: {updated.format(DateFormat)}</Updated>
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

const TagList = ({ tags }: { tags: TagData[] }) =>
  <Tags>
    {tags.map((tag, i) => <Tag key={i} label={tag.name} />)}
  </Tags>

// ボタン
const CommandList = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '& > *': {
    margin: theme.spacing(0, 1),
  },
}))

const AddButton = (props: ButtonProps) =>
  <Button {...props} variant="contained" color="primary" startIcon={<AddIcon />} />

const DeleteButton = (props: ButtonProps) =>
  <Button {...props} variant="contained" color="secondary" startIcon={<DeleteIcon />} />
