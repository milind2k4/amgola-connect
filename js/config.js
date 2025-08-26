// Load environment variables from .env file
const loadEnv = () => {
    // In production, these will be set by your hosting provider
    if (typeof process !== 'undefined' && process.env) {
        return process.env;
    }

    // For development
    const env = {};
    const envText = localStorage.getItem('env') || '';
    envText.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key) {
            env[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
        }
    });
    return env;
};

const env = loadEnv();

export const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID
};

// For development only - load from .env file
if (typeof window !== 'undefined' && !localStorage.getItem('env')) {
    fetch('/.env')
        .then(response => response.text())
        .then(text => {
            localStorage.setItem('env', text);
        })
        .catch(console.error);
}