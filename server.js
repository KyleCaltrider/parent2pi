if (process.env.NODE_ENV !== "production") require('dotenv').config(); // Development Module
const { cmsAdmin, cmsPage } = require('./models');
const async = require('async');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

const app = express();
const form = multer().array();

app.use(express.static('./build'));
app.use(express.static('./cms/build'));
app.use(helmet());
app.use(form);

// Setup Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


// Index Route
app.get('/', function (req, res) {
    console.log("Recieved Index Request");
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

// Admin Portal | CMS Route
app.get('/admin', function (req, res) {
    console.log("Recieved Admin Index Request");
    res.sendFile(path.join(__dirname, './cms', './build', 'index.html'));
});

// Route for retriving and returning Site Content information
app.get('/api/update', function (req, res) {
    console.log("Recieved Update Request");
    // Find all Page Objects in DB
    cmsPage.find({}, function (err, pages) {
        if (err) console.error(err);
        if (!pages) {
            console.error("DB Error Likely. No Site Pages Were Found");
            return res.json({fail: "DB Error Likely. No Site Pages Were Found"})
        }
        // Iterate through site pages and process each object
        //  - Delete properties not needed by Front End
        let response = pages.map(page => {
            // Process Pages Here
            let clone = Object.assign({}, page._doc);
            delete clone._id;
            delete clone.__v;
            // End Processing
            return clone;
        });
        return res.json(response);
    });
});

// Route for Updating Site Content information
app.post('/api/cms', async function (req, res) {
    console.log("Recieved CMS Change Request");
    const changes  = await JSON.parse(req.body.updates),
          user     = req.body.user,
          password = req.body.password;
    
    if (typeof changes !== "object") return res.json({ fail: "No Valid Updates Were Requested" });
    
    // Generate list of pages that will need to be updated
    const pageNames = changes.reduce((acc, p) => {
              if (!acc.includes(p.name)) acc.push(p.name);
              return acc;
            }, []);
    
    // Find user in DB
    cmsAdmin.findOne({user: user}, function (err, admin) {
        if (err) return console.error(err);
        if (!admin) return res.json({fail: "Username or Password are Incorrect"});
        
        // Compare user-supplied password to stored password hash
        bcrypt.compare(password, admin.password, (err, verified) => {
            if (err) console.error(err);
            if (!verified)  return res.json({fail: "Username or Password are Incorrect"});
            else {
                // Find all site content pages in pageNames (Only find pages that actually need updating)
                cmsPage.find({name: {$in: pageNames}}, async function (err, pages) {
                    if (err) console.error(err);
                    
                    // For each update to be made, push updates to 'page' & save 'page' document
                    async.each(changes, async (update, callback) => {
                        let page = pages.find(p => p.name === update.name);
                        if (page) {
                            page.contents = Object.assign(page.contents, update);
                            if (page.contents.hasOwnProperty("name")) delete page.contents.name;
                            page.modified = Date.now();
                            console.log("CMS Page Change:", page);
                            page.markModified('contents');
                            page.markModified('modified');
                            await page.save((err, p) => {if (err) callback(err)});
                        }
                    }, (err) => {
                        if (err) {
                            console.error(err);
                            return res.json({fail: err});
                        }
                        return res.json({success: "Site content has been updated"})
                    });
                });
            };
        });
    });
});


app.post("/api/payment-confirmed", async function (req, res) {
    const total = req.body.total,
          booking = await JSON.parse(req.body.bookingInfo),
          paypal = await JSON.parse(req.body.paypalInfo),
          date = new Date();
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Parent2PI Payment Confirmation  ${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`,
        text: `
            Payment Confirmed for ${booking['bookingName']}\n
            Participants: ${booking['bookingParticipants']}\n
            Class Type: ${booking['bookingType']}\n
            Class Date: ${booking['bookingDate']}\n
            Client Comments: ${booking['bookingComments']}\n
            Paypal Transaction ID: ${paypal.id}\n
            Paypal Payer Name: ${paypal.payer['given_name']} ${paypal.payer.surname}\n
            Paypal Payer Email: ${paypal.payer['email_address']}
            `
    }
    
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.error(err);
        else console.log("Email Sent:", info.response);
    })


})


app.listen(process.env.PORT || 5000);
