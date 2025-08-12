def categorize_expense_prompt(expense_data):
    return f"""
    Categorize the following expense as either 'general' or 'travel':
    Merchant: {expense_data['merchant']}
    Amount: ${expense_data['amount']}
    Description: {expense_data['description']}

    Examples:
    - Flights, hotels, car rentals, restaurants during business trips are 'travel'
    - Office supplies, software subscriptions, utilities are 'general'

    Respond with only one word: either 'general' or 'travel'.
    """