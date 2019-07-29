import React from 'react';
import ReactMarkdown from 'react-markdown';

function Home(props) {
    let page = props.pages.find(p => p.name === "Home");
    if (!page) page = {contents: {members: []}};
    return(
        <div id="Home">
        <div id="home-image-container">
            <h1>Love and Logic<sup>&reg;</sup> Parenting Classes</h1>
            <img id="home-image" src={props.renderElement("Home", "img_url", "https://via.placeholder.com/1080x500")} alt="Homepage Background" />
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
                    return(
                        <div id={"member-"+i} className="home-staff">
                            <img src={member.img_url} alt="A Staff Member" />
                            <p className="home-name">{member.name.toUpperCase()}</p>
                            <ReactMarkdown source={member.bio} />
                        </div>
                    )
                })
            }
        </div>
    </div>
    )
};

export default Home;