import './App.css';
import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSubmit = e => {
    e.preventDefault()
    socket.emit( 'message', message )
    const newMessage = {
      body: message,
      from: 'Me'
    }
    setMessages([ ...messages, newMessage ])
    setMessage('')
  }

  useEffect(() => {
   
    const receiveMessage = message => {
      setMessages([...messages, message])
    }

    socket.on( 'message', receiveMessage )

    return () => {
      socket.off( 'message', receiveMessage )
    }
  }, [messages])
  

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">

      <form onSubmit={handleSubmit} className='bg-zinc-900 p-10'>
      <ul className='h-80 overflow-y-auto' >
      {messages.map( (message, index) => (
      <li key={index} className={`my-2 p-2 table text-sm rounded-md ${message.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black'}`}>
        {message.from}: {message.body}
      </li>
    ) )}
      </ul>
      <input 
        type='text' 
        onChange={ e => setMessage(e.target.value) }
        value={message} 
        className='border-2 border-zinc-500 p-2 text-black w-full'/>
      </form>
    </div>
  );
}

export default App;
