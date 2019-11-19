require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const { cmsAdmin, cmsPage } = require('./models');
const bcrypt = require('bcrypt');

/*

Command-line tool for adding a new Administrator User or Initializing Site Content.

Arguments:
    -u --u --user --username | Username for adding a new user
    -p --p --password | Password foradding a new user
    --create_user --new_user -- create_new_user | [true or false] Boolean value for triggering creation of a new user
    --init --initialize | Seed DB with starting site content

*/

let args = process.argv.reduce((acc, arg, i, args) => {
    const val = args[i+1];
    if (arg.search(/^-?-u/i) !== -1) acc['user'] = val;
    else if (arg.search(/^-?-pas/i) !== -1) acc['password'] = val;
    else if (arg.search(/create.+user|new.+user/i) !== -1) acc['newUser'] = val;
    else if (arg.search(/init\w?/i) !== -1) acc['init'] = val;
    else if (arg.search(/photo/i) !== -1) acc['photo'] = val;
    else if (arg.search(/member/i) !== -1) acc['photoMember'] = val;
	return acc;
}, {});
args['init'] = args['init'] == 'true' ? true : false;
args['newUser'] = args['newUser'] == 'true' ? true : false;
console.log(args);


if ([0, 3].includes(mongoose.connection.readyState)) mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true});

if (args.user && args.password && args.newUser) {
    console.log("Adding A New Administrator");
    const saltRounds = 12;
    bcrypt.hash(args.password, saltRounds, function (err, hash) {
        if (err) console.error(err);
        console.log("Hash:", hash);
        if (hash) {
            cmsAdmin.findOne({user: args.user}, async function (err, user) {
                if (err) console.error(err);
                if (user) console.log("User with that username already in DB");
                else {
                    const newAdmin = new cmsAdmin({user: args.user, password: hash});
                    await newAdmin.save();
                    return console.log("Created New Admin User:", args.user);
                }
            })
        }
    })
}

if (args.init == true) {
    cmsPage.findOne({name: "Tips"}, function (err, page) {
        if (err) return  console.error(err);
        if (page) return console.log("About Page already created");
        else {
            const tipsPage = new cmsPage({name: "Tips", contents: {
                banner: "Click To Read These Articles From Love and Logic &reg;",
                tips:
                `
                * [How to Make Mornings Easier]("https://www.loveandlogic.com/articles-advice/quick-parenting-tips#mornings")

                * [Helping Your Child With Homework]("https://www.loveandlogic.com/articles-advice/quick-parenting-tips#homework")

                * [Different Parenting Styles]("https://www.loveandlogic.com/articles-advice/quick-parenting-tips#styles")

                * [Disrespectful, Oppositional Behavior]("https://www.loveandlogic.com/articles-advice/quick-parenting-tips#disrespect")

                * [Helping Children Learn Responsibility]("https://www.loveandlogic.com/articles-advice/quick-parenting-tips#responsibility")
                `
            }});
            tipsPage.save(() => console.log("Added Tips Page"));
        }
    });
    cmsPage.findOne({name: "Home"}, function (err, page) {
        if (err) return console.error(err);
        if (page) return console.log("Home Page already created");
        else {
            const homePage = new cmsPage({name: "Home", contents: {
                company: "Parenting To Promote Independence",
                email: "clarity@parenting2pi.com",
                members: [
                    {name: "Denise Glenn", img_url: "https://via.placeholder.com/150", bio: "With 30 years of experience as a Montessori Directress, Denise has found Love & Logic strategies to be invaluable in the classroom. As a parent she used these same skills to raise an independent daughter. Denise now watches the third generation benefit from these tools as a Grandmother."},
                    {name: "Brenda Kjar", img_url:"https://via.placeholder.com/150", bio: "Love and Logic was invaluable to Brenda while raising her son and twin daughters. It gave her easy to use, effective tools which promoted them becoming the independent adults they are today. She has found it equally effective working as an Educational Assistant in a Montessori classroom for the past 20 years."}
                ],
                img_text: "Love and Logic &reg; Parenting Classes",
                img_url: "https://via.placeholder.com/1224x1080",
                banner: "EARLY CHILDHOOD PARENTING MADE FUN! ™ (Ages Birth To Eight) & PARENTING THE LOVE AND LOGIC WAY ™ (Ages Six To Twelve)",
                list_title: "Course Goals",
                list_items: `
                * Creating home environments that stimulate responsibility, resiliency, and academic achievement.

                * Preventing misbehavior.
                
                * Avoiding power struggles while setting limits.
                
                * Teaching character and responsibility through modeling and the application of logical consequences instead of punishment.
                
                * Teaching children healthy problem solving skills.
                
                * Staying calm in stressful parenting situations.
                
                * Helping children become prepared to resist drugs, alcohol, violence, and other dangerous behaviors.
                `,
                members_tite: "Independent Facilitators",
                
            
            }});
            homePage.save(() => console.log("Added Home Page"));
        }
    });
    cmsPage.findOne({name: "Book"}, function (err, page) {
        if (err) return console.error(err);
        if (page) return console.log("Home Page already created");
        else {
            const bookingPage = new cmsPage({name: "Book", contents: {
                individual_price: 160,
                couples_price: 260,
                class_1: "",
                class_2: "",
                class_1_info: "",
                class_2_info: "",
                class_1_location: "",
                class_2_location: ""
            }});
            bookingPage.save("Added Book Page");
        }
    });
    cmsPage.findOne({name: "Consult"}, function (err, page) {
        if (err) return console.error(err);
        if (page) return console.log("Consult Page already created");
        else {
            const consultPage = new cmsPage({name: "Consult", contents: {
                description: "",
                included: ""
            }});
            consultPage.save("Added Private Consultation Page");
        }
    });
    cmsPage.findOne({name: "Group"}, function (err, page) {
        if (err) return console.error(err);
        if (page) return console.log("Group Presentation Page already created");
        else {
            const groupPage = new cmsPage({name: "Group", contents: {
                description: ""
            }});
            groupPage.save("Added Group Presentation Page");
        }
    });
};




if (args.photo && args.photoMember) {
    const photo = fs.readFileSync(args.photo);
    cmsPage.findOne({name: "Home"}, (err, doc) => {
        if (err) return console.error(err);
        for (let i=0; i < doc.contents.members.length; i++) {
            if (doc.contents.members[i]['name'].toLowerCase().includes(args.photoMember)) {
                console.log("Updating Photo...");
                doc.contents.members[i]['img_url'] = photo;
                doc.markModified(`contents.members`);
            }
        }
        doc.save()
    })
}
