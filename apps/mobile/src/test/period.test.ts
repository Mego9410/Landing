/// <reference types="node" />
// Store periods and introductory prices in words, for the paywall. Run with `npm test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { introPhrase, period } from "@/data/period";

test("period: trials in days, longer periods as they are", () => {
  assert.equal(period("P1W"), "7 days");
  assert.equal(period("P1M"), "1 month");
  assert.equal(period("P3M"), "3 months");
  assert.equal(period("nope"), "");
});

test("period: a paid introductory price reads as a phrase", () => {
  assert.equal(introPhrase("£55.99", "P1Y", 1), "£55.99 for your first year");
  assert.equal(introPhrase("£10.39", "P1M", 3), "£10.39 a month for your first 3 months");
  assert.equal(introPhrase("£25.99", "P3M", 1), "£25.99 for your first 3 months");
  assert.equal(introPhrase("£1", "bad", 1), null);
});
