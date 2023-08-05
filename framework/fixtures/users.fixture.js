import { faker } from '@faker-js/faker';

export const users = {
    random() {
        return ({
            params: {
                name: faker.internet.fullName(),
                description: faker.lorem.sentence(),
                enabled: faker.datatype.boolean(),
                admin: faker.datatype.boolean(),
            },
            login: faker.internet.userName(),
            password: faker.internet.password()
        }
        )
    }
}
