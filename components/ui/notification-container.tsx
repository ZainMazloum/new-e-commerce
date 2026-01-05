"use client"
import { useContext } from "react"
import { NotificationContext } from "@/store/notification-context"
import Notifications from "./Notifications"
const NotificationContainer = () => {
    const notificationCtx = useContext(NotificationContext);
    const activeNotification = notificationCtx.notification;
    if(!activeNotification){
        return null;
    }
    return(
<Notifications
title={activeNotification.title}
message={activeNotification.message}
status={activeNotification.status}
/>
    )
}
export default NotificationContainer