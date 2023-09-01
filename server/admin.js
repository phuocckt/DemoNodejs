const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');

router.use(cors());

router.use(express.urlencoded({
    extended: true
}));

router.get('/accounts', (req, res) => {
    const filePath = path.join(__dirname, '../client/admin/accounts.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp accounts.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});
router.get('/accounts/accounts', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query("SELECT * FROM accounts WHERE IsAdmin=1", (err, rs) => {
            if (err) throw err;
            res.send(rs);
        })
    })
});

router.get('/products', (req, res) => {
    const filePath = path.join(__dirname, '../client/admin/products.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp products.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});

router.get('/products/products', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query("SELECT products.Id, SKU, products.Name, Description, Price, Stock, producttypes.Name 'ProductTypeld', Image, products.Status FROM products, producttypes WHERE products.ProductTypeld = producttypes.Id AND products.Status=1", (err, rs) => {
            if (err) throw err;
            res.send(rs);
        })
    })
});

router.get('/invoicedetails', (req, res) => {
    const filePath = path.join(__dirname, '../client/admin/invoices.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp invoices.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});

router.get('/invoicedetails/invoicedetails', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query("SELECT * FROM invoicedetails", (err, rs) => {
            if (err) throw err;
            res.send(rs);
        })
    })
});

router.get('/products/add/:id', (req, res) => {
    const filePath = path.join(__dirname, '../client/admin/product_add.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp product_add.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});

router.post('/products/add/:id', (req, res) => {
    var id=req.params.id;
    var product = {
        Name: req.body.Name,
        Description: req.body.Description,
        Price: req.body.Price,
        Stock: req.body.Stock,
        ProductTypeld: req.body.ProductTypeld,
        Image: req.body.Image,
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`SELECT MAX(Id) as maxId FROM products`, (err, result) => {
            if (err) throw err;
            var maxId = result[0].maxId;
            var newSKU = generateSKU(maxId); // Hàm generateSKU là hàm tự định nghĩa để tạo SKU mới
            con.query(`INSERT INTO products(SKU, Name, Description, Price, Stock, ProductTypeld, Image, Status) VALUES ('${newSKU}', N'${product.Name}', '${product.Description}', '${product.Price}', ${product.Stock}, ${product.ProductTypeld}, '${product.Image}', 1)`, (err, rs) => {
                if (err) throw err;
                res.redirect("http://localhost:1234/admin/products?id="+id);
            });
        });
    });
});

function generateSKU(maxId) {
    // Tạo một logic để tạo giá trị SKU mới dựa trên maxId hoặc các yêu cầu của bạn
    // Ví dụ: 'SKU-' + maxId + 1
    return 'SKU-' + (maxId + 1);
}

router.get('/edit/:id', (req, res) => {
    const filePath = path.join(__dirname, '../client/admin/product_edit.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp product_edit.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});
router.post('/edit/:id', (req, res) => {
    const productId = req.params.id;
    var product = {
        Name: req.body.Name,
        Description: req.body.Description,
        Price: req.body.Price,
        Stock: req.body.Stock,
        ProductTypeld: req.body.ProductTypeld,
        Image: req.body.Image,
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`UPDATE products SET Name='${product.Name}', Description=N'${product.Description}', Price=N'${product.Price}', Stock=${product.Stock}, ProductTypeld=${product.ProductTypeld}, Image='${product.Image}' WHERE Id=${productId}`, (err, rs) => {
            if (err) throw err;
            console.log(rs);
            res.redirect("http://localhost:1234/admin/products");
        });
    })
});

router.get('/select/:id/details', (req, res) => {
    const productId = req.params.id;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`SELECT * FROM products WHERE Id=${productId}`, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    });
});

router.get('/delete/:id', (req, res) => {
    const productId = req.params.id;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`UPDATE products SET Status=0 WHERE Id=${productId}`, (err, rs) => {
            if (err) throw err;
            console.log(rs);
            res.redirect("http://localhost:1234/admin/products");
        });
    })
});

router.get('/accounts/edit/:id', (req, res) => {
    const filePath = path.join(__dirname, '../client/admin/account_edit.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp account_edit.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});
router.post('/accounts/edit/:id', (req, res) => {
    var id=req.params.id;
    var account = {
        USERNAME: req.body.userName,
        PASSWORD: req.body.passWord,
        EMAIL: req.body.email,
        PHONE: req.body.phone,
        ADDRESS: req.body.address,
        FULLNAME: req.body.fullName,
        AVATAR: req.body.avatar,
        STATUS: req.body.status,
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        var sql = `UPDATE accounts SET Username='${account.USERNAME}',Password='${account.PASSWORD}',Email='${account.EMAIL}',Phone='${account.PHONE}',Address=N'${account.ADDRESS}',FullName=N'${account.FULLNAME}',IsAdmin='1',Avartar='${account.AVATAR}',Status='${account.STATUS}' WHERE Id='${id}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.redirect("http://localhost:1234/admin/accounts");
        });
    });
});
router.get('/accounts/select/:id/details', (req, res) => {
    const accountId = req.params.id;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`SELECT * FROM accounts WHERE Id=${accountId}`, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    });
});

module.exports = router;