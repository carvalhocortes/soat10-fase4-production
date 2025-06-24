export class UpdateProductDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: string,
    public readonly price: number,
    public readonly description: string,
    public readonly images: Array<string>,
  ) {}

  static create(data: {
    params: { id?: string };
    body: {
      name: string;
      category: string;
      price: number;
      description: string;
      images: Array<string>;
    };
  }): UpdateProductDTO {
    if (!data.params.id) {
      throw new Error('Order ID is required');
    }

    return new UpdateProductDTO(
      data.params.id,
      data.body.name,
      data.body.category,
      data.body.price,
      data.body.description,
      data.body.images,
    );
  }
}
