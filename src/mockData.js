// Mock JSON data for policies and employees
export const policies = [
  {
    id: 1,
    version: "2023-01-01",
    title: "Expense Policy v1",
    content: "Allowed categories: Travel, Meals. Limit: $500 per trip.",
    changelog: "Initial version."
  },
  {
    id: 2,
    version: "2023-06-01",
    title: "Expense Policy v2",
    content: "Allowed categories: Travel, Meals, Office Supplies. Limit: $700 per trip.",
    changelog: "Added Office Supplies. Increased limit to $700."
  },
  {
    id: 3,
    version: "2024-01-01",
    title: "Expense Policy v3",
    content: "Allowed categories: Travel, Meals, Office Supplies, Training. Limit: $1000 per trip.",
    changelog: "Added Training. Increased limit to $1000."
  }
];

export const employees = [
  { id: 1, name: "Alice", acknowledged: [1] },
  { id: 2, name: "Bob", acknowledged: [1, 2] },
  { id: 3, name: "Charlie", acknowledged: [] }
];
