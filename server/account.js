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

// const path = require('path');
// const express = require('express');

// const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// res.status(401).render('login', { errorMessage: 'Tên đăng nhập hoặc mật khẩu không chính xác' })


router.get('/add',(req,res)=>{
    const filePath = path.join(__dirname, '../client/accounts/account_add.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp login.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});

router.post('/add', (req, res) => {
    var account = {
        USERNAME: req.body.userName,
        PASSWORD: req.body.passWord,
        EMAIL: req.body.email,
        PHONE: req.body.phone,
        ADDRESS: req.body.address,
        FULLNAME: req.body.fullName,
        AVATAR: req.body.avatar,
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`INSERT INTO accounts(Username, Password, Email, Phone, Address, FullName, IsAdmin, Avartar, Status) VALUES ('${account.USERNAME}','${account.PASSWORD}','${account.EMAIL}','${account.PHONE}',N'${account.ADDRESS}',N'${account.FULLNAME}',0,'${account.AVATAR}',1`, (err, rs) => {
            if (err) throw err;
            return res.redirect("http://localhost:1234/account/login");
        })
    })
});

router.get('/admin/add',(req,res)=>{
    const filePath = path.join(__dirname, '../client/accounts/account_admin_add.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp account_admin_add.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});

router.post('/admin/add', (req, res) => {
    var account = {
        USERNAME: req.body.userName,
        PASSWORD: req.body.passWord,
        EMAIL: req.body.email,
        PHONE: req.body.phone,
        ADDRESS: req.body.address,
        FULLNAME: req.body.fullName,
        AVATAR: req.body.avatar,
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        con.query(`INSERT INTO accounts(Username, Password, Email, Phone, Address, FullName, IsAdmin, Avartar, Status) VALUES ('${account.USERNAME}','${account.PASSWORD}','${account.EMAIL}','${account.PHONE}',N'${account.ADDRESS}',N'${account.FULLNAME}',1,'${account.AVATAR}',1`, (err, rs) => {
            if (err) throw err;
            return res.redirect("http://localhost:1234/admin/accounts");
        })
    })
});

router.get('/details', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });
    console.log("ASDASDASDSA");
    con.connect(err => {
        if (err) throw err;
        var id = req.query.id;
        console.log("=====ASDASDSADSA");
        con.query(`SELECT * FROM accounts WHERE Id ='${id}'`, (err, rs) => {
            if (err) throw err;
            console.log("=====");
            console.log(rs);
            res.send(rs);
        })
    })
})

router.post('/delete', (req, res) => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });

    con.connect(err => {
        if (err) throw err;
        var id = req.body.id;
        con.query(`DELETE FROM accounts WHERE Id = ${id}`, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        res.redirect("http://127.0.0.1:5500/client/account.html");
    });
});

router.get('/login',(req,res)=>{
    const filePath = path.join(__dirname, '../client/accounts/account_login.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc tệp login.html', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(data);
        }
    });
});

router.post('/login', (req, res) => {
    var account = {
        USERNAME: req.body.userName,
        PASSWORD: req.body.passWord
    }
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "demo_eshop"
    });
    con.connect(err => {
        if (err) throw err;
        con.query(`SELECT * FROM accounts WHERE Username = '${account.USERNAME}' AND Password = '${account.PASSWORD}'`, (err, rs) => {
            if (err) throw err;
            if (rs.length > 0) {
                const isAdmin = rs[0].IsAdmin.readInt8(0);
                const id=rs[0].Id;
                console.log(isAdmin);
                if (isAdmin === 1) {
                    const adminName = encodeURIComponent(rs[0].FullName);
                    return res.redirect(`http://localhost:1234/admin/products?message=Welcome%20admin&user=${adminName}&id=${id}`);
                } else {
                    const userName = encodeURIComponent(rs[0].FullName);
                    return res.redirect(`http://localhost:1234/products?message=Welcome%20user&user=${userName}&id=${id}`);
                }
            } else {
                //res.send("Đăng nhập thất bại");
                return res.redirect("http://localhost:1234/account/login");
            }
        });
    });
});



module.exports = router;