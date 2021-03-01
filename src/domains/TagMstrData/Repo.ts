import { gql } from '@apollo/client';
import TagMstrData, { TagMstrQueryT } from '@/domains/TagMstrData'

type SaveTagMstrT = (value: { variables: { id: string; name: string } }) => void
type DeleteTagMstrT = (value: { variables: DeleteTagMstrQueryValT }) => void
// type UpdateTagMstrsT = React.Dispatch<React.SetStateAction<TagMstrData[]>>

export default class {
  constructor() { return }

  save(_tag: TagMstrData): void { return }

  static deleteTagMstr(deleteTagMstr: DeleteTagMstrT) {
    return (id: string): void => {
      deleteTagMstr({ variables: { id } })
    }
  }

  static addTagMstr(saveTagMstr: SaveTagMstrT) {
    return ({ id, name }: TagMstrData): void => {
      saveTagMstr({ variables: { id, name } })
    }
  }

  static ListQuery = gql`
    query {
      tags {
        id,
        name,
      }
    }
  `

  static DeleteQuery = gql`
    mutation DeleteTagMstr($id: String!) {
      deleteTag(id: $id)
    }
  `

  static SaveQuery = gql`
    mutation SaveTagMstr(
      $id: String!,
      $name: String!,
    ) {
      saveTag(tag: {
        id: $id,
        name: $name,
      }) {
        id
      }
    }
  `
}

export type TagMstrListQueryResultT = { tags: TagMstrQueryT[] }
export type DeleteTagMstrQueryValT = { id: string }
