import { TitleMgrOrg, TitleMgrOrgProps } from '@/components/organisms/TitleMgrOrg'

export type TitleMgrTmplProps = { titleListOrgProps: TitleMgrOrgProps }

export const TitleMgrTmpl = ({ titleListOrgProps }: TitleMgrTmplProps): JSX.Element => <TitleMgrOrg {...titleListOrgProps} />
