const fetchQuestions = async (token) => {
  const URL = `https://opentdb.com/api.php?amount=5&token=${token}`;
  try {
    const request = await fetch(URL);
    const response = await request.json();
    return response;
  } catch (error) {
    return console.error('API error');
  }
};

export default fetchQuestions;
