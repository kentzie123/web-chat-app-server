// Utils
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

// Response handler
import { success, error } from '../utils/responseHandlers.js';

// Services
import { getUsers,addUser, getUserByEmail } from '../services/user.service.js';



// Fetch All Users Controller
export const getAllUsers = async (req, res) => {
  const { data, error } = await getUsers();

  if (error || !data) {
    return error(res, error?.message || 'Something went wrong');
  }

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
  
  const userInfo = data[0];
  generateToken({id:userInfo.id, fullname:userInfo.fullname, email:userInfo.email, profile_pic: userInfo.profile_pic}, res);
  return success(res, {
    id: userInfo.id,
    fullname: userInfo.fullname,
    email: userInfo.email,
    profilePic: userInfo.profile_pic
  }, 201);
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

  generateToken({id:userInfo.id, fullname:userInfo.fullname, email:userInfo.email, profile_pic: userInfo.profile_pic}, res);

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


export const checkAuth = (req, res) => {
  try {
    return success(res, req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return error(res, 'Internal Server Error');
  }
}