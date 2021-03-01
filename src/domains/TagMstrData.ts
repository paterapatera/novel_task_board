import { Record } from 'immutable';

export type TagMstrQueryT = {
    id: string;
    name: string;
}
export default class extends Record({
    id: '',
    name: '',
}) { }

export { default as TagMstrRepo } from '@/domains/TagMstrData/Repo'
