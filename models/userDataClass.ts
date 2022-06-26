class UserData {
  name: string;
  email: string | null;
  idea1: string | null;
  idea2: string | null;
  idea3: string | null;

  constructor(
    name: string,
    email: string | null,
    idea1: string | null,
    idea2: string | null,
    idea3: string | null
  ) {
    this.name = name;
    this.email = email;
    this.idea1 = idea1;
    this.idea2 = idea2;
    this.idea3 = idea3;
  }

  giftIdeasComplete() {
    return this.idea1 && this.idea2 && this.idea3
  }
}

export default UserData;
