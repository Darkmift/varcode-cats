import { IUser, LevelEnum } from '@/auth/auth.types';
import { faker } from '@faker-js/faker';
import { hashString } from '../bcrypt';
import { ICat } from '@/cats/types/cats.type';
import { CatVariant } from '@/cats/cat-type.entity';

const catsImages = [
  {
    id: '2bl',
    url: 'https://cdn2.thecatapi.com/images/2bl.jpg',
    width: 334,
    height: 500,
  },
  {
    id: '3kk',
    url: 'https://cdn2.thecatapi.com/images/3kk.jpg',
    width: 500,
    height: 342,
  },
  {
    id: '59d',
    url: 'https://cdn2.thecatapi.com/images/59d.jpg',
    width: 500,
    height: 375,
  },
  {
    id: 'aco',
    url: 'https://cdn2.thecatapi.com/images/aco.jpg',
    width: 506,
    height: 380,
  },
  {
    id: 'bjm',
    url: 'https://cdn2.thecatapi.com/images/bjm.jpg',
    width: 500,
    height: 354,
  },
  {
    id: 'MTYzOTU4MA',
    url: 'https://cdn2.thecatapi.com/images/MTYzOTU4MA.jpg',
    width: 500,
    height: 327,
  },
  {
    id: 'MTc4MTg0OA',
    url: 'https://cdn2.thecatapi.com/images/MTc4MTg0OA.gif',
    width: 500,
    height: 246,
  },
  {
    id: 'MTc5NTYxNg',
    url: 'https://cdn2.thecatapi.com/images/MTc5NTYxNg.jpg',
    width: 240,
    height: 320,
  },
  {
    id: 'MjA3OTE1MA',
    url: 'https://cdn2.thecatapi.com/images/MjA3OTE1MA.jpg',
    width: 506,
    height: 556,
  },
  {
    id: 'tnxX4IOst',
    url: 'https://cdn2.thecatapi.com/images/tnxX4IOst.jpg',
    width: 1080,
    height: 1350,
  },
];

function makeNumber(min, max) {
  return faker.number.int({ min, max }) as unknown as number;
}

//pick a random image from the list
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * catsImages.length);
  return catsImages[randomIndex];
}

// a function that makes a random IUser
export async function createRandomUser(catTypeIds: string[]): Promise<IUser> {
  const password = await hashString(faker.internet.password());
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    username: faker.internet.userName(),
    password,
    cat_type_id: catTypeIds[Math.floor(Math.random() * catTypeIds.length)],
  };
}

// a function that makes a random ICat
export function createRandomCat(catTypeIds: string[]): ICat {
  return {
    name: faker.animal.cat(),
    birthday: faker.date.birthdate(),
    location: faker.location.city(),
    favorite_food: faker.animal.cat(),
    fur_color: faker.color.human(),
    height: makeNumber(10, 50),
    weight: makeNumber(1, 10),
    image_url: getRandomImage().url,
    cat_type_id: catTypeIds[
      Math.floor(Math.random() * catTypeIds.length)
    ] as unknown as CatVariant,
  };
}
