import React from 'react';
import ReactMarkdown from 'react-markdown';

function Group(props) {

    return(
        <div id="Group">
            <h1 id="Group-title">Group Presentations</h1>
            <div id="Consult-container">
                <ReactMarkdown source={props.renderElement("Group", "description", "Loading Description...")}
                                className="group-description" />
            </div>
            <h2 id="Group-contact">For Group Presentations Contact Us At:</h2>
        </div>
    )
}

export default Group;