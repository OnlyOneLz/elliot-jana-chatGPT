import { test } from "./test-helpers.js";
import { equal } from "./test-helpers.js";
import apiFetch from "../src/apiFetch.js";

// we want to check that we get status 200
test("it returns status 200", async () => {
  const res = await apiFetch([{
    role: "user",
    content: "hello"
  }])
  equal(res.response.status, 200)
})

test("it catches errors", async () => {
  const res = await apiFetch(["invalid input"])
  equal(res, undefined)
})
