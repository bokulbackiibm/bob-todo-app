# Bob Todo App

A full-stack todo application with a Python Flask backend and vanilla JavaScript frontend.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ RESTful API backend
- ✅ Responsive frontend interface
- ✅ SQLite database for data persistence
- ✅ Comprehensive test suite

## Project Structure

```
bob-todo-app/
├── backend/           # Flask API server
│   ├── app.py        # Main Flask application
│   ├── models.py     # Database models
│   ├── database.py   # Database initialization
│   ├── test_app.py   # API tests
│   └── requirements.txt
├── frontend/          # Vanilla JS frontend
│   ├── index.html    # Main HTML page
│   ├── app.js        # Frontend logic
│   └── styles.css    # Styling
└── README.md
```

## Backend Setup

### Prerequisites
- Python 3.7+
- pip

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python3 app.py
```

The API will be available at `http://localhost:5001`

### Running Tests

```bash
cd backend
./run_tests.sh
```

Or manually:
```bash
pytest test_app.py -v
```

## Frontend Setup

The frontend is built with vanilla JavaScript and requires no build process.

1. Open `frontend/index.html` in a web browser, or
2. Serve it with a simple HTTP server:

```bash
cd frontend
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

**Note:** Make sure the backend server is running on port 5001 for the frontend to work properly.

## API Endpoints

### Get All Todos
```
GET /api/todos
```

### Create Todo
```
POST /api/todos
Content-Type: application/json

{
  "title": "Todo title",
  "completed": false
}
```

### Update Todo
```
PUT /api/todos/<id>
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

### Delete Todo
```
DELETE /api/todos/<id>
```

## Technologies Used

### Backend
- **Flask** - Web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-CORS** - Cross-origin resource sharing
- **pytest** - Testing framework

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Logic and API interaction

## Development

### Backend Development
The backend uses Flask with SQLAlchemy for database operations. The database is automatically initialized on first run.

### Frontend Development
The frontend makes AJAX requests to the backend API. All state management is handled in `app.js`.

## License

MIT License

## Author

Created with Bob AI Assistant