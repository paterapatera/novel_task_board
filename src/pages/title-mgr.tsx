import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment'
import { TitleMgrTmpl } from '@/components/templates/TitleMgrTmpl';
import TagData from '@/domains/TitleData/TagData'
import TitleData, { TitleRepo } from '@/domains/TitleData'
import { TitleListQueryResultT } from '@/domains/TitleData/Repo'
import { uuid } from '@/utils/core'

export const TitleMgr = (): JSX.Element => {
  const { loading, error, data } = useQuery<TitleListQueryResultT>(TitleRepo.ListQuery, {
    pollInterval: 500,
  });
  const [deleteTitleGql] = useMutation<string>(TitleRepo.DeleteQuery);
  const [saveTitleGql] = useMutation<{ id: string }>(TitleRepo.SaveQuery);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const args = {
    titleListOrgProps: {
      command: {
        addTitle: TitleRepo.addTitle(saveTitleGql),
        deleteTitle: TitleRepo.deleteTitle(deleteTitleGql),
        id: uuid,
        updated: () => moment(),
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

  return <TitleMgrTmpl {...args} />
}

export default TitleMgr
