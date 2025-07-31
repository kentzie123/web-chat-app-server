// Utils
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

// Response handler
import { success, error } from '../utils/responseHandlers.js';

// Services
import { getUsers,addUser, getUserByEmail } from '../services/user.service.js';



// Fetch All Users Controller
export const getAllUsers = async (req, res) => {
  const { data, error: err } = await getUsers();

  if(err || !data){
     return error(res, err.message);
  } // or if(err) return error(res, err.message)

  return success(res, data);
}


// Register new users
export const signUp = async (req, res) => {
  let { email, fullname, password } = req.body;

  if(!email || !fullname || !password) {
    return error(res, 'Missing required fields.', 400);
  }

  if(password.length < 6){
    return error(res, 'Password must be at least 6 characters.', 400);
  }

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const { data, error: err } = await addUser([{email, fullname, password}]);

  if(err || data.length === 0){
    return error(res, err.message);
  }

  generateToken({id:data[0].id, fullname:data[0].fullname, email:data[0].email, profile_pic: data[0].profile_pic}, res);

  return success(res, data[0], 201);  
}


// Login user
export const login = async(req, res) => {
  const { email, password } = req.body;

  if(!email || !password){
    return error(res, 'Missing required fields.', 400);
  }

  const { data, error: err} = await getUserByEmail(email);

  if(err || data.length === 0){
    return error(res, 'Invalid credentials', 400);
  }

  const userInfo = data[0];
  const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);

  if(!isPasswordCorrect){
    return error(res, 'Invalid credentials', 400);
  }

  generateToken(userInfo.id, res);

  return success(res, {
    id: userInfo.id,
    fullname: userInfo.fullname,
    email: userInfo.email,
    profilePic: userInfo.profile_pic
  }, 200);
}


// Logout user
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
    return success(res, 'Logged out successfully.');

  } catch (err) {
    console.error("Error in logout:", err.message);
    return error(res, 'Internal Server Error');
  }
};
