import React from 'react';
import ReactMarkdown from 'react-markdown';

function Consult(props) {

    return(
        <div id="Consult">
            <h1 id="Consult-title">Private Consultation</h1>
            <div id="Consult-container">
                <ReactMarkdown source={props.renderElement("Consult", "description", "Loading Description...")}
                                className="consult-description" />
                <h2 id="Consult-included-start"><strong>Also Included:</strong></h2>
                <ReactMarkdown source={props.renderElement("Consult", "included", "Loading...")}
                                className="consult-included" />
            </div>
            <h2 id="Consult-contact">For Consultations Contact Us At:</h2>
        </div>
    )
}

export default Consult;