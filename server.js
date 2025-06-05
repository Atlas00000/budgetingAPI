const app = require('./src/app');
const config = require('./src/config');

const PORT = process.env.PORT || config.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
}); 