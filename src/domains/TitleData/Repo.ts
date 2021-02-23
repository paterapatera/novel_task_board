import TitleData from '@/domains/TitleData'
import TagData from '@/domains/TitleData/TagData'

type UpdateTitleT = React.Dispatch<React.SetStateAction<TitleData>>
type SaveTitleT = (title: TitleData) => void
type DeleteTitleT = (id: string) => void
type UpdateTitlesT = React.Dispatch<React.SetStateAction<TitleData[]>>

export default class {
  constructor() { return }

  save(_title: TitleData): void { return }

  static deleteTitle(titles: TitleData[], updateTitles: UpdateTitlesT, deleteTitle: DeleteTitleT) {
    return (id: string): void => {
      deleteTitle(id)
      updateTitles(titles.filter((t) => t.id !== id))
    }
  }

  static addTitle(titles: TitleData[], updateTitles: UpdateTitlesT, saveTitle: SaveTitleT) {
    return (title: TitleData): void => {
      saveTitle(title)
      updateTitles([title, ...titles])
    }
  }

  static addTag(title: TitleData, updateTitle: UpdateTitleT) {
    return (tagName: string): void => {
      updateTitle(title.set('tags', [...title.tags, new TagData({ name: tagName })]))
    }
  }
}
