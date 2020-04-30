import { Quest } from './Quest';
import { Search } from './Search';

export class SearchQuest {
    id: Number;
    search_id: Number;
    quest_id: Number;
    created_at: Date;
    updated_at: Date;
    search: Search;
    quest: Quest;
}