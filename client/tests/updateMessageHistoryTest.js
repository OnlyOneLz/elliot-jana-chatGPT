import updateMessageHistory from "../src/updateMessageHistory.js";
import { test, equal } from "./test-helpers.js";

// check that we can add data
test("it adds data in the correct object format", () => {
  updateMessageHistory("test", "user", [])

  const updated = JSON.parse(localStorage.getItem("history"))[0]
  console.log(updated)
  equal(updated.role, "user")
  equal(updated.content, "test")
})
