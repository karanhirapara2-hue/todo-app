import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PendingTodo  from "./pages/todo/pendingTodo"
import CompletedTodo from "./pages/todo/completedTodo"
import PendingSubTodo from "./pages/subTodo/pendingSubTodo"
import CompletedSubTodo from "./pages/subTodo/completedSubTodo"
import Order from './pages/order/Order';
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Admin from "./pages/user/Admin/Admin";
import UserData from "./pages/user/Admin/UsersData"
import UpdateUser from "./pages/user/Admin/UpdateUser"
import { useEffect } from "react";
import { fetchUser } from '../src/redux/slices/profileslice';
import { Toaster } from 'react-hot-toast';
import ResetPassword from '../src/pages/user/ResetPassword'
import { useDispatch } from "react-redux";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.Auth?.isAuthenticated ?? false);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.Auth?.isAuthenticated ?? false);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
         <Route
          path="/PendingTodo"
          element={
            <ProtectedRoute>
              <PendingTodo/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/PendingTodo/:userId"
          element={
            <ProtectedRoute>
              <PendingTodo/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CompletedTodo"
          element={
            <ProtectedRoute>
              <CompletedTodo/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CompletedTodo/:userId"
          element={
            <ProtectedRoute>
              <CompletedTodo/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/PendingSubTodo"
          element={
            <ProtectedRoute>
              <PendingSubTodo/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/PendingSubTodos/:userId"
          element={
            <ProtectedRoute>
              <PendingSubTodo/>
            </ProtectedRoute>
          }
        />
          <Route
        path="/PendingSubTodo/:todoId"
       element={
       <ProtectedRoute>
        <PendingSubTodo />
       </ProtectedRoute>
       }
        />
        <Route
          path="/CompletedSubTodo"
          element={
            <ProtectedRoute>
              <CompletedSubTodo/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/CompletedSubTodo/:userId"
          element={
            <ProtectedRoute>
              <CompletedSubTodo/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Order"
          element={
            <ProtectedRoute>
              <Order/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Order/:userId"
          element={
            <ProtectedRoute>
              <Order/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserData/:userId"
          element={
            <ProtectedRoute>
              <UserData />
            </ProtectedRoute>
          }
        />
        
       <Route
        path="/reset-password/:token" 
        element={
        <ResetPassword />
         } 
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route path="*" element={
          <div className="min-h-screen bg-[#edeae4] flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">🌿</span>
            <p className="text-2xl font-bold text-[#2c2416]" style={{ fontFamily: "'Georgia', serif" }}>
              Page not found
            </p>
            <p className="text-[#9e9182] text-sm">This path doesn't exist — head back home.</p>
          </div>
        } />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;