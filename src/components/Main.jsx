/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"

const Main = () => {

    // const FETCH_URL = "http://localhost:3000/completions";
    const FETCH_URL = "https://gpt-clone-backend.vercel.app/completions";

    const [query, setQuery] = useState('');
    const [message, setMessage] = useState(null);
    const [prevChats, setPrevChats] = useState([]);
    const [currTitle, setCurrTitle] = useState(null);
    
    const getMessage = async() => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: query
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }

        try{
            const response = await fetch(FETCH_URL, options);
            const data = await response.json(); 
            setMessage(data.data.choices[0].message)
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        if(!currTitle && query && message){
            setCurrTitle(query);
        } 
        if(currTitle && query && message){
            setPrevChats(prevChats => (
                [...prevChats, 
                    {
                        title: currTitle,
                        role: "user",
                        content: query
                    },
                    {   
                        title: currTitle,
                        role: message.role,
                        content: message.content
                    }
                ]
            ))
        }
    }, [message, currTitle]);

    const handleTitle = async(uniqueTitle) => {
        setCurrTitle(uniqueTitle);
        setMessage(null);
        setQuery(''); 
    }

    let currChat;
    if(prevChats.length > 0){
        currChat = prevChats.filter(prevChats => prevChats.title === currTitle);
    }

    const uniqueTitles = Array.from(new Set(prevChats.map(prevChat => prevChat.title)))

    return (
        <>  
            <div className="bg-[#343541] flex">
                <section className="side-bar text-white bg-[#202123] h-[100vh] w-[244px] flex flex-col justify-between items-center">
                    <button className="new-chat rounded-md p-2 m-2 w-[90%] text-left" onClick={() => {
                        setMessage(null);
                        setQuery('');
                        setCurrTitle(null);
                    }}>
                        <span className="mr-2 text-lg">+</span>
                        <span>New Chat</span>
                    </button>
                    <ul className="history block p-3 m-2 h-full w-full">

                        {uniqueTitles?.map((uniqueTitle,key) => (<li key={key} className="history-title pl-2 block py-[10px] cursor-pointer truncate" onClick={() => handleTitle(uniqueTitle)}>{uniqueTitle}</li>))}

                        
                    </ul>
                    <nav className="border-t-[0.5px] border-white bg-transparent p-2 m-2">
                        <p>Made by KSH with ❤️</p>
                    </nav>
                </section>
                <section className="main text-white h-[100vh] w-full flex flex-col justify-between items-center text-center">
                    {!currTitle && <h1 className="text-5xl absolute top-9 text-gray-500">ConvoBOT</h1>}
                    <ul className="overflow-y-scroll w-full p-0">
                        {currChat?.map((chat,index) =>{
                                return (<li key={index} className="py-[15px] flex bg-[#444654] w-full p-5 my-5">
                                    <p className="text-[rgba(255,255,255,.8)] text-left min-w-[100px] font-bold">{chat.role === "user" ? "USER" : "BOT"}</p>
                                    <p className="text-[rgba(255,255,255,.8)] text-left">{chat.content}</p>
                                </li>)
                            })}
                    </ul>
                    <div className="w-full flex flex-col justify-center items-center pt-6 mb-3">
                        <div className="relative w-full max-w-[650px] mb-3">
                            <input required type="text" className="w-full bg-[rgba(255,255,255,0.05)] py-2 pl-[15px] rounded-lg focus:outline-none shadow-[rgba(0,0,0,0.05)] shadow-md text-lg pr-12" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Send a message"/>
                            <div onClick={getMessage} className="absolute bottom-[11px] right-4 cursor-pointer">&#10146;</div>
                        </div>
                        <p className="text-xs">Free Research Preview. ConvoBOT may produce inaccurate information about people, places, or facts. [gpt-3.5-turbo]</p>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Main