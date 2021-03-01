import { useQuery, useMutation } from '@apollo/client';
import { Story, Meta } from '@storybook/react/types-6-0'
import { range } from '@/utils/core'
import moment from 'moment'
import { TitleMgrTmpl, TitleMgrTmplProps } from '@/components/templates/TitleMgrTmpl';
import TagData from '@/domains/TitleData/TagData'
import TitleData, { TitleRepo } from '@/domains/TitleData'
import { TitleListQueryResultT } from '@/domains/TitleData/Repo'

export default {
  title: 'Pages/タイトル管理',
} as Meta

export const IndexStory: Story = () => {
  const { loading, error, data } = useQuery<TitleListQueryResultT>(TitleRepo.ListQuery);
  const [deleteTitleGql, { loading: mutationLoading, error: mutationError }] = useMutation<string>(TitleRepo.DeleteQuery);
  const [saveTitleGql, { loading: ml2, error: me2 }] = useMutation<{ id: string }>(TitleRepo.SaveQuery);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const args: TitleMgrTmplProps = {
    titleListOrgProps: {
      command: {
        addTitle: TitleRepo.addTitle(saveTitleGql),
        deleteTitle: TitleRepo.deleteTitle(deleteTitleGql),
        id: () => 'id1',
        updated: () => moment('2000-01-01 00:00:00'),
      },
      titleList: data.titles.map(({ id, name, description, updated, image, tags }) => (new TitleData({
        id,
        name,
        description,
        updated: moment(updated),
        image: image,
        tags: tags.split(',').map((name) => new TagData({ name })),
      }))),
    }
  }

  return <>{mutationLoading || ml2 && <p>Loading...</p>}{mutationError || me2 && <p>Error!</p>}<TitleMgrTmpl {...args} /></>
}
IndexStory.storyName = 'タイトル管理'
IndexStory.parameters = {
  apolloClient: {
    mocks: [
      {
        request: { query: TitleRepo.ListQuery },
        result: {
          data: {
            titles: range(0, 9).map((i) => ({
              id: 'aaa' + i,
              name: 'バック・トゥ・ザ・フューチャー',
              description: range(0, 12).map(() => '未来に行って戻ってくる話').join(''),
              updated: '2000-01-01T00:00:00+09:00',
              image: '/test/testThumb.png',
              tags: 'アドベンチャー,SF,コメディー,ファミリー向け',
            })),
          },
        },
      },
      {
        request: { query: TitleRepo.DeleteQuery, variables: { id: 'aaa0' } },
        result: { data: { deleteTitle: 'dleteId1' } },
      },
      {
        request: {
          query: TitleRepo.SaveQuery, variables: {
            id: 'id1',
            name: 'New Title',
            description: '',
            image: '',
            tags: '',
            updated: '2000-01-01T00:00:00+09:00',
          }
        },
        result: { data: { saveTitle: { id: 'dleteId1' } } },
      },
    ],
  },
};
