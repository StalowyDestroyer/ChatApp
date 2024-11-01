import "./Conversation_message_component.css"

interface props {
    author: string,
    message: string,
}

export const Conversation_message_component: React.FC<props> = ({author, message}) => {
    return (
        <div className={"home_chat_message_container home_chat_" + author}>
            <div className="home_chat_message_text">
                <p className="home_label m-0 p-0">{message}</p>
            </div>
            <img src="https://bi.im-g.pl/im/62/6d/17/z24567394AMP,Kat---Roman-Kostrzewski--od-lewej--Krzysztof--Pist.jpg" className="w-25"/>
        </div>
    )

}
