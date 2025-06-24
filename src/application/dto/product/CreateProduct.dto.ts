export class CreateProductDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: string,
    public readonly price: number,
    public readonly description: string,
    public readonly images: Array<string>,
  ) {}

  static create(data: {
    body: {
      id: string;
      name: string;
      category: string;
      price: number;
      description: string;
      images: Array<string>;
    };
  }): CreateProductDTO {
    return new CreateProductDTO(
      data.body.id,
      data.body.name,
      data.body.category,
      data.body.price,
      data.body.description,
      data.body.images,
    );
  }
}
