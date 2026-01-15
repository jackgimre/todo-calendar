const returnURL = () => {
  return process.env.REACT_APP_API_URL || "http://localhost:4000";
};

export { returnURL };
