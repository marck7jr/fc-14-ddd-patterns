describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispacther();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventHandler.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
  });
});
