import { parse } from "date-fns";
import { isWithinThisWeek } from "./util";

describe("isWithinThisWeek", () => {

  it("should return false if publish date is future", () => {
    // arrange
    const dateString = "2020/8/28(金)公開";
    const today = parse("2020-01-01", "yyyy-MM-dd", new Date());

    // act
    const result = isWithinThisWeek(dateString, today);

    // assert
    expect(result).toBe(false);
  });

  it("should return true if publish date is within this week", () => {
    // arrange
    const dateString = "2020/8/28(金)公開";
    const today = parse("2020-08-23", "yyyy-MM-dd", new Date());

    // act
    const result = isWithinThisWeek(dateString, today);

    // assert
    expect(result).toBe(false);
  });

  it("should return false if publish date is past", () => {
    // arrange
    const dateString = "2020/8/28(金)公開";
    const today = parse("2020-08-31", "yyyy-MM-dd", new Date());

    // act
    const result = isWithinThisWeek(dateString, today);

    // assert
    expect(result).toBe(false);
  });

  it("should return true if publish date is today", () => {
    // arrange
    const dateString = "2020/8/28(金)公開";
    const today = parse("2020-08-28", "yyyy-MM-dd", new Date());

    // act
    const result = isWithinThisWeek(dateString, today);

    // assert
    expect(result).toBe(true);
  });

});