#!/bin/bash

# Run tests with coverage
echo "Running tests with coverage..."
pytest test_app.py -v --cov=app --cov=models --cov-report=term-missing --cov-report=html

# Check if tests passed
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo "📊 Coverage report generated in htmlcov/index.html"
else
    echo ""
    echo "❌ Some tests failed!"
    exit 1
fi

# Made with Bob
