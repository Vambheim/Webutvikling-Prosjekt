import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type User = {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

class UserService {
  createUser(
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    password2: string
  ) {
    return axios
      .post('/user/add', {
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password,
        password2: password2,
      })
      .then((response) => response.data);
  }

  /**
   * Log in with email and password
   */
  logIn(email: string, password: string) {
    return axios.get<User>('/login/' + email + '/' + password).then((response) => response.data);
  }
}

const userService = new UserService();
export default userService;
