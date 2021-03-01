import { gql } from '@apollo/client';
import TitleData, { TitleQueryT } from '@/domains/TitleData'
import TagData from '@/domains/TitleData/TagData'

type UpdateTitleT = React.Dispatch<React.SetStateAction<TitleData>>
type SaveTitleT = (value: { variables: { id: string, name: string, description: string, image: string, tags: string, updated: string } }) => void
type DeleteTitleT = (value: { variables: DeleteTitleQueryValT }) => void
// type UpdateTitlesT = React.Dispatch<React.SetStateAction<TitleData[]>>

export default class {
  constructor() { return }

  save(_title: TitleData): void { return }

  static deleteTitle(deleteTitle: DeleteTitleT) {
    return (id: string): void => {
      deleteTitle({ variables: { id } })
    }
  }

  static addTitle(saveTitle: SaveTitleT) {
    return ({ id, name, description, image, tags, updated }: TitleData): void => {
      saveTitle({
        variables: {
          id,
          name,
          description,
          image,
          tags: tags.map(i => i.name).join(),
          updated: updated.format(),
        }
      }
      )
    }
  }

  static addTag(title: TitleData, updateTitle: UpdateTitleT) {
    return (tagName: string): void => {
      updateTitle(title.set('tags', [...title.tags, new TagData({ name: tagName })]))
    }
  }

  static TitleQuery = gql`
    query {
      title {
        id,
        name,
        description,
        image,
        tags,
        updated,
      }
    }
  `

  static ListQuery = gql`
    query {
      titles {
        id,
        name,
        description,
        image,
        tags,
        updated,
      }
    }
  `

  static DeleteQuery = gql`
    mutation DeleteTitle($id: String!) {
      deleteTitle(id: $id)
    }
  `

  static SaveQuery = gql`
    mutation SaveTitle(
      $id: String!,
      $name: String!,
      $description: String!,
      $image: String!,
      $tags: String!,
      $updated: String!,
    ) {
      saveTitle(title: {
        id: $id,
        name: $name,
        description:$description,
        image: $image,
        tags: $tags,
        updated: $updated,
      }) {
        id
      }
    }
  `
}

export type TitleListQueryResultT = { titles: TitleQueryT[] }
export type TitleQueryResultT = { title: TitleQueryT }
export type DeleteTitleQueryValT = { id: string }
