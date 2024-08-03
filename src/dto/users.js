export class UserDto {
  constructor(u) {
    this.id = u._id;
    this.firstName = u.firstName;
    this.lastName = u.lastName;
    this.age = u.age;
    this.rol = u.role;
    this.email = u.email;
  }
}
