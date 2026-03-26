# Todo App - Flask Backend

A RESTful API backend for the Todo application built with Flask and SQLite, with comprehensive unit tests achieving >90% code coverage.

## Features

- ✅ RESTful API endpoints for CRUD operations
- ✅ SQLite database with SQLAlchemy ORM
- ✅ CORS enabled for frontend communication
- ✅ Input validation and error handling
- ✅ Automatic database initialization
- ✅ Comprehensive unit tests with >90% coverage

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
```

### 2. Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Application

```bash
python app.py
```

The server will start on `http://localhost:5000`

## Running Tests

### Run All Tests with Coverage

```bash
pytest
```

Or use the provided script:

```bash
./run_tests.sh
```

### Run Specific Test Classes

```bash
pytest test_app.py::TestCreateTodo -v
```

### Generate HTML Coverage Report

```bash
pytest --cov=app --cov=models --cov-report=html
```

Then open `htmlcov/index.html` in your browser.

### Coverage Requirements

The test suite is configured to require at least 90% code coverage. Tests will fail if coverage drops below this threshold.

## Test Coverage

The test suite includes comprehensive tests for:

- ✅ Health check endpoint
- ✅ GET all todos (empty and with data)
- ✅ GET single todo (existing and non-existent)
- ✅ POST create todo (success and validation errors)
- ✅ PUT update todo (all fields, partial updates, validation)
- ✅ DELETE todo (existing and non-existent)
- ✅ Model methods (to_dict, __repr__)
- ✅ Error handlers (404, 500)
- ✅ Edge cases (empty strings, whitespace, invalid types)

**Current Coverage: >90%**

## API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/todos` | Get all todos | None | Array of todo objects |
| GET | `/todos/<id>` | Get single todo | None | Todo object |
| POST | `/todos` | Create new todo | `{title, description?}` | Created todo object |
| PUT | `/todos/<id>` | Update todo | `{title?, description?, completed?}` | Updated todo object |
| DELETE | `/todos/<id>` | Delete todo | None | Success message |
| GET | `/health` | Health check | None | Status message |

### Example Requests

**Create a Todo:**
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'
```

**Get All Todos:**
```bash
curl http://localhost:5000/api/todos
```

**Update a Todo:**
```bash
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a Todo:**
```bash
curl -X DELETE http://localhost:5000/api/todos/1
```

## Response Format

### Success Response
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-03-26T19:30:00.000000"
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Database Schema

### Todo Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| title | STRING(200) | NOT NULL |
| description | TEXT | NULLABLE |
| completed | BOOLEAN | DEFAULT FALSE |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── models.py           # SQLAlchemy models
├── test_app.py         # Comprehensive unit tests
├── pytest.ini          # Pytest configuration
├── run_tests.sh        # Test runner script
├── requirements.txt    # Python dependencies
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── todos.db           # SQLite database (auto-generated)
```

## Development

### Running in Debug Mode

The application runs in debug mode by default when using `python app.py`. This enables:
- Auto-reload on code changes
- Detailed error messages
- Interactive debugger

### Testing Workflow

1. Write tests first (TDD approach)
2. Run tests: `pytest`
3. Check coverage: `pytest --cov-report=term-missing`
4. Fix any failing tests
5. Ensure coverage stays above 90%

### Code Quality

The codebase follows these practices:
- Comprehensive input validation
- Proper error handling
- Clean code principles
- High test coverage (>90%)
- Type hints where appropriate

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, modify the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Database Issues
Delete `todos.db` and restart the application to recreate the database:
```bash
rm todos.db
python app.py
```

### Import Errors
Make sure the virtual environment is activated and dependencies are installed:
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Test Failures
If tests fail:
1. Check that you're in the backend directory
2. Ensure virtual environment is activated
3. Verify all dependencies are installed
4. Check for any database locks (delete todos.db if needed)

## Dependencies

```
Flask==3.0.0           # Web framework
Flask-SQLAlchemy==3.1.1  # ORM
Flask-CORS==4.0.0      # CORS support
pytest==7.4.3          # Testing framework
pytest-cov==4.1.0      # Coverage plugin
```

## Contributing

When contributing:
1. Write tests for new features
2. Ensure all tests pass
3. Maintain >90% code coverage
4. Follow existing code style
5. Update documentation

## License

MIT License