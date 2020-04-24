import { User } from './User';

export class City {
    id: Number;
    name: String;
    active: Boolean;
    user_id: Number;
    created_at: Date;
    updated_at: Date;
    user: User;
}