import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Categories,
  CreateCategory,
  CreateOrder,
  CreateProduct,
  CreateReview,
  CreateUser,
  EditOrder,
  EditProduct,
  EditReview,
  EditUser,
  HelpDesk,
  HomeLayout,
  Landing,
  Login,
  Notifications,
  Orders,
  Products,
  Profile,
  Reviews,
  Users,
} from "./pages";
import { ProtectedRoute } from "./components";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (<ProtectedRoute><Landing /></ProtectedRoute>),
      },
      // {
      //   path: "/landing-v2",
      //   element: (<ProtectedRoute><LandingV2 /></ProtectedRoute>),
      // },
      {
        path: "/products",
        element: (<ProtectedRoute><Products /></ProtectedRoute>),
      },
      {
        path: "/products/create-product",
        element: (<ProtectedRoute><CreateProduct /></ProtectedRoute>),
      },
      {
        path: "/products/:id",
        element: (<ProtectedRoute><EditProduct /></ProtectedRoute>),
      },
      {
        path: "/categories",
        element: (<ProtectedRoute><Categories /></ProtectedRoute>),
      },
      {
        path: "/categories/create-category",
        element: (<ProtectedRoute><CreateCategory /></ProtectedRoute>),
      },
      {
        path: "/categories/:id",
        element: (<ProtectedRoute><CreateCategory /></ProtectedRoute>),
      },
      {
        path: "/orders",
        element: (<ProtectedRoute><Orders /></ProtectedRoute>),
      },
      {
        path: "/orders/create-order",
        element: (<ProtectedRoute><CreateOrder /></ProtectedRoute>),
      },
      {
        path: "/orders/1",
        element: (<ProtectedRoute><EditOrder /></ProtectedRoute>),
      },
      {
        path: "/reviews",
        element: (<ProtectedRoute><Reviews /></ProtectedRoute>),
      },
      {
        path: "/reviews/:id",
        element: (<ProtectedRoute><EditReview /></ProtectedRoute>),
      },
      {
        path: "/reviews/create-review",
        element: (<ProtectedRoute><CreateReview /></ProtectedRoute>),
      },
      {
        path: "/users",
        element: (<ProtectedRoute><Users /></ProtectedRoute>),
      },
      {
        path: "/users/:id",
        element: (<ProtectedRoute><EditUser /></ProtectedRoute>),
      },
      {
        path: "/users/create-user",
        element: (<ProtectedRoute><CreateUser /></ProtectedRoute>),
      },
      {
        path: "/help-desk",
        element: (<ProtectedRoute><HelpDesk /></ProtectedRoute>),
      },
      {
        path: "/notifications",
        element: (<ProtectedRoute><Notifications /></ProtectedRoute>),
      },
      {
        path: "/profile",
        element: (<ProtectedRoute><Profile /></ProtectedRoute>),
      },
    ],
    
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
