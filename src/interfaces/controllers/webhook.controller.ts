import { Request, Response } from 'express';

import { UpdateOrderPaymentStatusUseCase } from '@application/use-cases/payment/UpdateOrderPaymentStatus.useCase';
import { UpdateOrderPaymentStatusDTO } from '@application/dto/payment/UpdateOrderPayment.dto';

export class PaymentWebhookController {
  constructor(private readonly updatePaymentUseCase: UpdateOrderPaymentStatusUseCase) {}

  handlePaymentNotification = async (req: Request, res: Response): Promise<void> => {
    const dto = UpdateOrderPaymentStatusDTO.create(req);
    const customer = await this.updatePaymentUseCase.execute(dto);
    res.json(customer);
  };
}
