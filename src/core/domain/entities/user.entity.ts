// enum Gender {
//     male,
//     Female
// }

import { Gender, Role } from "../interfaces/dtos/users/core-user-information.dto";

export class UserEntity {
    constructor(
        public readonly email: string,
        public password: string,
        public role?: Role | null,
        public name?: string,
        public gender?: Gender,
        public birth_place?: string,
        public birth_date?: string,
        public address?: string
    ) {}
}