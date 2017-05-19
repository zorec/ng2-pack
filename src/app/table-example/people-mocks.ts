declare var faker: any;

let rand = (minimum: number, maximum: number) => {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

let randomItem = (arr: any[]) => {
  return arr[rand(0, arr.length - 1)];
};

export interface Study {
  university: string;
  faculty: string;
  // studyDuration: [Date, Date];
  degree: 'Bachelor' | 'Master' | 'Doctor';
  // form: 'Daily' | 'Remotely';
  finished: boolean;
}

export interface Person {
  salutation: 'Mrs.' | 'Mr.' | 'Miss' | 'Ms' | 'Dr.';
  id: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  studies: Study[];
}

export let generatePeople = (numberOfRecords: number) => {
  let people: Person[] = [];

  for (let i = 0; i < numberOfRecords; i++) {
    let studies: Study[] = [];

    let studiesCount = rand(1, 4);
    for (let j = 0; j < studiesCount; j++) {
      let study = {
        university: 'University of ' + faker.name.jobArea(),
        faculty: 'Faculty of ' + faker.name.jobArea(),
        degree: randomItem(['Bachelor', 'Master', 'Doctor']),
        // form: randomItem(['Daily', 'Remotely']),
        // area: faker.name.jobArea(),
        finished: Math.random() >= 0.3 ? true : false,
        // studyDuration: [faker.date.past(), faker.date.past()] as [Date, Date],
      };
      studies.push(study);
    }

    let person = {
      id: faker.random.uuid(),
      salutation: randomItem(['Mrs.', 'Mr.', 'Miss', 'Ms', 'Dr.' ]),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthday: new Date(faker.date.past()),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        country: faker.address.country(),
      },
      // graduationYear: rand(1970, 2016),
      studies: studies
    };

    people.push(person);
  }
  return people;
};
export let people = generatePeople(20);
