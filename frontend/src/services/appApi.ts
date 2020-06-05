import axios from 'axios';

const baseAPI =  axios.create({
  baseURL: 'http://localhost:3003'
});

export {baseAPI};
