import { Quest } from './Quest';
import { Interview } from './Interview';

export class Answer {
    id: Number;
    rate: number;
    note: String;
    interview_id: Number;
    quest_id: Number;
    created_at: Date;
    updated_at: Date;
    interview: Interview;
    quest: Quest;
}