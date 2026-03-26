import pytest
import json
import os
from app import app, db, Todo

@pytest.fixture
def client():
    """Create a test client with a temporary database"""
    # Configure app for testing
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

@pytest.fixture
def sample_todo():
    """Sample todo data for testing"""
    return {
        'title': 'Test Todo',
        'description': 'This is a test todo',
        'completed': False
    }

class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self, client):
        """Test health check returns 200 and correct message"""
        response = client.get('/api/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert 'message' in data

class TestGetTodos:
    """Test GET /api/todos endpoint"""
    
    def test_get_empty_todos(self, client):
        """Test getting todos when database is empty"""
        response = client.get('/api/todos')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) == 0
    
    def test_get_todos_with_data(self, client, sample_todo):
        """Test getting todos when database has data"""
        # Create a todo first
        client.post('/api/todos', 
                   data=json.dumps(sample_todo),
                   content_type='application/json')
        
        # Get all todos
        response = client.get('/api/todos')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]['title'] == sample_todo['title']
    
    def test_get_multiple_todos(self, client):
        """Test getting multiple todos"""
        # Create multiple todos
        todos = [
            {'title': 'Todo 1', 'description': 'First todo'},
            {'title': 'Todo 2', 'description': 'Second todo'},
            {'title': 'Todo 3', 'description': 'Third todo'}
        ]
        
        for todo in todos:
            client.post('/api/todos',
                       data=json.dumps(todo),
                       content_type='application/json')
        
        # Get all todos
        response = client.get('/api/todos')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 3

class TestGetSingleTodo:
    """Test GET /api/todos/<id> endpoint"""
    
    def test_get_existing_todo(self, client, sample_todo):
        """Test getting a single existing todo"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Get the todo
        response = client.get(f'/api/todos/{created_todo["id"]}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['id'] == created_todo['id']
        assert data['title'] == sample_todo['title']
    
    def test_get_nonexistent_todo(self, client):
        """Test getting a todo that doesn't exist"""
        response = client.get('/api/todos/999')
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data
        assert data['error'] == 'Todo not found'

class TestCreateTodo:
    """Test POST /api/todos endpoint"""
    
    def test_create_todo_success(self, client, sample_todo):
        """Test successfully creating a todo"""
        response = client.post('/api/todos',
                              data=json.dumps(sample_todo),
                              content_type='application/json')
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'id' in data
        assert data['title'] == sample_todo['title']
        assert data['description'] == sample_todo['description']
        assert data['completed'] == sample_todo['completed']
        assert 'created_at' in data
    
    def test_create_todo_without_title(self, client):
        """Test creating a todo without title fails"""
        todo = {'description': 'No title'}
        response = client.post('/api/todos',
                              data=json.dumps(todo),
                              content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'Title is required' in data['error']
    
    def test_create_todo_with_empty_title(self, client):
        """Test creating a todo with empty title fails"""
        todo = {'title': '   ', 'description': 'Empty title'}
        response = client.post('/api/todos',
                              data=json.dumps(todo),
                              content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'Title cannot be empty' in data['error']
    
    def test_create_todo_without_description(self, client):
        """Test creating a todo without description succeeds"""
        todo = {'title': 'No description'}
        response = client.post('/api/todos',
                              data=json.dumps(todo),
                              content_type='application/json')
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['title'] == 'No description'
        assert data['description'] is None
    
    def test_create_todo_with_completed_status(self, client):
        """Test creating a todo with completed status"""
        todo = {'title': 'Already done', 'completed': True}
        response = client.post('/api/todos',
                              data=json.dumps(todo),
                              content_type='application/json')
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['completed'] is True
    
    def test_create_todo_no_data(self, client):
        """Test creating a todo with no data fails"""
        response = client.post('/api/todos',
                              data=json.dumps({}),
                              content_type='application/json')
        assert response.status_code == 400
    
    def test_create_todo_title_with_whitespace(self, client):
        """Test creating a todo with whitespace in title"""
        todo = {'title': '  Test Todo  ', 'description': '  Test Description  '}
        response = client.post('/api/todos',
                              data=json.dumps(todo),
                              content_type='application/json')
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['title'] == 'Test Todo'
        assert data['description'] == 'Test Description'

class TestUpdateTodo:
    """Test PUT /api/todos/<id> endpoint"""
    
    def test_update_todo_title(self, client, sample_todo):
        """Test updating todo title"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Update the title
        update_data = {'title': 'Updated Title'}
        response = client.put(f'/api/todos/{created_todo["id"]}',
                             data=json.dumps(update_data),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['title'] == 'Updated Title'
        assert data['description'] == sample_todo['description']
    
    def test_update_todo_description(self, client, sample_todo):
        """Test updating todo description"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Update the description
        update_data = {'description': 'Updated Description'}
        response = client.put(f'/api/todos/{created_todo["id"]}',
                             data=json.dumps(update_data),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['description'] == 'Updated Description'
    
    def test_update_todo_completed(self, client, sample_todo):
        """Test updating todo completed status"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Update completed status
        update_data = {'completed': True}
        response = client.put(f'/api/todos/{created_todo["id"]}',
                             data=json.dumps(update_data),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['completed'] is True
    
    def test_update_todo_all_fields(self, client, sample_todo):
        """Test updating all todo fields"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Update all fields
        update_data = {
            'title': 'New Title',
            'description': 'New Description',
            'completed': True
        }
        response = client.put(f'/api/todos/{created_todo["id"]}',
                             data=json.dumps(update_data),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['title'] == 'New Title'
        assert data['description'] == 'New Description'
        assert data['completed'] is True
    
    def test_update_nonexistent_todo(self, client):
        """Test updating a todo that doesn't exist"""
        update_data = {'title': 'Updated'}
        response = client.put('/api/todos/999',
                             data=json.dumps(update_data),
                             content_type='application/json')
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_update_todo_empty_title(self, client, sample_todo):
        """Test updating todo with empty title fails"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Try to update with empty title
        update_data = {'title': '   '}
        response = client.put(f'/api/todos/{created_todo["id"]}',
                             data=json.dumps(update_data),
                             content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_update_todo_no_data(self, client, sample_todo):
        """Test updating todo with no data fails"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Try to update with no data
        response = client.put(f'/api/todos/{created_todo["id"]}',
                             data=json.dumps({}),
                             content_type='application/json')
        assert response.status_code == 400
    
    def test_update_todo_invalid_completed_type(self, client, sample_todo):
        """Test updating todo with invalid completed type"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Try to update with invalid completed value
        update_data = {'completed': 'not a boolean'}
        response = client.put(f'/api/todos/{created_todo["id"]}',
                             data=json.dumps(update_data),
                             content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data

class TestDeleteTodo:
    """Test DELETE /api/todos/<id> endpoint"""
    
    def test_delete_existing_todo(self, client, sample_todo):
        """Test deleting an existing todo"""
        # Create a todo
        create_response = client.post('/api/todos',
                                     data=json.dumps(sample_todo),
                                     content_type='application/json')
        created_todo = json.loads(create_response.data)
        
        # Delete the todo
        response = client.delete(f'/api/todos/{created_todo["id"]}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'message' in data
        
        # Verify it's deleted
        get_response = client.get(f'/api/todos/{created_todo["id"]}')
        assert get_response.status_code == 404
    
    def test_delete_nonexistent_todo(self, client):
        """Test deleting a todo that doesn't exist"""
        response = client.delete('/api/todos/999')
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data
        assert data['error'] == 'Todo not found'
    
    def test_delete_todo_verify_count(self, client):
        """Test that deleting a todo reduces the count"""
        # Create multiple todos
        for i in range(3):
            client.post('/api/todos',
                       data=json.dumps({'title': f'Todo {i}'}),
                       content_type='application/json')
        
        # Verify count
        response = client.get('/api/todos')
        data = json.loads(response.data)
        assert len(data) == 3
        
        # Delete one
        client.delete('/api/todos/1')
        
        # Verify new count
        response = client.get('/api/todos')
        data = json.loads(response.data)
        assert len(data) == 2

class TestTodoModel:
    """Test Todo model methods"""
    
    def test_todo_to_dict(self, client, sample_todo):
        """Test Todo.to_dict() method"""
        response = client.post('/api/todos',
                              data=json.dumps(sample_todo),
                              content_type='application/json')
        data = json.loads(response.data)
        
        # Verify all fields are present
        assert 'id' in data
        assert 'title' in data
        assert 'description' in data
        assert 'completed' in data
        assert 'created_at' in data
    
    def test_todo_repr(self, client):
        """Test Todo.__repr__() method"""
        with app.app_context():
            todo = Todo(title='Test', description='Test desc')
            db.session.add(todo)
            db.session.commit()
            
            repr_str = repr(todo)
            assert 'Todo' in repr_str
            assert str(todo.id) in repr_str
            assert 'Test' in repr_str

class TestErrorHandlers:
    """Test error handlers"""
    
    def test_404_error(self, client):
        """Test 404 error handler"""
        response = client.get('/api/nonexistent')
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data

if __name__ == '__main__':
    pytest.main([__file__, '-v', '--cov=app', '--cov-report=term-missing'])

# Made with Bob
