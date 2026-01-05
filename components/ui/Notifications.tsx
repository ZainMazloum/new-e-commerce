import {useContext } from "react";
import { NotificationData , NotificationContextType , NotificationContext } from "@/store/notification-context";
const Notifications = (props : NotificationData) => {
     
    const notificationCtx = useContext<NotificationContextType>(NotificationContext)
    const {title , message , status} = props;
let statusClasses = "";
switch(status){
    case 'success':
      statusClasses = "bg-green-600";
      break;
    case 'error':
      statusClasses = "bg-orange-600";
      break;
    case 'pending':
      statusClasses = "bg-blue-600";
      break;
    default:
      // Optionally handle an invalid status gracefully
      statusClasses = ''; 
      break;
}
const activeClasses = `fixed bottom-0 left-0 h-20 w-full bg-gray-900 flex justify-between items-center text-white px-[10%] shadow-md shadow-black/20 ${statusClasses}`
  return (
    <div className={activeClasses} onClick={notificationCtx.hideNotification}>
      <h2 className="m-0 text-xl text-white">{title}</h2>
      <p>{message}</p>
    </div>
  )
}
export default Notifications