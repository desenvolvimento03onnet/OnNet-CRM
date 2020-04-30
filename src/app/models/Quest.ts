import { Search } from './Search';

export class Quest {
    id: Number;
    question: String;
    active: Boolean;
    user_id: Number;
    searches: Search[];
    created_at: Date;
    updated_at: Date;
}