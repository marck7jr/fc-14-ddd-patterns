import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model copy";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import ProductRepository from "./product.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "1", "City 1");
    customer.changeAddress(address);

    const producRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);

    const orderItem1 = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      10
    );

    const orderRepository = new OrderRepository();
    const order = new Order("1", "1", [orderItem1]);

    await customerRepository.create(customer);
    await producRepository.create(product);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: "1"
        },
      ],
    });
  });
});
