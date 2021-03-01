import { useQuery, useMutation } from '@apollo/client';
import { uuid } from '@/utils/core'
import { TagMgrTmpl, TagMgrTmplProps } from '@/components/templates/TagMgrTmpl';
import TagMstrData, { TagMstrRepo } from '@/domains/TagMstrData'
import { TagMstrListQueryResultT } from '@/domains/TagMstrData/Repo'

export const TagMgr = (): JSX.Element => {
  const { loading, error, data } = useQuery<TagMstrListQueryResultT>(TagMstrRepo.ListQuery, {
    pollInterval: 500,
  });
  const [deleteTagGql] = useMutation<string>(TagMstrRepo.DeleteQuery);
  const [saveTagGql, { loading: l, error: e }] = useMutation<{ id: string }>(TagMstrRepo.SaveQuery);
  if (loading || l) return <p>Loading...</p>;
  if (error || e) return <p>Error!</p>;
  const args: TagMgrTmplProps = {
    tagMgrTmplProps: {
      tags: data.tags.map(({ id, name }) => new TagMstrData({ id, name })),
      command: {
        addOnClick: TagMstrRepo.addTagMstr(saveTagGql),
        deleteOnClick: TagMstrRepo.deleteTagMstr(deleteTagGql),
        id: uuid,
      },

    }
  }

  return <TagMgrTmpl {...args} />
}

export default TagMgr
