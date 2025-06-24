export class CreateCustomerDTO {
  constructor(
    public readonly cpf: string,
    public readonly name: string,
    public readonly email: string,
  ) {}

  static create(data: {
    body: {
      cpf: string;
      name: string;
      email: string;
    };
  }): CreateCustomerDTO {
    return new CreateCustomerDTO(data.body.cpf, data.body.name, data.body.email);
  }
}
