import React from 'react';
import ReactMarkdown from 'react-markdown';

function Tips(props) {
    return(
        <div id="Tips">
            <ReactMarkdown className="Tips-banner" source={props.renderElement("Tips", "banner", "Loading Banner...")} />
            <ReactMarkdown className="Tips-tips" transformLinkUri={null} linkTarget="_blank" source={props.renderElement("Tips", "tips", "Loading Tips...")} />
        </div>
    )
};

export default Tips;