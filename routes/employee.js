var express = require("express");
var router = express.Router();
var db = require("./db");
var upload = require("./multer")
var fs = require('fs')

/* GET home page. */
router.get("/dashboard", function (req, res, next) {
  res.render("dashboard", { status: null });
});

router.get("/employeeinterface", function (req, res, next) {
  res.render("employeeinterface", { status: null });
});

router.get("/editEmployee", function (req, res, next) {
  db.query("select E.*,(select name from states S where S.id=E.state) as sname,(select city from cities C where C.id=E.city) as cname from employee E where employeeid=?", [req.query.eid], (error, result) => {
    if (error) {
      console.log(error)
      res.render("displayemployee", { status: false, result: [] })
    }
    else {
      res.render("editemployeeinterface", { status: true, result: result[0] })
    }
  })
});

router.get("/displayAllEmployee", (req, res, next) => {
  db.query("select E.*,(select name from states S where S.id=E.state) as sname,(select city from cities C where C.id=E.city) as cname from employee E", (error, result) => {
    if (error) {
      console.log(error)
      res.render("displayemployee", { status: false, result: [] })
    }
    else {
      res.render("displayemployee", { status: false, result: result })
    }
  })
})

router.get("/displayPicture", (req, res, next) => {
  res.render('displayPicture', { eid: req.query.eid, ename: req.query.ename, picture: req.query.pic })
})

router.post("/editEmployeePicture", upload.single('picture'), (req, res) => {
  console.log(req.body)
  db.query('update employee set picture=? where employeeid=?', [req.file.filename, req.body.eid], (error, result) => {
    if (error) {
      console.log(error)
      res.redirect("/employee/displayAllEmployee")
    }
    else {
      var filepath = "e:/employeemanagement/public/images/" + req.body.oldpicture
      fs.unlinkSync(filepath)
      res.redirect("/employee/displayAllEmployee")

    }
  })
})

router.post("/submitEmployeeRecord", upload.single('picture'), (req, res) => {
  var name = req.body.firstname + " " + req.body.lastname

  db.query('insert into employee(employeename,dob,gender,contactnumber,emailaddress,address,state,city,picture)values(?,?,?,?,?,?,?,?,?)', [name, req.body.dob, req.body.gender, req.body.contactno, req.body.emailaddress, req.body.address, req.body.state, req.body.city, req.file.filename], (error, result) => {
    if (error) {
      console.log(error)
      res.render('employeeinterface', { status: 0 })
    }
    else {
      console.log(result)
      res.render('employeeinterface', { status: 1 })
    }
  })
  res.redirect('/employee/displayAllEmployee')
})

router.post("/editEmployeeRecord", (req, res) => {
  if (req.body.action === "edit") {
    var name = req.body.firstname + " " + req.body.lastname
    db.query('update employee set employeename=?,dob=?,gender=?,contactnumber=?,emailaddress=?,address=?,state=?,city=? where employeeid=?', [name, req.body.dob, req.body.gender, req.body.contactno, req.body.emailaddress, req.body.address, req.body.state, req.body.city, req.body.eid], (error, result) => {
      if (error) {
        console.log(error)
        res.render("editemployeeinterface", { status: false, result: "Failed to edit record" })
      }
      else {
        console.log(result)
        res.redirect("/employee/displayAllEmployee")

      }
    })
  }
  // else {
  //   db.query("delete from employee where employeeid=?", [req.body.eid], (error, result) => {
  //     if (error) {
  //       console.log(error)
  //       res.render("editemployeeinterface", { status: false, result: "Failed to delete record" })
  //     }
  //     else {
  //       console.log(result)
  //       res.redirect("/employee/displayAllEmployee")
  //     }
  //   })
  // }
})

router.get("/editEmployeeRecord", (req, res) => {
  if (req.query.eid) {
    db.query("delete from employee where employeeid=?", [req.query.eid], (error, result) => {
      if (error) {
        console.log(error)
        res.render("editemployeeinterface", { status: false, result: "Failed to delete record" })
      }
      else {
        console.log(result)
        res.redirect("/employee/displayAllEmployee")
      }
    })
  }
})

module.exports = router;
