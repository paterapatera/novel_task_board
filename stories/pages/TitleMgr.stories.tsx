import { Story, Meta } from '@storybook/react/types-6-0'
import { action } from '@storybook/addon-actions';
import { range } from '@/utils/core'
import moment from 'moment'
import { TitleMgrTmpl, TitleMgrTmplProps } from '@/components/templates/TitleMgrTmpl';
import TagData from '@/domains/TitleData/TagData'
import TitleData from '@/domains/TitleData'

const args: TitleMgrTmplProps = {
  titleListOrgProps: {
    command: { addOnClick: action('addOnClick'), deleteOnClick: action('deleteOnClick') },
    titleList: range(0, 9).map((i) => (new TitleData({
      id: 'aaa' + i,
      name: 'バック・トゥ・ザ・フューチャー',
      description: range(0, 12).map(() => '未来に行って戻ってくる話').join(''),
      updated: moment('2000-01-01T00:00:00+09:00'),
      image: '/test/testThumb.png',
      tags: [new TagData({ name: 'アドベンチャー' }), new TagData({ name: 'SF' }), new TagData({ name: 'コメディー' }), new TagData({ name: 'ファミリー向け' })],
    })))
  }
}

export default {
  title: 'Pages/タイトル管理',
} as Meta

export const IndexStory: Story<TitleMgrTmplProps> = (props) => <TitleMgrTmpl {...props} />
IndexStory.args = args
IndexStory.storyName = 'タイトル管理'
