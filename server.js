import app from './src/app.js';
import db from './src/config/database.js';

const PORT = process.env.PORT || 3000;

// Initialize database before starting server
async function startServer() {
    try {
        await db.initialize();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Visit http://localhost:${PORT} to access the application`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 