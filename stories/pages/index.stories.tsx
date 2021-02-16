import React from 'react'
import NImage from 'next/image'
import { Story, Meta } from '@storybook/react/types-6-0'
import { action } from '@storybook/addon-actions';
import { Grid, Typography, Link, Button, Box, Chip } from '@material-ui/core'
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { range, truncateString, DateFormat } from '@/utils/core'
import moment from 'moment'
import { styled } from '@material-ui/core/styles';

type Tag = { name: string; }
type TitleT = { id: string; title: string; description: string; updated: moment.Moment; image: string; tags: Tag[]; }
type CommandT = { addOnClick: () => void; deleteOnClick: () => void; }
type PropsT = { titleList: TitleT[]; command: CommandT }

const args: PropsT = {
  command: { addOnClick: action('addOnClick'), deleteOnClick: action('deleteOnClick') },
  titleList: range(0, 9).map((i) => ({
    id: 'aaa' + i,
    title: 'バック・トゥ・ザ・フューチャー',
    description: range(0, 12).map(() => '未来に行って戻ってくる話').join(''),
    updated: moment('2000-01-01T00:00:00+09:00'),
    image: '/test/testThumb.png',
    tags: [{ name: 'アドベンチャー' }, { name: 'SF' }, { name: 'コメディー' }, { name: 'ファミリー向け' }],
  }))
}

export default {
  title: 'Pages/トップページ',
  component: Button
} as Meta

export const トップページ: Story<PropsT> = ({ titleList, command }) =>
  <>
    <CommandList>
      <AddButton onClick={command.addOnClick} />
      <DeleteButton onClick={command.deleteOnClick} />
    </CommandList>
    <TitleList>
      {titleList.map(({ id, title, description, updated, image, tags }) => {
        const href = '/task-board/' + id
        return <Title key={id}>
          <Image src={image} href={href}></Image>
          <TitleName href={href}>{title}</TitleName>
          <Description>{truncateString(description, 150)}</Description>
          <TagList>
            {tags.map(({ name }, i) => <Tag key={i} label={name} />)}
          </TagList>
          <Updated>更新日: {updated.format(DateFormat)}</Updated>
        </Title>
      })}
    </TitleList>
  </>

トップページ.args = args

const CommandList = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '& > *': {
    margin: theme.spacing(0, 1),
  },
}))

const AddButton = (props) => <Button {...props} variant="contained" color="primary" startIcon={<AddIcon />}>追加</Button>

const DeleteButton = (props) => <Button {...props} variant="contained" color="secondary" startIcon={<DeleteIcon />}>削除</Button>

const TitleList = (props) => <Grid {...props} container spacing={3} />

const Title = (props) => <Grid {...props} item xs={12} md={3} />

const TitleName = (props) => <Typography variant="h6" component="h3"><Link {...props} /></Typography>

const Description = (props) => <Typography {...props} variant="body1" component="p" />

const Updated = styled((props) => <Typography {...props} variant="body2" component="p" />)({ textAlign: 'right' })

const Image = styled((props) => <Link href={props?.href}><NImage {...props} width={400} height={225} /></Link>)({ objectFit: 'cover' })

const TagList = styled(Box)(({ theme }) => ({
  '& > *': {
    margin: theme.spacing(0.5),
  },
}))

const Tag = (props) => <Chip {...props} />
