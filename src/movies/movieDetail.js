const API_ENDPOINT = 'http://localhost:3000';
const urlComponents = location.pathname.split('/');
const id = urlComponents[urlComponents.length - 2];

getMovieById(id);

async function getMovieById(id) {
  try {
    const res = await fetch(`${API_ENDPOINT}/movies/${id}`);
    const data = await res.json();

    console.log(data);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
  }
}
