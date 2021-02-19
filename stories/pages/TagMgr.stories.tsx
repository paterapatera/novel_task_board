import { Story, Meta } from '@storybook/react/types-6-0'
import { action } from '@storybook/addon-actions';
import { TagMgrTmpl, TagMgrTmplProps } from '@/components/templates/TagMgrTmpl';
import TagMstrData from '@/domains/TagMstrData'

const args: TagMgrTmplProps = {
  tagMgrTmplProps: {
    tags: [
      new TagMstrData({ id: '1', name: 'アドベンチャー' }),
      new TagMstrData({ id: '2', name: 'SF' }),
      new TagMstrData({ id: '3', name: 'コメディー' }),
      new TagMstrData({ id: '4', name: 'ファミリー向け' })
    ],
    command: {
      addOnClick: values =>
        new Promise((ok) => setTimeout(ok, 500))
          .then(action(JSON.stringify(values))),
      deleteOnClick: async (id) => action('deleteOnClick')(id)
    },

  }
}

export default {
  title: 'Pages/タグ管理',
} as Meta

export const IndexStory: Story<TagMgrTmplProps> = (props) => <TagMgrTmpl {...props} />
IndexStory.args = args
IndexStory.storyName = 'タグ管理'
