## [Try It Live](https://parent2pi.herokuapp.com/ "Parent2PI Beta Demo")

# Parent2PI
## Main App

Paypal Smart Button enabled React App for Parenting To Promote Independence

Views:
* Home
* Practical Tips
* Book Online

Features:
* Content Managment System (Administrator Portal) at route "...website.com/admin"
  * Markdown utelization to enable client to convieniently update site content
* PayPal Smart Button Component. This is (currently anyway) the preffered method for PayPal checkouts moving forward. This guarantees updates and compatability for the for the forseeable future.

## Content Management System
The Administrator Portal can be accessed at the "/admin" route. Here, a site admin can manage the content displayed on the main app. Shop Name, Contact Email, and About page elements are all easily configurable out-of-the box. The "database-cli.js" tool can be used to seed a Mongo database with initial site content, as well as adding administrator user accounts. All passwords are hashed with bcrypt before storage.

Source can be found in the "/cms" directory

## Server
The backend is built on Node/Express. The server manages all Etsy API calls and proxys the site content between the database, CMS, and main app. It is secured with HelmetJS.

### Needed Environmental Variables
MONGO_DB - URI for mongo database

EMAIL_USER - gmail email to send confirmation email from

EMAIL_PASSWORD - Password for the above email (2-step verification needs to have an app password made)

REACT_APP_PAYPAL_CLIENT_ID - Paypal client ID
