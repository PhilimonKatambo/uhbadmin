import { useEffect, useState } from 'react'
import './css/history.css'
import { LeftSideBar } from './dashboard'

const History = () => {
    const [history, setHistory] = useState([])
    useEffect(() => {
        const getHistory = async() => {
            try {
                const response = await fetch("http://localhost:1200/history", {
                    method: 'GET',
                })
               if(!response.ok){
                throw new Error ("Failed to retrive history")
               }else{
                const data = await response.json();
                console.log(data)
                setHistory(data);
               }
            } catch (err) {
                console.log("error", err)
            }
        }
        getHistory()
    }, [])
    return (
        <div id='history'>
            <LeftSideBar />
            <div id='rightSideHis'>
                <div>Hey</div>
            </div>
        </div>
    )
}

export default History