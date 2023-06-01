// Version 1 - objective to write a spec file with a suite of working tests
// These tests will need to be refactored and possibly split into 2 describe blocks
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

  it("The 'Active' filter shows only active todos", () => {
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
    cy.get(".filters > li").eq(1).click();
    // Switch to active filter - shows 4 items
    cy.get("a.selected").should("contain", "Active");
    cy.get("label").should("have.length", 4);
    // Check off 3 items would normally be eq(1), eq(2), eq(3) but the checked items are disappearing
    // So selecting the second item in the remaining list each time
    cy.get(".todo-list > li").eq(1).find("input.toggle").click();
    cy.get(".todo-list > li").eq(1).find("input.toggle").click();
    cy.get(".todo-list > li").eq(1).find("input.toggle").click();
    // Todos reduce to 1 item and contains task 4
    cy.get("footer > span.todo-count").should("contain", "1");
    cy.get("label").should("have.length", 1).and("contain", task4);
  });

  it("completed filter shows only completed todos", () => {
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
    cy.get(".todo-list > li").eq(2).find("input.toggle").click();
    cy.get(".todo-list > li").eq(3).find("input.toggle").click();

    cy.get(".filters > li").eq(2).click();
    cy.get("a.selected").should("contain", "Completed");
    // Note this is remaining tasks
    cy.get("footer > span.todo-count").should("contain", "2");
    cy.get("label").should("have.length", 2).eq(0).should("contain", task2);
    cy.get("label").eq(1).should("contain", task1);

    // Unchecking a todo should remove from the completed list and add it back to remaining todos
    cy.get(".todo-list > li").eq(0).find("input.toggle").click();
    cy.get("footer > span.todo-count").should("contain", "3");
    cy.get("label").should("have.length", 1).should("contain", task1);
  });

  // This has been tested in previous tests but is not the main focus
  it("Number of active items displays correctly", () => {
    const task1 = "Todo test one";
    const task2 = "Todo test two";
    const task3 = "Todo test three";
    const task4 = "Todo test four";

    cy.get(".header > input")
      .type(task1 + "{enter}")
      .type(task2 + "{enter}")
      .type(task3 + "{enter}")
      .type(task4 + "{enter}");
    cy.get("footer > span.todo-count").should("contain", "4 items left");
    cy.get(".todo-list > li").eq(0).find("input.toggle").click();
    cy.get("footer > span.todo-count").should("contain", "3 items left");
    cy.get(".todo-list > li").eq(1).find("input.toggle").click();
    cy.get("footer > span.todo-count").should("contain", "2 items left");
    cy.get(".todo-list > li").eq(2).find("input.toggle").click();
    cy.get("footer > span.todo-count").should("contain", "1 item left");
    cy.get(".todo-list > li").eq(3).find("input.toggle").click();
    cy.get("footer > span.todo-count").should("contain", "No items left");
  });

  it("Selecting 'Clear completed' button removes all completed todos", () => {
    const task1 = "Todo test one";
    const task2 = "Todo test two";

    cy.get(".header > input")
      .type(task1 + "{enter}")
      .type(task2 + "{enter}");
    cy.get(".todo-list > li").eq(0).find("input.toggle").click();
    cy.get(".todo-list > li").eq(1).find("input.toggle").click();
    cy.get("label").should("have.length", 2);
    // cy.contains("button", "Clear completed").click();
    // cy.get(".clear-completed").click();
    // probably the best selector
    cy.contains("Clear completed").click();
    cy.get("label").should("not.exist");
  });

  //  *** NOT HAPPY WITH THIS TEST - MAY USE PLUGIN - cypress-real-events ***
  // create tasks both deleted and todo completed delete them
  it("Deleting todos removes todos from the list in all views", () => {
    const task1 = "Todo test one";
    const task2 = "Todo test two";

    // create 2 todos, one completed
    cy.get(".header > input")
      .type(task1 + "{enter}")
      .type(task2 + "{enter}");
    cy.get(".todo-list > li").eq(0).find("input.toggle").click();
    cy.get("label").should("have.length", 2);

    // Assert button is visible on hover
    // This only works for JavaScript events
    // cy.get(".todo-list > li").eq(0).trigger("mouseenter");
    // cy.get(".todo-list > li .destroy").should("be.visible");

    // Delete the top todo
    cy.get(".todo-list > li button").eq(0).invoke("show").click();
    cy.get("label").should("have.length", 1).and("contain", task1);
    // Delete remaining todo
    cy.get(".todo-list > li button").eq(0).invoke("show").click();
    cy.get("label").should("not.exist");
  });

  // check through the advanced examples and use variations of ALL of them if possible
});
