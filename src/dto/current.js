export class CurrentDTO {
  constructor(data) {
    this.nombre_completo = `${data.firstName} ${data.lastName}` || null;
    this.email = data.email || null;
    this.rol = data.role || null;
    this.edad = data.age;
  }
}
