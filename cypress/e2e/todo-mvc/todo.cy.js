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

  // This test took a couple of hours to write 😖 but got there in the end 💪
  it("Edit an existing todo should persist", () => {
    cy.get(".header > input").type("Buy milk, eggs & sugar{enter}");
    cy.get("label").should("contain", "Buy milk, eggs & sugar");
    cy.get("label").should("have.length", 1);
    cy.get("label").dblclick();
    // element get detached from the DOM at this point so continuing the command chain fails
    // The field with a <label> task gets re rendered and becomes an <input> again
    cy.get(".editing > input").type(" & cheese{enter}");
    // Same thing happens here the element is re rendered as a <label>
    cy.get("label").should("contain", "Buy milk, eggs & sugar & cheese");
  });

  it("Completing a task displays as strikethrough", () => {
    const task1 = "Todo test one";
    const task2 = "Todo test two";
    cy.get(".header > input")
      .type(task1 + "{enter}")
      .type(task2 + "{enter}");
    cy.get("label").should("have.length", 2);
    // don't need `footer` but is useful as an indicator to know where it is
    cy.get("footer > span.todo-count").should("contain", "2");
    // check the second todo using find
    cy.get(".todo-list > li").eq(1).find("input.toggle").click();
    // assertions
    cy.get(".todo-list > li.completed").should("exist");
    cy.get("footer > span.todo-count").should("contain", "1");
    // these are the same 1st is neater
    cy.get(".todo-list > li.completed").find("label").should("contain", task1);
    cy.get(".todo-list > li.completed label").should("contain", task1);
    // Finding the CSS property
    cy.get(".todo-list > li.completed label")
      .invoke("css", "text-decoration")
      .should("contain", "line-through");
  });

  // should I do a separate variation to test the `all` filter?
  // probably yes even if that is implied in the test above and this one...
  // you could argue that I could test all filters in the one it() block
  // However I subcribe to the method that each test should check one area of functionality
  it("The 'All' filter shows active and completed todos", () => {
    const task1 = "Todo test one";
    const task2 = "Todo test two";
    const task3 = "Todo test three";
    const task4 = "Todo test four";

    cy.get(".header > input")
      .type(task1 + "{enter}")
      .type(task2 + "{enter}")
      .type(task3 + "{enter}")
      .type(task4 + "{enter}");
    // All filter is selected
    cy.get("a.selected").should("contain", "All");

    cy.get("footer > span.todo-count").should("contain", "4");
    cy.get(".todo-list > li").eq(2).find("input.toggle").click();
    cy.get(".todo-list > li").eq(3).find("input.toggle").click();
    // Active todos is 2
    cy.get("footer > span.todo-count").should("contain", "2");
    // Number of entries & variations
    cy.get("label").should("have.length", 4);
    cy.get(".view").should("have.length", 4);
    // extra verbose selector is the same as above!
    cy.get("ul.todo-list > li > div.view").should("have.length", 4);
  });

  it.only("The 'Active' filter shows only active todos", () => {
    const task1 = "Todo test one";
    const task2 = "Todo test two";
    const task3 = "Todo test three";
    const task4 = "Todo test four";

    cy.get(".header > input")
      .type(task1 + "{enter}")
      .type(task2 + "{enter}")
      .type(task3 + "{enter}")
      .type(task4 + "{enter}");
    cy.get("footer > span.todo-count").should("contain", "4");
    cy.get(".todo-list > li").eq(1).find("input.toggle").click();
    cy.get(".todo-list > li").eq(2).find("input.toggle").click();
    cy.get(".todo-list > li").eq(3).find("input.toggle").click();

    cy.get(".filters > li").eq(1).click();
    cy.get("a.selected").should("contain", "Active");
    cy.get("footer > span.todo-count").should("contain", "1");
    cy.get("label").should("have.length", 1).and("contain", task4);
  });

  it("completed filter shows only completed todos");

  it("Number of active tasks displays correctly");

  // create tasks that show on all 3 filters and delete them
  it("Deleting tasks removes tasks from all lists");

  // check through the advanced examples and use variations of ALL of them if possible
});
