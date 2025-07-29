import { Order } from '@core/entities/order.entity';
import { ProcessOrderCreatedUseCase } from '@application/use-cases/order/ProcessOrderCreated.useCase';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';

const mockOrderRepository = {
  save: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
};

const mockSnsPublisher = { publish: jest.fn() } as unknown as jest.Mocked<SnsPublisher>;

describe('ProcessOrderCreatedUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order with status received and save it', async () => {
    const useCase = new ProcessOrderCreatedUseCase(mockOrderRepository, mockSnsPublisher);
    const orderId = 'order-123';
    const amount = 100;
    mockOrderRepository.save.mockResolvedValueOnce(undefined);
    mockSnsPublisher.publish.mockResolvedValueOnce(undefined);

    const result = await useCase.execute({ orderId, amount });

    expect(result).toBeInstanceOf(Order);
    expect(result.id).toBe(orderId);
    expect(result.status).toBe('received');
    expect(mockOrderRepository.save).toHaveBeenCalledWith(result);
  });

  it('should publish ORDER_PRODUCTION_CREATED event with correct payload', async () => {
    const useCase = new ProcessOrderCreatedUseCase(mockOrderRepository, mockSnsPublisher);
    const orderId = 'order-456';
    const amount = 200;
    mockOrderRepository.save.mockResolvedValueOnce(undefined);
    mockSnsPublisher.publish.mockResolvedValueOnce(undefined);

    await useCase.execute({ orderId, amount });

    expect(mockSnsPublisher.publish).toHaveBeenCalledWith({
      eventType: 'ORDER_PRODUCTION_CREATED',
      payload: {
        orderId,
        status: 'received',
      },
    });
  });

  it('should throw if repository save fails', async () => {
    const useCase = new ProcessOrderCreatedUseCase(mockOrderRepository, mockSnsPublisher);
    const orderId = 'order-789';
    const amount = 300;
    mockOrderRepository.save.mockRejectedValueOnce(new Error('DB error'));

    await expect(useCase.execute({ orderId, amount })).rejects.toThrow('DB error');
  });

  it('should throw if snsPublisher.publish fails', async () => {
    const useCase = new ProcessOrderCreatedUseCase(mockOrderRepository, mockSnsPublisher);
    const orderId = 'order-101';
    const amount = 400;
    mockOrderRepository.save.mockResolvedValueOnce(undefined);
    mockSnsPublisher.publish.mockRejectedValueOnce(new Error('SNS error'));

    await expect(useCase.execute({ orderId, amount })).rejects.toThrow('SNS error');
  });
});
