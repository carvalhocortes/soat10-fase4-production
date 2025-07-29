import { Request, Response } from 'express';
import { UpdateProductionStatusUseCase } from '@application/use-cases/order/UpdateProductionStatus.useCase';
import { UpdateProductionStatusDTO } from '@application/dto/order/UpdateProductionStatus.dto';

export class OrderController {
  constructor(private readonly updateProductionStatusUseCase: UpdateProductionStatusUseCase) {}

  updateOrderStatus = async ({ body, params }: Request, res: Response): Promise<void> => {
    const dto = UpdateProductionStatusDTO.create({ params, body });
    const order = await this.updateProductionStatusUseCase.execute(dto);
    res.json(order);
  };
}
