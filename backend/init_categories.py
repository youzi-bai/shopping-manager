import requests
import json

BASE_URL = "http://localhost:8000"

categories = [
    {"name": "食品", "emoji": "🍞", "sort_order": 0, "is_default": True},
    {"name": "服装", "emoji": "👕", "sort_order": 1, "is_default": True},
    {"name": "数码", "emoji": "📱", "sort_order": 2, "is_default": True},
    {"name": "日用", "emoji": "🏠", "sort_order": 3, "is_default": True},
    {"name": "美妆", "emoji": "💄", "sort_order": 4, "is_default": True},
    {"name": "娱乐", "emoji": "🎬", "sort_order": 5, "is_default": True},
    {"name": "交通", "emoji": "🚗", "sort_order": 6, "is_default": True},
    {"name": "教育", "emoji": "📚", "sort_order": 7, "is_default": True},
    {"name": "医疗", "emoji": "🏥", "sort_order": 8, "is_default": True},
    {"name": "其他", "emoji": "📦", "sort_order": 9, "is_default": True},
]

for cat in categories:
    r = requests.post(f"{BASE_URL}/categories/", json=cat)
    print(f"Created: {cat['name']} - {r.json().get('id', 'error')}")