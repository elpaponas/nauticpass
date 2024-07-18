import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Ajusta esto según la URL de tu backend
});

export default instance;
