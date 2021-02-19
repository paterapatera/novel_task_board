import { StoryCompOrg, StoryCompOrgProps } from '@/components/organisms/StoryCompOrg'

export type StoryCompTmplProps = { storyCompTmplProps: StoryCompOrgProps }

export const StoryCompTmpl = ({ storyCompTmplProps }: StoryCompTmplProps): JSX.Element => <StoryCompOrg {...storyCompTmplProps} />
