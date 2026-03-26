/*
 * ============================================================================
 * TODO APP - FRONTEND JAVASCRIPT
 * ============================================================================
 * 
 * This file contains all the JavaScript logic for the Todo application.
 * It handles API communication, DOM manipulation, and user interactions.
 * 
 * LEARNING OBJECTIVES:
 * - Understanding async/await for handling asynchronous operations
 * - Making HTTP requests with the Fetch API
 * - Error handling in JavaScript
 * - DOM manipulation and event handling
 * - State management in vanilla JavaScript
 * 
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * API_BASE_URL: The base URL for our backend API
 * 
 * This constant stores the address where our Flask backend is running.
 * All API requests will be made to endpoints starting with this URL.
 * 
 * Example: To get all todos, we'll call: http://localhost:5001/api/todos
 */
const API_BASE_URL = 'http://localhost:5001/api';

// ============================================================================
// DOM ELEMENT REFERENCES
// ============================================================================

/**
 * DOM Elements: References to HTML elements we'll interact with
 * 
 * We store references to DOM elements in variables so we can:
 * 1. Access them quickly without searching the DOM repeatedly
 * 2. Make our code more readable and maintainable
 * 3. Avoid typos when accessing elements multiple times
 * 
 * document.getElementById() finds an element by its 'id' attribute
 */
const todoForm = document.getElementById('todo-form');
const todoTitleInput = document.getElementById('todo-title');
const todoDescriptionInput = document.getElementById('todo-description');
const todoList = document.getElementById('todo-list');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const emptyState = document.getElementById('empty-state');
const totalCount = document.getElementById('total-count');
const activeCount = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');

// ============================================================================
// APPLICATION STATE
// ============================================================================

/**
 * Application State: Data that represents the current state of our app
 * 
 * 'todos' is an array that holds all our todo items. This is our "single
 * source of truth" - whenever we need to know what todos exist, we check
 * this array. When we update this array, we re-render the UI to match.
 * 
 * This pattern is called "state management" and is fundamental to modern
 * web applications.
 */
let todos = [];

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * DOMContentLoaded Event: Wait for the page to fully load
 * 
 * This event fires when the HTML document has been completely loaded and
 * parsed. We wait for this event to ensure all DOM elements exist before
 * we try to interact with them.
 * 
 * Think of it like waiting for a stage to be set up before the actors
 * (our JavaScript code) start performing.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Load todos from the backend when the page first loads
    loadTodos();
    
    // Set up event listeners for user interactions
    setupEventListeners();
});

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================

/**
 * setupEventListeners: Attach event handlers to DOM elements
 * 
 * Event listeners "listen" for user actions (like clicks or form submissions)
 * and run code in response. This function sets up all our event listeners
 * in one place for better organization.
 */
function setupEventListeners() {
    // Listen for form submission (when user presses Enter or clicks Add button)
    // 'submit' event is better than 'click' because it handles both Enter key and button click
    todoForm.addEventListener('submit', handleAddTodo);
}

// ============================================================================
// API COMMUNICATION FUNCTIONS
// ============================================================================

/**
 * apiRequest: A reusable function for making API calls
 * 
 * WHY USE ASYNC/AWAIT?
 * --------------------
 * API calls take time - we're sending data over the network to a server
 * and waiting for a response. JavaScript is single-threaded, meaning it
 * can only do one thing at a time. If we waited synchronously for API
 * responses, our entire app would freeze!
 * 
 * async/await lets us write asynchronous code that looks synchronous:
 * - 'async' marks a function as asynchronous (returns a Promise)
 * - 'await' pauses execution until a Promise resolves
 * - While waiting, JavaScript can do other things (like responding to clicks)
 * 
 * HOW FETCH API WORKS:
 * --------------------
 * fetch() is the modern way to make HTTP requests in JavaScript.
 * It returns a Promise that resolves to a Response object.
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/todos')
 * @param {object} options - Configuration for the request (method, headers, body)
 * @returns {Promise} - Resolves to the parsed JSON response
 */
async function apiRequest(endpoint, options = {}) {
    try {
        // TRY BLOCK: Code that might fail goes here
        // If an error occurs, execution jumps to the catch block
        
        // Make the HTTP request
        // await pauses here until the server responds
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                // Tell the server we're sending JSON data
                'Content-Type': 'application/json',
                // Spread operator (...) merges any additional headers from options
                ...options.headers,
            },
            // Spread operator merges all other options (method, body, etc.)
            ...options,
        });

        // Check if the request was successful
        // response.ok is true for status codes 200-299
        if (!response.ok) {
            // If not successful, parse the error message from the server
            const error = await response.json();
            // Throw an error to jump to the catch block
            throw new Error(error.error || 'Something went wrong');
        }

        // Parse and return the JSON response
        // await pauses here until the JSON is parsed
        return await response.json();
        
    } catch (error) {
        // CATCH BLOCK: Handles any errors that occurred in the try block
        // This includes network errors, parsing errors, and thrown errors
        
        // Log the error to the console for debugging
        console.error('API Error:', error);
        
        // Re-throw the error so the calling function can handle it
        // This is important for error propagation
        throw error;
    }
}

/**
 * loadTodos: Fetch all todos from the backend
 * 
 * This function demonstrates the complete flow of an API call:
 * 1. Show loading state (user feedback)
 * 2. Make the API request
 * 3. Update local state with the response
 * 4. Update the UI
 * 5. Handle any errors that occur
 * 
 * ERROR HANDLING STRATEGY:
 * We use try/catch to gracefully handle errors. If the API call fails,
 * we don't want the app to crash - instead, we show a friendly error
 * message to the user.
 */
async function loadTodos() {
    try {
        // Show loading spinner to give user feedback
        showLoading();
        hideError();
        
        // Make GET request to /api/todos
        // await pauses execution until we get the response
        const data = await apiRequest('/todos');
        
        // Update our local state with the fetched todos
        todos = data;
        
        // Hide loading spinner
        hideLoading();
        
        // Update the UI to show the todos
        renderTodos();
        
        // Update the statistics (total, active, completed counts)
        updateStats();
        
    } catch (error) {
        // If anything goes wrong, hide loading and show error message
        hideLoading();
        showError(`Failed to load todos: ${error.message}`);
    }
}

/**
 * createTodo: Create a new todo on the backend
 * 
 * This function demonstrates a POST request with a request body.
 * We send data to the server in JSON format.
 * 
 * @param {string} title - The todo title
 * @param {string} description - The todo description (optional)
 * @returns {Promise<object>} - The created todo object
 */
async function createTodo(title, description) {
    try {
        // Make POST request with todo data in the body
        const newTodo = await apiRequest('/todos', {
            method: 'POST',
            // JSON.stringify converts JavaScript object to JSON string
            body: JSON.stringify({ title, description }),
        });
        
        // Add the new todo to the beginning of our local array
        // unshift() adds to the start, so new todos appear at the top
        todos.unshift(newTodo);
        
        // Update the UI to show the new todo
        renderTodos();
        updateStats();
        
        return newTodo;
        
    } catch (error) {
        // Show error message to user
        showError(`Failed to create todo: ${error.message}`);
        // Re-throw so the calling function knows it failed
        throw error;
    }
}

/**
 * updateTodo: Update an existing todo on the backend
 * 
 * This function demonstrates a PUT request for updating resources.
 * We only send the fields that need to be updated.
 * 
 * @param {number} id - The todo ID
 * @param {object} updates - Object containing fields to update
 * @returns {Promise<object>} - The updated todo object
 */
async function updateTodo(id, updates) {
    try {
        // Make PUT request to /api/todos/:id
        const updatedTodo = await apiRequest(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        
        // Find the todo in our local array and update it
        // findIndex returns the index of the first matching element
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            // Replace the old todo with the updated one
            todos[index] = updatedTodo;
        }
        
        // Update the UI
        renderTodos();
        updateStats();
        
        return updatedTodo;
        
    } catch (error) {
        showError(`Failed to update todo: ${error.message}`);
        throw error;
    }
}

/**
 * deleteTodo: Delete a todo from the backend
 * 
 * This function demonstrates a DELETE request.
 * After successful deletion, we remove the todo from our local state.
 * 
 * @param {number} id - The todo ID to delete
 */
async function deleteTodo(id) {
    try {
        // Make DELETE request to /api/todos/:id
        await apiRequest(`/todos/${id}`, {
            method: 'DELETE',
        });
        
        // Remove the todo from our local array
        // filter() creates a new array with all todos except the deleted one
        todos = todos.filter(todo => todo.id !== id);
        
        // Update the UI
        renderTodos();
        updateStats();
        
    } catch (error) {
        showError(`Failed to delete todo: ${error.message}`);
        throw error;
    }
}

// ============================================================================
// EVENT HANDLER FUNCTIONS
// ============================================================================

/**
 * handleAddTodo: Handle form submission to add a new todo
 * 
 * This function demonstrates form handling best practices:
 * 1. Prevent default form submission (which would reload the page)
 * 2. Validate user input
 * 3. Make API call
 * 4. Clear form on success
 * 5. Handle errors gracefully
 * 
 * @param {Event} e - The form submit event
 */
async function handleAddTodo(e) {
    // Prevent the default form submission behavior (page reload)
    e.preventDefault();
    
    // Get and trim the input values
    // trim() removes whitespace from both ends
    const title = todoTitleInput.value.trim();
    const description = todoDescriptionInput.value.trim();
    
    // Validate: title is required
    if (!title) {
        showError('Please enter a todo title');
        return; // Exit early if validation fails
    }
    
    try {
        // Create the todo (this is an async operation)
        await createTodo(title, description);
        
        // Clear the form inputs on success
        todoTitleInput.value = '';
        todoDescriptionInput.value = '';
        
        // Focus back on the title input for quick entry of next todo
        todoTitleInput.focus();
        
        // Hide any previous error messages
        hideError();
        
    } catch (error) {
        // Error is already handled in createTodo, but we catch it here
        // to prevent it from propagating further
    }
}

/**
 * handleToggleComplete: Toggle a todo's completed status
 * 
 * This function demonstrates updating a single field of a resource.
 * We flip the boolean value and send it to the backend.
 * 
 * @param {number} id - The todo ID
 * @param {boolean} currentStatus - The current completed status
 */
async function handleToggleComplete(id, currentStatus) {
    try {
        // Update with the opposite of the current status
        // !currentStatus flips true to false and vice versa
        await updateTodo(id, { completed: !currentStatus });
        hideError();
    } catch (error) {
        // Error already handled in updateTodo
    }
}

/**
 * handleDeleteTodo: Handle todo deletion with confirmation
 * 
 * This function demonstrates user confirmation before destructive actions.
 * Always confirm before deleting data!
 * 
 * @param {number} id - The todo ID to delete
 */
async function handleDeleteTodo(id) {
    // Show confirmation dialog
    // confirm() returns true if user clicks OK, false if Cancel
    if (confirm('Are you sure you want to delete this todo?')) {
        try {
            await deleteTodo(id);
            hideError();
        } catch (error) {
            // Error already handled in deleteTodo
        }
    }
}

// ============================================================================
// UI RENDERING FUNCTIONS
// ============================================================================

/**
 * renderTodos: Render all todos to the DOM
 * 
 * This function demonstrates the "render" pattern:
 * 1. Clear existing content
 * 2. Check for empty state
 * 3. Create and append new elements
 * 
 * This approach ensures the UI always matches our state.
 */
function renderTodos() {
    // Clear the list (remove all existing todo elements)
    todoList.innerHTML = '';
    
    // Show empty state if no todos exist
    if (todos.length === 0) {
        emptyState.style.display = 'block';
        return; // Exit early
    }
    
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Create and append a DOM element for each todo
    // forEach() iterates over each item in the array
    todos.forEach(todo => {
        const todoItem = createTodoElement(todo);
        todoList.appendChild(todoItem);
    });
}

/**
 * createTodoElement: Create a DOM element for a single todo
 * 
 * This function demonstrates DOM manipulation:
 * - Creating elements with createElement()
 * - Setting properties and classes
 * - Adding event listeners
 * - Building a tree structure
 * 
 * @param {object} todo - The todo object
 * @returns {HTMLElement} - The created list item element
 */
function createTodoElement(todo) {
    // Create the main list item
    const li = document.createElement('li');
    // Set CSS classes (template literal allows conditional class)
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    // Store the todo ID as a data attribute for reference
    li.dataset.id = todo.id;
    
    // CREATE CHECKBOX
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    // Arrow function creates a closure that captures todo.id and todo.completed
    checkbox.addEventListener('change', () => handleToggleComplete(todo.id, todo.completed));
    
    // CREATE CONTENT SECTION
    const content = document.createElement('div');
    content.className = 'todo-content';
    
    // Title
    const title = document.createElement('div');
    title.className = 'todo-title';
    title.textContent = todo.title; // textContent is safe from XSS attacks
    content.appendChild(title);
    
    // Description (only if it exists)
    if (todo.description) {
        const description = document.createElement('div');
        description.className = 'todo-description';
        description.textContent = todo.description;
        content.appendChild(description);
    }
    
    // Date
    const date = document.createElement('div');
    date.className = 'todo-date';
    date.textContent = formatDate(todo.created_at);
    content.appendChild(date);
    
    // CREATE ACTION BUTTONS
    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    
    // Complete/Undo button (text changes based on status)
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn btn-success';
    completeBtn.textContent = todo.completed ? '↩️ Undo' : '✓ Complete';
    completeBtn.addEventListener('click', () => handleToggleComplete(todo.id, todo.completed));
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.addEventListener('click', () => handleDeleteTodo(todo.id));
    
    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);
    
    // ASSEMBLE THE COMPLETE STRUCTURE
    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);
    
    return li;
}

/**
 * updateStats: Update the statistics display
 * 
 * This function demonstrates array methods for data analysis:
 * - length: Get total count
 * - filter(): Get subset matching a condition
 * 
 * These statistics help users understand their todo list at a glance.
 */
function updateStats() {
    const total = todos.length;
    // filter() creates a new array with only completed todos
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    // Update the DOM with the calculated values
    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// ============================================================================
// UI HELPER FUNCTIONS
// ============================================================================

/**
 * showLoading: Display loading spinner
 * 
 * Loading states are important for user experience - they let users know
 * something is happening and prevent confusion during network requests.
 */
function showLoading() {
    loadingElement.style.display = 'block';
    todoList.style.display = 'none';
    emptyState.style.display = 'none';
}

/**
 * hideLoading: Hide loading spinner
 */
function hideLoading() {
    loadingElement.style.display = 'none';
    todoList.style.display = 'block';
}

/**
 * showError: Display an error message to the user
 * 
 * Good error handling means showing users friendly, actionable messages
 * instead of technical error codes or letting the app crash silently.
 * 
 * @param {string} message - The error message to display
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    // setTimeout() runs code after a delay (in milliseconds)
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * hideError: Hide the error message
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * formatDate: Convert a date string to a human-readable relative time
 * 
 * This function demonstrates date manipulation and conditional logic.
 * Instead of showing "2026-03-26T19:46:33", we show "5 minutes ago"
 * which is much more user-friendly.
 * 
 * @param {string} dateString - ISO date string from the backend
 * @returns {string} - Human-readable relative time
 */
function formatDate(dateString) {
    // Create Date objects for comparison
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate time difference in various units
    const diffMs = now - date; // Difference in milliseconds
    const diffMins = Math.floor(diffMs / 60000); // 60000 ms = 1 minute
    const diffHours = Math.floor(diffMs / 3600000); // 3600000 ms = 1 hour
    const diffDays = Math.floor(diffMs / 86400000); // 86400000 ms = 1 day
    
    // Return appropriate format based on how long ago
    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        // Template literal with conditional pluralization
        return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
        // For older dates, show the actual date
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

/**
 * Keyboard Shortcuts: Enhance user experience with keyboard navigation
 * 
 * Power users love keyboard shortcuts! This makes the app faster to use.
 */
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus on input
    // e.ctrlKey is true when Ctrl is pressed (Windows/Linux)
    // e.metaKey is true when Cmd is pressed (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault(); // Prevent browser's default Ctrl+K behavior
        todoTitleInput.focus();
    }
});

// ============================================================================
// AUTO-REFRESH
// ============================================================================

/**
 * Auto-refresh: Keep todos in sync with the backend
 * 
 * setInterval() runs a function repeatedly at a specified interval.
 * This ensures that if someone else adds/updates todos, we'll see them.
 * 
 * 30000 milliseconds = 30 seconds
 */
setInterval(() => {
    loadTodos();
}, 30000);

// ============================================================================
// INITIALIZATION LOGGING
// ============================================================================

/**
 * Console logs for debugging
 * 
 * These help developers verify the app initialized correctly.
 * In production, you might remove these or use a proper logging library.
 */
console.log('Todo App initialized! 🚀');
console.log('API Base URL:', API_BASE_URL);

// Made with Bob 🤖
