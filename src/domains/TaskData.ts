import { Record } from 'immutable';

export type TaskQueryT = {
    id: string;
    titleId: string;
    groupName: string;
    priority: number;
    memo: string;
}
export default class extends Record({
    id: '',
    titleId: '',
    groupName: '',
    priority: 0,
    memo: '',
}) { }

export { default as TaskRepo } from '@/domains/TaskData/Repo'
