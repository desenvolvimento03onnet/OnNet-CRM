import { Quest } from './Quest';

export class Search {
    id: Number;
    type: String;
    user_id: Number;
    active: Boolean;
    quests: Quest[];
    created_at: Date;
    updated_at: Date;
}