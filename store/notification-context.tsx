"use client";
import {createContext , useEffect , useState} from "react";
export interface NotificationData{
    title : string,
    message : string,
    status : "success" | "error" | "pending"
}
export interface NotificationContextType{
    notification : NotificationData | null,
    showNotification : (data : NotificationData) => void,
    hideNotification : () => void;
}
const initialContext : NotificationContextType = {
    notification : null,
    showNotification : () => {},
    hideNotification : () => {}
}
export const NotificationContext = createContext<NotificationContextType>(initialContext);
interface NotificationContextProviderProps{
    children : React.ReactNode
}
export const NotificationContextProvider = (props : NotificationContextProviderProps) => {
    const [activeNotification , setActiveNotification] = useState<NotificationData | null>(null);
    useEffect(() => {
        if(activeNotification && (activeNotification.status === "success" || activeNotification.status === "error")){
            const timer = setTimeout(() => {
                setActiveNotification(null);
            } , 3000);
            return () => {
                clearTimeout(timer);
            }
        }
    } , [activeNotification]);
    const showNotification = (data : NotificationData) => {
        setActiveNotification(data);
    }
    const hideNotification = () => {
        setActiveNotification(null);
    }
    const contextValue : NotificationContextType = {
        notification : activeNotification,
        showNotification : showNotification,
        hideNotification : hideNotification
    }
    return (
        <NotificationContext.Provider value = {contextValue}>
            {props.children}
        </NotificationContext.Provider>
    )
}
