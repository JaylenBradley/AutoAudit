def categorize_expense_prompt(expense_data):
    return f"""
    Categorize the following expense into one of these categories:
    - general: Miscellaneous business expenses that don't fit other categories
    - travel: General travel expenses not specifically food, lodging, or transportation
    - food: Meals, restaurants, catering, grocery purchases for business purposes
    - lodging: Hotels, accommodations, rentals for business stays
    - transportation: Flights, taxis, trains, car rentals, fuel for business travel
    - supplies: Office supplies, equipment, software, subscriptions
    - other: Any expense that doesn't clearly fit the above categories

    Expense details:
    Merchant: {expense_data['merchant']}
    Amount: ${expense_data['amount']}
    Description: {expense_data['description']}

    Examples:
    - "Uber from airport to hotel" → transportation
    - "Hilton Hotel 3 nights" → lodging
    - "Business dinner with clients" → food
    - "Office paper and pens" → supplies
    - "Conference registration fee" → general

    Respond with only one word from the available categories: general, travel, food, lodging, transportation, supplies, or other.
    """