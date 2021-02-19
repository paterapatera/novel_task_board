import { Story, Meta } from '@storybook/react/types-6-0'
import { action } from '@storybook/addon-actions';
import { range } from '@/utils/core'
import moment from 'moment'
import { StoryCompTmpl, StoryCompTmplProps } from '@/components/templates/StoryCompTmpl';
import TagMstrData from '@/domains/TagMstrData'
import TagData from '@/domains/TitleData/TagData'
import TitleData from '@/domains/TitleData'

const args: StoryCompTmplProps = {
  storyCompTmplProps: {
    tags: [
      new TagMstrData({ id: '1', name: 'アドベンチャー' }),
      new TagMstrData({ id: '2', name: 'SF' }),
      new TagMstrData({ id: '3', name: 'コメディー' }),
      new TagMstrData({ id: '4', name: 'ファミリー向け' })
    ],
    title: new TitleData({
      id: 'aaa',
      name: 'バック・トゥ・ザ・フューチャー',
      description: range(0, 12).map(() => '未来に行って戻ってくる話').join(''),
      updated: moment('2000-01-01T00:00:00+09:00'),
      image: '/test/testThumb.png',
      tags: [new TagData({ name: 'アドベンチャー' }), new TagData({ name: 'SF' }), new TagData({ name: 'コメディー' }), new TagData({ name: 'ファミリー向け' })],
    }),
    command: {
      saveOnClick: (title, values) =>
        new Promise((ok) => setTimeout(ok, 500))
          .then(action(JSON.stringify(values)))
          .then(action(JSON.stringify(title))),
      tagOnClick: async (id) => action('tagOnClick')(id)
    },

  }
}

export default {
  title: 'Pages/物語の構成',
} as Meta

export const IndexStory: Story<StoryCompTmplProps> = (props) => <StoryCompTmpl {...props} />
IndexStory.args = args
IndexStory.storyName = '物語の構成'
