test("have all the same properties", () => {
  const can1 = {
    flavor: "grapefruit",
    ounces: 12,
  };

  const can2 = {
    flavor: "grapefruit",
    ounces: 12,
  };

  expect(can1).toEqual(can2);
});
