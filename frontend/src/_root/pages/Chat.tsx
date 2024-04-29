import React, { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/rootReducer";
import { useGetRoomMessages } from "../../lib/react-query/queries";
import { Message } from "../../types";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { useRef } from "react";
import { IUser } from "../../types";
import UserCard from "../../components/shared/UserCard";
import { useGetUser } from "../../lib/react-query/queries";
import { useGetUsers } from "../../lib/react-query/queries";
import Loader from "../../components/shared/Loader";


const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: slelectedUser } = useGetUser(id);
  const userLogin = useSelector((state: RootState) => state.user);
  const {
    data: creators,
    isLoading: isUserLoading,
    // isError: isErrorCreators,
  } = useGetUsers(5);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { userInfo: currentUser } = userLogin;
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const smallerId = Math.min(Number(currentUser?.id), Number(id));
  const largerId = Math.max(Number(currentUser?.id), Number(id));
  const roomName = `chat_${smallerId}${largerId}`;
  const { data: messages, refetch } = useGetRoomMessages(roomName);


  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}`);
    ws.onopen = () => console.log("ws opened");
    ws.onclose = () => {
      console.log("ws closed"); 
    };
    ws.onerror = () => navigate(-1);
    ws.onmessage = (e) => {
      console.log('Message..')
      const msg = JSON.parse(e.data);
      console.log(msg);
      if (msg.error) {
        console.error(msg.error);
        navigate(-1);
      } else {
        refetch();
      }
    };
  
    setWs(ws);
  
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
    //eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleNewMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (ws && newMessage.length !== 0) {
      ws.send(JSON.stringify({ message: newMessage }));
      setNewMessage("");
    }
  };

return (
  <>
  <form className="flex flex-1" onSubmit={handleSendMessage}>
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col common-container ">
        <div className="w-full flex justify-between items-center p-4 bg-dark-2">
          <div className='flex justify-between'>
            <img
              src={
                slelectedUser?.profile_picture ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="user"
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-4">
              <h2 className="text-xl font-bold">{slelectedUser?.name}</h2>
              <p className="text-sm text-gray-600">@{slelectedUser?.username}</p>
            </div>
          </div>
        </div>
      <div
        className="w-full chat-scroll h-full flex flex-col"
      >
          {messages?.map((message: Message, index: number) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message?.user?.id === currentUser?.id ? "items-end" : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message?.user?.id === currentUser?.id && (
                  <>
                    <span className="bg-primary-500 p-3 rounded-md max-w-xs">
                      {message.message}
                    </span>
                    <img
                      src={
                        message?.user?.profile_picture ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="creator"
                      className="w-12 lg:h-12 rounded-full"
                    />
                  </>
                )}
                {message?.user?.id !== currentUser?.id && (
                  <>
                    <img
                      src={
                        message?.user?.profile_picture ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="creator"
                      className="w-12 lg:h-12 rounded-full"
                    />
                    <span className=" bg-slate-800 p-3 rounded-md max-w-xs">
                      {message.message}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="w-full flex justify-between items-center gap-5">
      <textarea 
        className="flex-1 shad-textarea-msg text-left align-top pl-2" 
        value={newMessage} 
        onChange={(event) => handleNewMessageChange(event as React.ChangeEvent<HTMLTextAreaElement>)}
      />
        <Button type="submit" className="shad-button_primary">
          Send
        </Button>
      </div>
    </div>
    <div className="home-creators">
      <h3 className="h3-bold text-light-1">Top Creators</h3>
      {isUserLoading && !creators ? (
        <Loader />
      ) : (
        <ul className="grid 2xl:grid-cols-2 gap-6">
        {creators?.map((creator: IUser) => (
          <li key={creator?.id} 
          className='cursor-pointer' 
          >
            <UserCard user={creator} />
          </li>
        ))}
      </ul>
      )}
    </div>
  </form>
  </>
);
};
export default Chat;
