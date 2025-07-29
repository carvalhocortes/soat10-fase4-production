import { UpdateProductionStatusUseCase } from '../../application/use-cases/order/UpdateProductionStatus.useCase';
import { Order } from '../../core/entities/order.entity';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { SnsPublisher } from '../../infrastructure/external/snsPublisher';

const mockOrderRepository = {
  save: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
};

const mockSnsPublisher = { publish: jest.fn() } as unknown as jest.Mocked<SnsPublisher>;

describe('UpdateProductionStatusUseCase', () => {
  describe('Given an existing order with status "in_preparation"', () => {
    const orderId = 'order-001';

    let freshOrder: Order;

    beforeEach(() => {
      freshOrder = Order.create({ id: orderId, orderId, status: 'in_preparation' });
      mockOrderRepository.findById.mockResolvedValue(freshOrder);
      mockOrderRepository.update.mockResolvedValue({ ...freshOrder, status: 'ready' });
      mockSnsPublisher.publish.mockResolvedValue(undefined);
    });

    describe('When the production status is updated to "ready"', () => {
      let result: Order | null;

      beforeEach(async () => {
        const useCase = new UpdateProductionStatusUseCase(mockOrderRepository, mockSnsPublisher);
        result = await useCase.execute({ id: orderId, status: 'ready' });
      });

      it('should return the order with the updated status', () => {
        expect(result).not.toBeNull();
        expect(result?.status).toBe('ready');
      });

      it('should fetch the order by ID from the repository', () => {
        expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      });

      it('should update the order with the new status in the repository', () => {
        expect(mockOrderRepository.update).toHaveBeenCalledWith(orderId, freshOrder);
      });

      it('should publish the "PRODUCTION_STATUS_UPDATED" event with the updated order', () => {
        expect(mockSnsPublisher.publish).toHaveBeenCalledWith({
          eventType: 'PRODUCTION_STATUS_UPDATED',
          payload: freshOrder,
        });
      });
    });
  });

  it('should throw NotFoundError if order does not exist', async () => {
    mockOrderRepository.findById.mockResolvedValueOnce(null);
    const useCase = new UpdateProductionStatusUseCase(mockOrderRepository, mockSnsPublisher);
    await expect(useCase.execute({ id: 'not-exist', status: 'ready' })).rejects.toThrow(NotFoundError);
  });

  it('should propagate error if snsPublisher.publish fails', async () => {
    const orderId = 'order-002';
    const order = Order.create({ id: orderId, orderId, status: 'in_preparation' });
    mockOrderRepository.findById.mockResolvedValueOnce(order);
    mockSnsPublisher.publish.mockRejectedValueOnce(new Error('SNS error'));
    const useCase = new UpdateProductionStatusUseCase(mockOrderRepository, mockSnsPublisher);
    await expect(useCase.execute({ id: orderId, status: 'ready' })).rejects.toThrow('SNS error');
  });
});
