export class CreateOrderDTO {
  constructor(
    public readonly products: ProductItemDTO[],
    public readonly customerId?: string,
  ) {}

  static create(data: {
    body: {
      customerId?: string;
      products: ProductItemDTO[];
    };
  }): CreateOrderDTO {
    return new CreateOrderDTO(data.body.products, data.body.customerId);
  }
}

type ProductItemDTO = {
  id: string;
  quantity: number;
};
