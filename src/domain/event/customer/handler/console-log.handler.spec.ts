import EventDispatcher from "../../@shared/event-dispatcher";
import EnviaConsoleLogHandler from "./console-log.handler";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import Address from "../../../entity/address";
import Customer from "../../../entity/customer";

describe("EnviaConsoleLogHandler tests", () => {
  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const address = new Address("Street 1", 1, "1", "City 1");
    const customer = new Customer("1", "Customer 1");
    customer.changeAddress(address);

    const customerAddressChanged = new CustomerAddressChangedEvent(customer);

    eventDispatcher.notify(customerAddressChanged);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
