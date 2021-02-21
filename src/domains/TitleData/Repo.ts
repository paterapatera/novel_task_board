import TitleData from '@/domains/TitleData'
import TagData from '@/domains/TitleData/TagData'

type UpdateTitleT = React.Dispatch<React.SetStateAction<TitleData>>

export default class {
  constructor() { return }

  save(_title: TitleData): void { return }

  static addTag(title: TitleData, updateTitle: UpdateTitleT) {
    return (tagName: string): void => {
      updateTitle(title.set('tags', [...title.tags, new TagData({ name: tagName })]))
    }
  }
}
