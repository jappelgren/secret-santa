export default class UserDataClass {
  id;
  name;
  email;
  idea1;
  idea2;
  idea3;

  constructor(
    id: string,
    name: string,
    email: string | null,
    idea1: string | null,
    idea2: string | null,
    idea3: string | null
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.idea1 = idea1;
    this.idea2 = idea2;
    this.idea3 = idea3;
  }

  giftIdeasComplete() {
    return this.idea1 && this.idea2 && this.idea3;
  }
}
