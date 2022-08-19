import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
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

  async find(id: string): Promise<Order> {
    var orderModel = await OrderModel.findOne({
      where: {
        id,
      },
      include: ["items"],
    });

    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(
        (orderItemModel) =>
          new OrderItem(
            orderItemModel.id,
            orderItemModel.name,
            orderItemModel.price,
            orderItemModel.product_id,
            orderItemModel.quantity
          )
      )
    );
  }

  async findAll(): Promise<Order[]> {
    var orderModels = await OrderModel.findAll({
      include: ["items"],
    });

    return orderModels.map(
      (orderModel) =>
        new Order(
          orderModel.id,
          orderModel.customer_id,
          orderModel.items.map(
            (orderModelItem) =>
              new OrderItem(
                orderModelItem.id,
                orderModelItem.name,
                orderModelItem.price,
                orderModelItem.product_id,
                orderModelItem.quantity
              )
          )
        )
    );
  }

  async update(entity: Order): Promise<void> {
    const order = await OrderModel.findOne({
      where: {
        id: entity.id,
      },
      include: ["items"],
    });

    order.items.forEach(async (orderItem) => {
      // If exists only on database
      if (entity.items.find((x) => x.id == orderItem.id) == undefined) {
        // Then it should be removed
        await OrderItemModel.destroy({
          where: {
            id: orderItem.id,
          },
        });
      }
    });

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
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
        });
      } else {
        await orderItemModel.update({
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
        });
      }
    });

    await order.update({
      customer_id: entity.customerId,
      total: entity.total(),
    });
  }
}
