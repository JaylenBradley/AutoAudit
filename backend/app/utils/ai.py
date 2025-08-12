import os
import openai
from dotenv import load_dotenv
from app.core import categorize_expense_prompt

load_dotenv()

openai.api_key = os.getenv("OPENAPI_KEY")


def categorize_expense(expense_data):
    """
    Use OpenAI to categorize an expense as either 'general' or 'travel'.
    """
    prompt = categorize_expense_prompt(expense_data)

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expense categorization assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=10,
            temperature=0.1
        )

        category = response.choices[0].message.content.strip().lower()

        # Ensure we only return valid categories
        if category not in ["general", "travel"]:
            return "general"  # Default to general if categorization fails

        return category
    except Exception as e:
        print(f"Error categorizing expense: {e}")
        return "general"  # Default to general on error