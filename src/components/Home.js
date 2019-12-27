import React from 'react';
import ReactMarkdown from 'react-markdown';
import HomeImage from '../images/pick_one.jpg';

function Home(props) {
    let page = props.pages.find(p => p.name === "Home");
    if (!page) page = {contents: {members: [], testimonials: ""}};
    const testimonials = page.contents.testimonials.split("\n\n");
    return(
        <div id="Home">
        <div id="home-image-container">
            <h1>Love and Logic<sup>&reg;</sup> Parenting Classes</h1>
            <img id="home-image" src={HomeImage} alt="Homepage Background" />
        </div>
        <div id="home-text">
            <ReactMarkdown source={props.renderElement("Home", "banner", " Loading Banner Text...")} className="home-banner"/>
            <ReactMarkdown source={props.renderElement("Home", "list_title", "Loading List...")} className="list-title" />
            <ReactMarkdown source={props.renderElement("Home", "list_items", "Loading List Items...")} />
        </div>
        <ReactMarkdown source={props.renderElement("Home", "members_tite", "Staff")} className="members-title" />
        <div id="staff">
            {
                page["contents"]["members"].map( (member, i) => {
                    // Member image code:  `data:image/jpeg;base64,${member.img_url.toString('base64')}`
                    // Test image code:  `https://via.placeholder.com/150`
                    return(
                        <div id={"member-"+i} className="home-staff">
                        
                            <img src={`data:image/jpeg;base64,${member.img_url.toString('base64')}`} alt="A Staff Member" />
                            <p className="home-name">{member.name.toUpperCase()}</p>
                            <ReactMarkdown source={member.bio} />
                        </div>
                    )
                })
            }
        </div>
        <div id="testimonials">
            <h2 id="home-testimonials-heading">Testimonials</h2>
            {
                testimonials.map((t, i) => {
                    t = '"' + t + '"';
                    return(
                        <ReactMarkdown source={t} className="home-testimonials" key={`testimonial-${i}`} />
                    )
                })
            }
        </div>
    </div>
    )
};

export default Home;