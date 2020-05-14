import { Search } from './Search';
import { City } from './City';

export class Interview {
    id: Number;
    client_name: String;
    search_id: Number;
    city_id: Number;
    user_id: Number;
    created_at: Date;
    updated_at: Date;
    search: Search;
    city: City;
}