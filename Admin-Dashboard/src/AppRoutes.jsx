import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import UpdateProductPage from "./pages/UpdateProductPage";
import UsersPage from "./pages/UsersPage";
import UserInfoPage from "./pages/UserInfoPage";
import OrdersPage from "./pages/OrdersPage";
import OrderInfoPage from "./pages/OrderInfoPage";
import LogisticsPage from "./pages/LogisticsPage";
import AddLogisticsPage from "./pages/AddLogisticsPage";
import UpdateLogisticPage from "./pages/UpdateLogisticPage";
import CategoriesPage from "./pages/CategoriesPage";
import AddCategoryPage from "./pages/AddCategoryPage";
import UpdateCategoryPage from "./pages/UpdateCategoryPage";
import Layout from "./layout/layout";
import AdminRegistrationPage from "./pages/RegistrationPage";
import AdminLoginPage from "./pages/LoginPage";
import PrivateRoute from "./layout/PrivateRoute";
import LogisticsInfoPage from "./pages/LogisticsInfoPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<AdminLoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <Layout>
              <Homepage />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <ProductsPage />
            </Layout>
          }
        />
        <Route
          path="/products/new-product"
          element={
            <Layout>
              <AddProductPage />
            </Layout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Layout>
              <UpdateProductPage />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <UsersPage />
            </Layout>
          }
        />
        <Route
          path="/users/:id"
          element={
            <Layout>
              <UserInfoPage />
            </Layout>
          }
        />
        <Route
          path="/orders"
          element={
            <Layout>
              <OrdersPage />
            </Layout>
          }
        />
        <Route
          path="/logistics"
          element={
            <Layout>
              <LogisticsPage />
            </Layout>
          }
        />
        <Route
          path="/categories"
          element={
            <Layout>
              <CategoriesPage />
            </Layout>
          }
        />
        <Route
          path="/categories/new"
          element={
            <Layout>
              <AddCategoryPage />
            </Layout>
          }
        />
        <Route
          path="/categories/:id"
          element={
            <Layout>
              <UpdateCategoryPage />
            </Layout>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <Layout>
              <OrderInfoPage />
            </Layout>
          }
        />
        <Route
          path="/logistics/new"
          element={
            <Layout>
              <AddLogisticsPage />
            </Layout>
          }
        />
        <Route
          path="/logistics/:id"
          element={
            <Layout>
              <LogisticsInfoPage />
            </Layout>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Layout>
              <AdminRegistrationPage />
            </Layout>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
