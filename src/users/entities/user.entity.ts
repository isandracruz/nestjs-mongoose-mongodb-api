export interface UserInterface {
    name: string;
    age: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

export class UserClass implements UserInterface {
    name: string;
    age: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

