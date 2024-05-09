import {React, useRef, useEffect} from "react";
import './MessageBox.css';


function ChatMessage({message, index}) {
    var className = `messageText player-${message.player}`;
    const fullMessage = `${message.player > 0 ? `Player ${message.player}:` : ""} ${message.line}`;
    return(
            <div className={className}>{fullMessage}</div>
    )
}


function MessageBox({messageList}) {

    useEffect(() => {
        scrollToElement();
    }, [messageList])
    
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



export default MessageBox;