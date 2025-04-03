// A component for rendering right pages at right time.
import { BrowserRouter, Routes, Route } from "react-router-dom";

// User-define components
import Shops from "../pages/Shops.jsx";
import Shop from "../pages/Shop.jsx";
import ConfirmDeleteShop from "../pages/ConfirmDeleteShop.jsx";
import EditShop from "../pages/EditShop.jsx";
import CreateShop from "../pages/CreateShop.jsx";
import ViewMyShops from "../pages/ViewMyShops.jsx";
import Stockroom from "../pages/Stockroom.jsx";
import Categories from "../pages/Categories.jsx";
import Category from "../pages/Category.jsx";
import CreateNewCategory from "../pages/CreateNewCategory.jsx";
import NewItem from "../pages/CreateNewItem.jsx";
import Item from "../pages/Item.jsx";
import SendReqMsg from "../pages/SendReqMsg.jsx";
import ConfirmAcceptReq from "../pages/ConfirmAcceptReq.jsx";
import ConfirmRejectReq from "../pages/ConfirmRejectReq.jsx";
import EditItem from "../pages/EditItem.jsx";
import ConfirmDeleteItem from "../pages/ConfirmDeleteItem.jsx";
import SignUp from "../pages/SignUp.jsx";
import Login from "../pages/Login.jsx";
import Logout from "../pages/Logout.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import GeneralError from "../pages/GeneralError.jsx";
import GraphAnalyses from "../pages/GraphAnalyses.jsx";
import ViewReqsReceived from "../pages/ViewReqsReceived.jsx";
import ViewSentReqs from "../pages/ViewSentReqs.jsx";
import "../CSS/App.css";

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar />
      {/* Routes matching from URL */}
      <BrowserRouter>
        <Routes>
          <Route path="/shops" element={<Shops />} />
          <Route path="/" element={<Shops />} />
          <Route path="/shops/:id" element={<Shop />} />
          <Route path="/shops/:id/stockroom" element={<Stockroom />} />
          <Route
            path="/shops/:id/ConfirmDeleteShop"
            element={<ConfirmDeleteShop />}
          />
          <Route path="/shops/:id/edit" element={<EditShop />} />
          <Route path="/shops/create" element={<CreateShop />} />
          <Route path="/shops/ViewMyShops" element={<ViewMyShops />} />
          <Route path="/shops/:id/stockroom" element={<Stockroom />} />
          <Route
            path="/shops/:id/stockroom/categories"
            element={<Categories />}
          />
          <Route
            path="/shops/:id/stockroom/categories/new"
            element={<CreateNewCategory />}
          />
          <Route
            path="/shops/:id/stockroom/categories/:CategoryID"
            element={<Category />}
          />
          <Route
            path="/shops/:id/stockroom/categories/:CategoryID/new"
            element={<NewItem />}
          />
          <Route
            path="/shops/:id/stockroom/categories/:CategoryID/GraphAnalyses"
            element={<GraphAnalyses />}
          />

          <Route
            path="/shops/:id/stockroom/categories/:CategoryID/:ItemID"
            element={<Item />}
          />
          <Route
            path="/shops/:id/stockroom/categories/:CategoryID/:ItemID/SendReqMsg"
            element={<SendReqMsg />}
          />
          <Route
            path="/reqs/:id/ConfirmRejectReq"
            element={<ConfirmRejectReq />}
          />
          <Route
            path="/reqs/:id/ConfirmAcceptReq"
            element={<ConfirmAcceptReq />}
          />
          <Route path="/reqs/ViewReqsReceived" element={<ViewReqsReceived />} />
          <Route path="/reqs/ViewSentReqs" element={<ViewSentReqs />} />
          <Route
            path="/shops/:id/stockroom/categories/:CategoryID/:ItemID/edit"
            element={<EditItem />}
          />
          <Route
            path="/shops/:id/stockroom/categories/:CategoryID/:ItemID/ConfirmDeleteItem"
            element={<ConfirmDeleteItem />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/GeneralError" element={<GeneralError />} />

          {/* Navigate to '/GeneralError' if no path matches the URL. */}
          <Route path="*" element={<GeneralError PageNotFoundError={true} />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;

// Tailwind responsive screen sizes chart
// sm: min-width: 640px (Small devices like tablets)
// md: min-width: 768px (Medium devices like small laptops)
// lg: min-width: 1024px (Large devices like desktops)
// xl: min-width: 1280px (Extra-large devices)
// 2xl: min-width: 1536px (Ultra-large screens)
