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

## Application Routes

### Shop Management

| Route                          | Component           | Description                      |
| ------------------------------ | ------------------- | -------------------------------- |
| `/`                            | `Shops`             | Homepage - displays shops        |
| `/shops`                       | `Shops`             | Main shops listing page          |
| `/shops/create`                | `CreateShop`        | Form to create a new shop        |
| `/shops/:id`                   | `Shop`              | View details of a specific shop  |
| `/shops/:id/edit`              | `EditShop`          | Edit a specific shop             |
| `/shops/:id/ConfirmDeleteShop` | `ConfirmDeleteShop` | Confirmation for shop deletion   |
| `/shops/ViewMyShops`           | `ViewMyShops`       | View shops owned by current user |

### Stockroom Management

| Route                                                                   | Component           | Description                     |
| ----------------------------------------------------------------------- | ------------------- | ------------------------------- |
| `/shops/:id/stockroom`                                                  | `Stockroom`         | Main stockroom view for a shop  |
| `/shops/:id/stockroom/categories`                                       | `Categories`        | List of categories in stockroom |
| `/shops/:id/stockroom/categories/new`                                   | `CreateNewCategory` | Create a new category           |
| `/shops/:id/stockroom/categories/:CategoryID`                           | `Category`          | View specific category          |
| `/shops/:id/stockroom/categories/:CategoryID/new`                       | `NewItem`           | Add new item to category        |
| `/shops/:id/stockroom/categories/:CategoryID/:ItemID`                   | `Item`              | View specific item              |
| `/shops/:id/stockroom/categories/:CategoryID/:ItemID/edit`              | `EditItem`          | Edit specific item              |
| `/shops/:id/stockroom/categories/:CategoryID/:ItemID/ConfirmDeleteItem` | `ConfirmDeleteItem` | Confirm item deletion           |
| `/shops/:id/stockroom/categories/:CategoryID/:ItemID/SendReqMsg`        | `SendReqMsg`        | Send request message about item |
| `/shops/:id/stockroom/categories/:CategoryID/GraphAnalyses`             | `GraphAnalyses`     | View analytics for category     |

### Request Management

| Route                        | Component          | Description                |
| ---------------------------- | ------------------ | -------------------------- |
| `/reqs/ViewReqsReceived`     | `ViewReqsReceived` | View received requests     |
| `/reqs/ViewSentReqs`         | `ViewSentReqs`     | View sent requests         |
| `/reqs/:id/ConfirmAcceptReq` | `ConfirmAcceptReq` | Confirm request acceptance |
| `/reqs/:id/ConfirmRejectReq` | `ConfirmRejectReq` | Confirm request rejection  |

### Authentication

| Route     | Component | Description       |
| --------- | --------- | ----------------- |
| `/signup` | `SignUp`  | User registration |
| `/login`  | `Login`   | User login        |
| `/logout` | `Logout`  | User logout       |

### Error Handling

| Route           | Component      | Description          |
| --------------- | -------------- | -------------------- |
| `/GeneralError` | `GeneralError` | General error page   |
| `*`             | `GeneralError` | 404 - Page not found |

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
