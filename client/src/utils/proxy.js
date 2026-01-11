const returnURL = () => {
    console.log(process.env.NODE_ENV);
    const URL = process.env.NODE_ENV === "production"
    ? 'https://todo-calendar-l2tb.onrender.com'
    : 'http://localhost:4000';
    return URL;
}

export {returnURL};