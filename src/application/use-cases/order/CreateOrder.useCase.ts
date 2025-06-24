import { Order } from '@core/entities/order.entity';
import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';
import { CustomerRepository } from '@interfaces/gateways/CustomerRepository.gateway';
import { CounterRepository } from '@interfaces/gateways/CounterRepository.gateway';
import { PaymentGateway } from '@interfaces/gateways/PaymentGateway.gateway';
import { CounterService } from '@application/services/CounterService';
import { CreateOrderDTO } from '@application/dto/order/CreateOrder.dto';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class CreateOrderUseCase {
  private counterService: CounterService;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly counterRepository: CounterRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {
    this.counterService = new CounterService(counterRepository);
  }

  async execute(dto: CreateOrderDTO): Promise<Order> {
    const { customerId, products } = dto;

    if (customerId) {
      const customerExists = await this.customerRepository.findById(customerId);
      if (!customerExists) {
        throw new NotFoundError(`Customer with id ${customerId} not found`);
      }
    }

    let total = 0;
    for (const product of products) {
      const productDetails = await this.productRepository.findById(product.id);
      if (!productDetails) {
        throw new NotFoundError(`Product with id ${product.id} not found`);
      }
      total += productDetails.price * product.quantity;
    }

    const orderNumber = await this.counterService.getNextSequenceNumber('orderNumber');

    const paymentId = await this.paymentGateway.createPayment(total, orderNumber);

    const order = Order.create({
      customerId,
      products,
      total,
      orderNumber,
      status: 'received',
      paymentStatus: 'pending',
      paymentId,
    });

    return this.orderRepository.save(order);
  }
}
