const path = require("path");
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
///const {sequelize, User} = require("./models");
require('dotenv').config();

const app = express();

//middleware

function getCookies(req){
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split("; ");
    const parsedCookies = {};

    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
}

function authToken(req, res, next){
    const cookies = getCookies(req);
    const token = cookies['token'];

    if(token == null) return res.redirect(301, '/login');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.redirect(301, '/login');

        req.user = user;

        next();
    });
}

app.use(express.static(path.join(__dirname, 'static')));

app.get("/admin", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'admin_dashboard.html'));
});

app.get("/admin/cartItems", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'cart_item.html'));
});

app.get("/admin/carts", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'cart.html'));
});

app.get("/admin/orderItems", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'order_item.html'));
});

app.get("/admin/orders", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'order.html'));
});

app.get("/admin/transactions",authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'transaction.html'));
});

app.get("/admin/products", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'product.html'));
});

app.get("/admin/productcategories", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'product_category.html'));
});

app.get("/admin/users", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'users.html'));
});

app.get("/admin/roles", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'roles.html'));
});

app.get("/admin/cities", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'cities.html'));
});

app.get("/admin/countries", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'countries.html'));
});

app.get("/admin/regions", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'regions.html'));
});

app.get("/admin/locations", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'locations.html'));
});

app.get("/admin/comments", authToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'comments.html'));
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});


// const countryRoutes = require("./routes/countries.js");
// app.use("/admin/country", countryRoutes);

// const regionRoutes = require("./routes/regions.js");
// app.use("/admin/region", regionRoutes);

// const cityRoutes = require("./routes/cities.js");
// app.use("/admin/city", cityRoutes);

// const productCategoryRoutes = require("./routes/product_categories.js");
// app.use("/admin/productCategory", productCategoryRoutes);

// const locationRoutes = require("./routes/locations.js");
// app.use("/admin/location", locationRoutes);

// const roleRoutes = require("./routes/roles.js");
// app.use("/admin/role", roleRoutes);

// const userRoutes = require("./routes/user.js");
// app.use("/admin/user", userRoutes);

// const productRoutes = require("./routes/products.js");
// app.use("/admin/product", productRoutes);

// const orderItemRoutes = require("./routes/orderitems.js")
// app.use("/admin/orderItem", orderItemRoutes);

// const orderRoutes = require("./routes/orders.js");
// app.use("/admin/order", orderRoutes);

// const cartItemRoutes = require("./routes/cartitems.js");
// app.use("/admin/cartItem", cartItemRoutes);

// const cartRoutes = require("./routes/carts.js");
// app.use("/admin/cart", cartRoutes);

// const transactionRoutes = require("./routes/transactions.js");
// app.use("/admin/transaction", transactionRoutes);

// const commentRoutes = require("./routes/comments.js")
// app.use("/admin/comment", commentRoutes);

app.listen({port: 8000}, async () => {
    console.log("Started server on localhost:8000");
});