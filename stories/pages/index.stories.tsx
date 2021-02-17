import { Story, Meta } from '@storybook/react/types-6-0'
import { action } from '@storybook/addon-actions';
import { range } from '@/utils/core'
import moment from 'moment'
import { Index, IndexProps } from '@/components/templates/Index';
import TagData from '@/domains/TagData'

const args: IndexProps = {
  command: { addOnClick: action('addOnClick'), deleteOnClick: action('deleteOnClick') },
  titleList: range(0, 9).map((i) => ({
    id: 'aaa' + i,
    title: 'バック・トゥ・ザ・フューチャー',
    description: range(0, 12).map(() => '未来に行って戻ってくる話').join(''),
    updated: moment('2000-01-01T00:00:00+09:00'),
    image: '/test/testThumb.png',
    tags: [new TagData({ name: 'アドベンチャー' }), new TagData({ name: 'SF' }), new TagData({ name: 'コメディー' }), new TagData({ name: 'ファミリー向け' })],
  }))
}

export default {
  title: 'Pages/トップページ',
} as Meta

export const IndexStory: Story<IndexProps> = (props) => <Index {...props} />
IndexStory.args = args
IndexStory.storyName = 'トップページ'
