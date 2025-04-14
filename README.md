# Inventory Manager Frontend

![Inventor Manager logo](https://github.com/AakrshitThakur/InventoryManagerFrontend/blob/main/public/images/Navbar.png)

Inventory Manager is a MERN stack-based website that helps users manage inventory with CRUD operation.

## Tech Stack

**Client:** React.js, Tailwind.css

**Server:** Node.js, Express.js

**Database:** MongoDB Atlas

**Cloud:** Cloudinary to store user images

## Color Palette Used

| Color Name          | rgb()              |
| ------------------- | ------------------ |
| Prussian blue color | rgb(1, 51, 87)     |
| Tangerine color     | rgb(244, 147, 13)  |
| Green color         | rgb(74, 222, 128)  |
| Red color           | rgb(248, 133, 133) |

## Dark/Light Mode Toggle

```javascript
export const CheckDarkMode = (SetIsDarkModeActive) => {
  const observer = new MutationObserver(() => {
    SetIsDarkModeActive(document.documentElement.classList.contains("dark"));
  });

  // Observe changes to the `class` attribute of the <html> element
  observer.observe(document.documentElement, { attributes: true });

  // Return the observer instance so it can be cleaned up when needed
  return observer;
};
```

## React Router Configuration

| Section             | Route Path                     | Component           | Description                                       |
| ------------------- | ------------------------------ | ------------------- | ------------------------------------------------- |
| **Shop Management** | `/shops`                       | `Shops`             | Main shops listing page (also serves as homepage) |
|                     | `/shops/:id`                   | `Shop`              | Individual shop details view                      |
|                     | `/shops/create`                | `CreateShop`        | Form to create a new shop                         |
|                     | `/shops/:id/edit`              | `EditShop`          | Edit existing shop details                        |
|                     | `/shops/:id/ConfirmDeleteShop` | `ConfirmDeleteShop` | Shop deletion confirmation dialog                 |
|                     | `/shops/ViewMyShops`           | `ViewMyShops`       | Shops owned by current user                       |

| **Stockroom** | `/shops/:id/stockroom` | `Stockroom` | Main stockroom dashboard for a shop |
| | `/shops/:id/stockroom/categories` | `Categories` | List all categories in stockroom |
| | `/shops/:id/stockroom/categories/new` | `CreateNewCategory` | Form to create new category |

| **Category Items** | `/shops/:id/stockroom/categories/:CategoryID` | `Category` | View items within a specific category |
| | `/shops/:id/stockroom/categories/:CategoryID/new` | `NewItem` | Add new item to category |
| | `/shops/:id/stockroom/categories/:CategoryID/:ItemID` | `Item` | View/edit specific item details |
| | `/shops/:id/stockroom/categories/:CategoryID/:ItemID/edit` | `EditItem` | Modify existing item |
| | `/shops/:id/stockroom/categories/:CategoryID/:ItemID/ConfirmDeleteItem` | `ConfirmDeleteItem` | Item deletion confirmation |
| | `/shops/:id/stockroom/categories/:CategoryID/GraphAnalyses` | `GraphAnalyses` | Visual analytics for category items |

| **Requests** | `/shops/:id/stockroom/categories/:CategoryID/:ItemID/SendReqMsg` | `SendReqMsg` | Send item request message |
| | `/reqs/ViewReqsReceived` | `ViewReqsReceived` | View requests received by current user |
| | `/reqs/ViewSentReqs` | `ViewSentReqs` | View requests sent by current user |
| | `/reqs/:id/ConfirmAcceptReq` | `ConfirmAcceptReq` | Request acceptance confirmation |
| | `/reqs/:id/ConfirmRejectReq` | `ConfirmRejectReq` | Request rejection confirmation |

| **Authentication** | `/signup` | `SignUp` | User registration with OTP verification |
| | `/login` | `Login` | User authentication |
| | `/logout` | `Logout` | Session termination |

| **Error Handling** | `/GeneralError` | `GeneralError` | Custom error page (handles 404 and other errors) |
| | `*` | `GeneralError` | Fallback route for unmatched paths (with PageNotFoundError flag) |

## Run Locally

**⚠️ Important:** Make sure to use port 5173 if you haven't already configured the CORS origin according to your needs.

Clone the project

```bash
  git clone https://github.com/AakrshitThakur/InventoryManagerFrontend.git
```

Go to the project directory

```bash
  cd InventoryManagerFrontend
```

Install dependencies

```bash
  npm install / npm i
```

Start the server

```bash
  npm run start
```

## Feedback

If you have any feedback, please reach out to us at thakurraakrshitt@gmail.com
