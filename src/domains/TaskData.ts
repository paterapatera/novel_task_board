import { Record } from 'immutable';

export default class extends Record({
    id: '',
    group: '',
    priority: 0,
    memo: '',
}) { }

export { default as TaskRepo } from '@/domains/TaskData/Repo'
