
# Inventory Manager Frontend

![Inventor Manager logo](https://github.com/AakrshitThakur/InventoryManagerFrontend/blob/main/public/images/InventoryManagerDeployedImgs/InventorManagerLogo.png?raw=true)

Inventory Manager is a MERN stack-based website that helps users manage inventory with CRUD operation.



## Tech Stack

**Client:** React, TailwindCSS

**Server:** Node, Express

**Database:** MongoDB Atlas

**Cloud:** Cloudinary to store user images



## Colors Used

| Color Name | rgb() |
|----------------|----------------|
| Prussian blue color  | rgb(1, 51, 87) |
| Tangerine color  | rgb(244, 147, 13)  |
| Green color  | rgb(74, 222, 128)  |
| Red color | rgb(248, 133, 133)  |


## Dark/Light Mode Toggle

```javascript
export const CheckDarkMode = (SetIsDarkModeActive) => {
  const observer = new MutationObserver(() => {
    SetIsDarkModeActive(document.documentElement.classList.contains('dark'));
  });

  // Observe changes to the `class` attribute of the <html> element
  observer.observe(document.documentElement, { attributes: true });

  // Return the observer instance so it can be cleaned up when needed
  return observer;
};
```


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


