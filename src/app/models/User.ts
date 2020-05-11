import { Permission } from './Permission';

export class User {
    id: Number;
    name: String;
    username: String;
    password: String;
    active: Boolean;
    permission_id: Number;
    permission: Permission;
    created_at: Date;
    updated_at: Date;
}