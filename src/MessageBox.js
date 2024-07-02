import React, { useRef, useEffect} from "react";
import PropTypes from 'prop-types';
import './MessageBox.css';

function ChatMessage({message}) {
    var className = `messageText player-${message.player}`;
    const fullMessage = `${message.player > 0 ? `Player ${message.player}:` : ""} ${message.line}`;
    return(
            <div className={className}>{fullMessage}</div>
    )
}

ChatMessage.propTypes = {
    // message: PropTypes.object.isRequired
}

function MessageBox({messageList}) {

    useEffect(() => {
        scrollToElement();
    }, [messageList])
    
    var apple = 3;
    const messagesEndRef = useRef();
    const scrollToElement = () => {
        const {current} = messagesEndRef;
        if (current){
            current.scrollIntoView({behavior: "smooth"})
        }
    }

    if(!messageList) {
        return null;
    }
    return(
        <ul className="messageArea">
            {messageList.map((message, index) => 
                <ChatMessage message={message} key={index}/>
            )}
            <div ref={messagesEndRef} />
        </ul>
    )
}

MessageBox.propTypes = {
    messageList: PropTypes.array.isRequired
}

export default MessageBox;