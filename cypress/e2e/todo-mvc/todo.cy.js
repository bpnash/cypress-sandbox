describe("example to-do app", () => {
  beforeEach(() => {
    cy.visit("http://todomvc-app-for-testing.surge.sh/");
  });

  it("Page heading by class & tag is todos", () => {
    cy.get(".header > h1").should("contain", "todos");
  });

  it("Page heading by tag is todos", () => {
    cy.get("h1").should("contain", "todos");
  });

  it("Input should contain placeholder text", () => {
    cy.get(".header > input")
      .invoke("attr", "placeholder")
      .should("contain", "What needs to be done?");
  });

  // Remove hard coded values
  it("Entering a todo entry updates the value attribute", () => {
    cy.get(".header > input")
      .type("Buy milk, eggs & sugar")
      .invoke("attr", "value")
      .should("contain", "Buy milk, eggs & sugar");
  });

  it("Entering a todo entry should persist", () => {
    cy.get(".header > input").type("Buy milk, eggs & sugar{enter}");
    cy.get("label").should("contain", "Buy milk, eggs & sugar");
  });

  it("Entering multiple todo entries should persist", () => {
    cy.get(".header > input").type("Buy milk, eggs & sugar{enter}");
    cy.get(".header > input").type("Collect dry cleaning{enter}");
    cy.get("label").should("have.length", 2);
    cy.get("label").eq(0).should("contain", "Collect dry cleaning");
    cy.get("label").eq(1).should("contain", "Buy milk, eggs & sugar");
  });

  it("Edit an existing todo should persist");

  it("Completing a task displays as strikethrough");

  it("Active tasks shows only active todos");

  it("completed tasks shows only completed todos");

  it("Number of active tasks displays correctly");

  // create tasks that show on all 3 filters and delete them
  it("Deleting tasks removes tasks from all lists");

  // check through the advanced examples and use variations of ALL of them if possible
});
