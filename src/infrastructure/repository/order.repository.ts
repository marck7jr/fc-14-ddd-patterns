import Order from "../../domain/entity/order";
import OrderRepositoryInterface from "../../domain/repository/order-repository";
import OrderItemModel from "../db/sequelize/model/order-item.model copy";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  find(id: string): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  
  findAll(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
  
  update(entity: Order): Promise<void> {
    throw new Error("Method not implemented.");
  }  
}
