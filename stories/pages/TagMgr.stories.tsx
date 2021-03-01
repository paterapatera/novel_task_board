import { useQuery, useMutation } from '@apollo/client';
import { Story, Meta } from '@storybook/react/types-6-0'
import { range } from '@/utils/core'
import { TagMgrTmpl, TagMgrTmplProps } from '@/components/templates/TagMgrTmpl';
import TagMstrData, { TagMstrRepo } from '@/domains/TagMstrData'
import { TagMstrListQueryResultT } from '@/domains/TagMstrData/Repo'

export default {
  title: 'Pages/タグ管理',
} as Meta

export const IndexStory: Story = () => {
  const { loading, error, data } = useQuery<TagMstrListQueryResultT>(TagMstrRepo.ListQuery);
  const [deleteTagGql, { loading: mutationLoading, error: mutationError }] = useMutation<string>(TagMstrRepo.DeleteQuery);
  const [saveTagGql, { loading: ml2, error: me2 }] = useMutation<{ id: string }>(TagMstrRepo.SaveQuery);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const args: TagMgrTmplProps = {
    tagMgrTmplProps: {
      tags: data.tags.map(({ id, name }) => new TagMstrData({ id, name })),
      command: {
        addOnClick: TagMstrRepo.addTagMstr(saveTagGql),
        deleteOnClick: TagMstrRepo.deleteTagMstr(deleteTagGql),
        id: () => 'id1',
      },

    }
  }

  return <>{mutationLoading || ml2 && <p>Loading...</p>}{mutationError || me2 && <p>Error!</p>}<TagMgrTmpl {...args} /></>
}
IndexStory.storyName = 'タグ管理'
IndexStory.parameters = {
  apolloClient: {
    mocks: [
      {
        request: { query: TagMstrRepo.ListQuery },
        result: {
          data: {
            tags: range(0, 9).map((i) => ({
              id: 'aaa' + i,
              name: 'タグ' + i,
            })),
          },
        },
      },
      {
        request: { query: TagMstrRepo.DeleteQuery, variables: { id: 'aaa0' } },
        result: { data: { deleteTag: 'dleteId1' } },
      },
      {
        request: {
          query: TagMstrRepo.SaveQuery, variables: {
            id: 'id1',
            name: 'a',
          }
        },
        result: { data: { saveTag: { id: 'dleteId1' } } },
      },
    ],
  },
};
