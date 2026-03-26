# Todo App - Frontend

A modern, responsive frontend for the Todo application built with vanilla JavaScript, HTML5, and CSS3.

## Features

- ✅ Clean, modern UI with gradient design
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Real-time statistics (total, active, completed)
- ✅ Add todos with title and optional description
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos with confirmation
- ✅ Auto-refresh every 30 seconds
- ✅ Keyboard shortcuts (Ctrl/Cmd + K to focus input)
- ✅ Relative timestamps (e.g., "5 minutes ago")
- ✅ Error handling with user-friendly messages
- ✅ Loading states and empty state
- ✅ Smooth animations and transitions

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running on `http://localhost:5001`

### Running the Frontend

#### Option 1: Open Directly in Browser

Simply open `index.html` in your web browser:

```bash
open frontend/index.html
```

Or double-click the `index.html` file.

#### Option 2: Using a Local Server (Recommended)

Using Python:
```bash
cd frontend
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Using Node.js (with http-server):
```bash
cd frontend
npx http-server -p 8000
```

Using VS Code Live Server:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## File Structure

```
frontend/
├── index.html      # Main HTML structure
├── styles.css      # Responsive CSS styling
├── app.js          # JavaScript for API interactions
└── README.md       # This file
```

## API Configuration

The frontend connects to the backend API at:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

If your backend is running on a different port, update this in `app.js`.

## Features in Detail

### Add Todo
- Enter a title (required)
- Optionally add a description
- Press Enter or click "Add Todo" button
- Todo appears at the top of the list

### Complete/Uncomplete Todo
- Click the checkbox next to a todo
- Or click the "✓ Complete" / "↩️ Undo" button
- Completed todos are visually distinguished

### Delete Todo
- Click the "🗑️ Delete" button
- Confirm the deletion in the dialog
- Todo is removed from the list

### Statistics
- **Total**: Total number of todos
- **Active**: Number of incomplete todos
- **Completed**: Number of completed todos

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Focus on the title input field

## Responsive Design

The app is fully responsive and works on:
- 📱 Mobile phones (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktops (1024px and up)

### Mobile Optimizations
- Stacked layout for better readability
- Full-width buttons
- Touch-friendly tap targets
- Optimized font sizes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... more colors */
}
```

### API Endpoint
Edit in `app.js`:
```javascript
const API_BASE_URL = 'http://your-api-url/api';
```

### Auto-refresh Interval
Edit in `app.js` (default: 30 seconds):
```javascript
setInterval(() => {
    loadTodos();
}, 30000); // Change to desired milliseconds
```

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Make sure the backend is running
2. Verify CORS is enabled in the Flask backend
3. Check that the API_BASE_URL is correct

### Todos Not Loading
1. Check browser console for errors
2. Verify backend is running on port 5001
3. Test API directly: `curl http://localhost:5001/api/todos`
4. Check network tab in browser DevTools

### Styling Issues
1. Clear browser cache (Ctrl/Cmd + Shift + R)
2. Check that `styles.css` is in the same directory as `index.html`
3. Verify no browser extensions are interfering

## Development

### Making Changes

1. Edit the files as needed
2. Refresh the browser to see changes
3. Use browser DevTools for debugging

### Console Logging

The app logs useful information to the console:
- Initialization message
- API base URL
- API errors

Open DevTools (F12) to view logs.

## Performance

- Lightweight: No external dependencies
- Fast load times: ~50KB total
- Efficient rendering: Only updates changed elements
- Auto-refresh: Keeps data in sync without manual refresh

## Accessibility

- Semantic HTML5 elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus indicators
- High contrast ratios

## Security

- Input sanitization (browser handles this)
- No inline JavaScript
- No eval() or dangerous functions
- HTTPS recommended for production

## Future Enhancements

Potential features to add:
- [ ] Filter todos (all, active, completed)
- [ ] Sort todos (date, title, status)
- [ ] Edit todo inline
- [ ] Drag and drop reordering
- [ ] Categories/tags
- [ ] Due dates
- [ ] Search functionality
- [ ] Dark mode toggle
- [ ] Export/import todos
- [ ] Offline support with Service Workers

## Credits

Made with Bob 🤖

## License

MIT License