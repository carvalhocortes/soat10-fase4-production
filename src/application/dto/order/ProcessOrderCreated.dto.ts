export class ProcessOrderCreatedDTO {
  constructor(
    public readonly orderId: string,
    public readonly amount: number,
  ) {}

  static create(data: { payload: { orderId: string; amount: number } }): ProcessOrderCreatedDTO {
    if (!data.payload.orderId) {
      throw new Error('Order ID is required');
    }

    return new ProcessOrderCreatedDTO(data.payload.orderId, data.payload.amount);
  }
}
