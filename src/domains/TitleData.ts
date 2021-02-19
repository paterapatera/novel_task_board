import { Record } from 'immutable';
import moment from 'moment'
import TagData from './TitleData/TagData'

export default class TitleData extends Record<{
    id: string;
    name: string;
    description: string;
    image: string;
    tags: TagData[];
    updated: moment.Moment;
}>({
    id: '',
    name: '',
    description: '',
    image: '',
    tags: [],
    updated: moment('2000-01-01T00:00:00+09:00'),
}) { }
