import Order from "../../domain/entity/order";
import OrderRepositoryInterface from "../../domain/repository/order-repository";
import OrderItemModel from "../db/sequelize/model/order-item.model";
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
          total: item.total,
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

  async update(entity: Order): Promise<void> {
    entity.items.forEach(async (orderItem) => {
      const orderItemModel = await OrderItemModel.findOne({
        where: {
          id: orderItem.id,
        },
      });

      if (orderItemModel == null) {
        await OrderItemModel.create({
          id: orderItem.id,
          name: orderItem.name,
          order_id: entity.id,
          total: orderItem.total,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
        });
      } else {
        await orderItemModel.update(
          {
            name: orderItem.name,
            total: orderItem.total,
            product_id: orderItem.productId,
            quantity: orderItem.quantity,
          }
        );
      }
    });

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }
}
