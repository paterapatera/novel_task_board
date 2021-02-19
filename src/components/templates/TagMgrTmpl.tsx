import { TagMgrOrg, TagMgrOrgProps } from '@/components/organisms/TagMgrOrg'

export type TagMgrTmplProps = { tagMgrTmplProps: TagMgrOrgProps }

export const TagMgrTmpl = ({ tagMgrTmplProps }: TagMgrTmplProps): JSX.Element => <TagMgrOrg {...tagMgrTmplProps} />
