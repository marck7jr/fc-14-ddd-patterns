import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
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
    // Arrange
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "1", "City 1");
    customer.changeAddress(address);

    const product = new Product("1", "Product 1", 10);

    const orderItem1 = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      10
    );

    const order = new Order("1", "1", [orderItem1]);

    // Act
    await customerRepository.create(customer);
    await productRepository.create(product);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {
        id: order.id,
      },
      include: ["items"],
    });

    // Assert
    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      items: [
        {
          id: "1",
          name: "Product 1",
          order_id: "1",
          price: 10,
          product_id: "1",
          quantity: 10,
        },
      ],
      total: 100,
    });
  });

  it("should update a order", async () => {
    // Arrange
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const address1 = new Address("Street 1", 1, "1", "City 1");
    const customer1 = new Customer("1", "Customer 1");
    customer1.changeAddress(address1);

    const product1 = new Product("1", "Product 1", 10);
    const product2 = new Product("2", "Product 2", 20);

    const orderItem1 = new OrderItem("1", "Product 1", 10, "1", 10);
    const orderItem2 = new OrderItem("2", "Product 2", 20, "2", 20);

    const order1 = new Order("1", "1", [orderItem1]);
    const updateOrderItem1 = new OrderItem("1", "Product 1", 10, "1", 100);
    const updatedOrder1 = new Order("1", "1", [updateOrderItem1, orderItem2]);

    // Act
    await customerRepository.create(customer1);

    await productRepository.create(product1);
    await productRepository.create(product2);

    await orderRepository.create(order1);
    await orderRepository.update(updatedOrder1);

    const orderModel = await OrderModel.findOne({
      where: { id: "1" },
      include: ["items"],
    });

    // Assert
    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      items: [
        {
          id: "1",
          name: "Product 1",
          order_id: "1",
          price: 10,
          product_id: "1",
          quantity: 100,
        },
        {
          id: "2",
          name: "Product 2",
          order_id: "1",
          price: 20,
          product_id: "2",
          quantity: 20,
        },
      ],
      total: 1400
    });
  });

  it("should find a order", async () => {
    // Arrange
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer1 = new Customer("1", "Customer 1");
    const address1 = new Address("Street 1", 1, "1", "City 1");
    customer1.changeAddress(address1);

    const product1 = new Product("1", "Product 1", 10);

    const orderItem1 = new OrderItem("1", "Product 1", 10, "1", 10);
    const order1 = new Order("1", "1", [orderItem1]);

    // Act
    await customerRepository.create(customer1);
    await productRepository.create(product1);
    await orderRepository.create(order1);

    const foundOrder = await orderRepository.find("1");

    // Assert
    expect(foundOrder).toStrictEqual(order1);
  });

  it("should find all orders", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const productRepository = new ProductRepository();
        const orderRepository = new OrderRepository();
    
        const customer1 = new Customer("1", "Customer 1");
        const address1 = new Address("Street 1", 1, "1", "City 1");
        customer1.changeAddress(address1);
    
        const product1 = new Product("1", "Product 1", 10);
        const product2 = new Product("2", "Product 2", 20);
    
        const orderItem1 = new OrderItem(
          "1",
          product1.name,
          product1.price,
          product1.id,
          10
        );

        const orderItem2 = new OrderItem(
          "2",
          product2.name,
          product2.price,
          product2.id,
          20
        );
    
        const order1 = new Order("1", "1", [orderItem1]);
        const order2 = new Order("2", "1", [orderItem2]);
    
        const orders = [order1, order2];
        
        // Act
        await customerRepository.create(customer1);
        await productRepository.create(product1);
        await productRepository.create(product2);
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const foundOrders = await orderRepository.findAll();

        // Assert
        expect(foundOrders).toStrictEqual(orders);
  });
});
