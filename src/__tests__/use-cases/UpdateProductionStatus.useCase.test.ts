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
  it('should update the order status and publish event', async () => {
    // Given
    const orderId = 'order-001';
    const order = Order.create({ id: orderId, orderId, status: 'in_preparation' });
    mockOrderRepository.findById.mockResolvedValueOnce(order);
    mockOrderRepository.update.mockResolvedValueOnce({ ...order, status: 'ready' });
    mockSnsPublisher.publish.mockResolvedValueOnce(undefined);
    const useCase = new UpdateProductionStatusUseCase(mockOrderRepository, mockSnsPublisher);
    const status = 'ready';

    // When
    const result = await useCase.execute({ id: orderId, status });

    // Then
    expect(result).not.toBeNull();
    expect(result?.status).toBe('ready');
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(mockOrderRepository.update).toHaveBeenCalledWith(orderId, order);
    expect(mockSnsPublisher.publish).toHaveBeenCalledWith({
      eventType: 'PRODUCTION_STATUS_UPDATED',
      payload: order,
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
