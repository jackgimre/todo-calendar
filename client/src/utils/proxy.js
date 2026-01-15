const returnURL = () => {
    const URL = process.env.NODE_ENV === "production"
    ? 'https://todo-calendar-l2tb.onrender.com'
    : 'http://localhost:4000';
    return URL;
}

export {returnURL};