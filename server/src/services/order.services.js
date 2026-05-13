import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Role from '../models/role.model.js';
const isAdminUser = async (userId) => {
  const user = await User.findById(userId).populate("role");
  return user?.role?.name === "admin";
};


export const createOrder = async (data) => {
  const order = await Order.create({...data});
  return order;
};

export const getOrders = async (userId) => {
  const isAdmin = false;
  const query = isAdmin ? {} : { userId };
  return await Order.find(query).sort({ createdAt: 1 });
};

export const getAllOrders = async (skip,limit,userId) => {
  const isAdmin =false;
  const query = isAdmin ? {} : { userId };
  return await Order.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
};