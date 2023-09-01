const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { url } = require('inspector');

router.use(cors());

router.use(express.urlencoded({
    extended: true
}));
router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../client/products/products.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp products.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});
router.get('/products', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query("SELECT producttypes.Id AS productsId, products.Id, SKU, products.Name, Description, Price, Stock, producttypes.Name 'ProductTypeld', Image, products.Status FROM products, producttypes WHERE products.ProductTypeld = producttypes.Id AND products.Status=1", (err, rs) => {
            if (err) throw err;
            res.send(rs);
        })
    })
});

router.get('/details', (req, res) => {
    const filePath = path.join(__dirname, '../client/products/products_details.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp products_details.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});
router.get('/products/details/:id', (req, res) => {
    var productId = req.params.id;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`SELECT products.Id, SKU, products.Name, Description, Price, Stock, producttypes.Name 'ProductTypeld', Image, products.Status FROM products, producttypes WHERE products.ProductTypeld = producttypes.Id AND products.Id = ${productId} AND products.Status=1`, (err, rs) => {
            if (err) throw err;
            res.send(rs);
        })
    })
});

router.get("/types/:typeid", (req, res) => {
    const filePath = path.join(__dirname, '../client/products/products_types.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp products_types.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});
router.get('/products/types/:typeid', (req, res) => {
    var typeId = req.params.typeid;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`SELECT products.Id, SKU, products.Name, Description, Price, Stock, producttypes.Name 'ProductTypeld', Image, products.Status FROM products, producttypes WHERE products.ProductTypeld = producttypes.Id AND producttypes.Id = ${typeId} AND products.Status=1`, (err, rs) => {
            if (err) throw err;
            res.send(rs);
        })
    })
});


router.get("/invoices/:id", (req, res) => {
    const filePath = path.join(__dirname, '../client/products/products_invoice.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp product_invoice.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});
router.post("/invoices/:id", (req, res) => {
    var id=req.params.id;
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var invoiceData = {
        IssuedDate: currentDate,
        ShippingAddress: req.body.ShippingAddress,
        ShippingPhone: req.body.ShippingPhone,
        Total: req.body.Total,
    };
    con.connect(err => {
        if (err) throw err;
        con.query(`INSERT INTO invoices (Code, Accounttd, IssuedDate, ShippingAddress, ShippingPhone, Total, Status) VALUES ('INV-2023-${id}', ${id} ,'${invoiceData.IssuedDate}', N'${invoiceData.ShippingAddress}', '${invoiceData.ShippingPhone}', ${invoiceData.Total}, 1)`,(err, result) => {
                if (err) throw err;
                res.redirect("http://localhost:1234/products?id="+id)
            }
        );
    });
});

router.get('/carts/:id', (req, res) => {
    const filePath = path.join(__dirname, '../client/products/product_carts.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp prodproduct_cartsucts.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});
router.get('/products/carts/:id', (req, res) => {
    var idacc=req.params.id;
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`SELECT * FROM carts, accounts, products WHERE products.Id = carts.ProductId AND accounts.Id=carts.AccountId AND accounts.Id=${idacc}`, (err, rs) => {
            if (err) throw err;
            res.send(rs);
        })
    })
});
router.get('/add/carts/:id/:idpro', (req, res) => {
    var idacc = req.params.id;
    var idpro = req.params.idpro;
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;

        // Kiểm tra sự tồn tại của sản phẩm trong giỏ hàng
        con.query(`SELECT * FROM carts WHERE AccountId = ${idacc} AND ProductId = ${idpro}`, (err, rows) => {
            if (err) throw err;

            if (rows.length > 0) {
                // Sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng lên
                var quantity = rows[0].Quantity + 1;
                con.query(`UPDATE carts SET Quantity = ${quantity} WHERE AccountId = ${idacc} AND ProductId = ${idpro}`, (err, rs) => {
                    if (err) throw err;
                    res.redirect(`http://localhost:1234/products?id=${idacc}`);
                });
            } else {
                // Sản phẩm chưa tồn tại trong giỏ hàng, thêm vào với số lượng 1
                con.query(`INSERT INTO carts(AccountId, ProductId, Quantity) VALUES (${idacc}, ${idpro}, 1)`, (err, rs) => {
                    if (err) throw err;
                    res.redirect(`http://localhost:1234/products?id=${idacc}`);
                });
            }
        });
    });
});
router.get('/delete/:id/:accId', (req, res) => {
    const productId = req.params.id;
    const accountId=req.params.accId;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`DELETE FROM carts WHERE ProductId=${productId}`, (err, rs) => {
            if (err) throw err;
            console.log(rs);
            res.redirect("http://localhost:1234/products?id="+accountId);
        });
    })
});

module.exports = router;