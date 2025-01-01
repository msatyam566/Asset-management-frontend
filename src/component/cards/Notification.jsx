import { useNotification } from "./NotificationProvider";

const Notification = () => {
  const { notification } = useNotification();

  if (!notification.message) return null;

  const style =
    notification.type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";

  return (
    <div
      className={`fixed top-3 right-4 z-50 max-w-sm p-4 border rounded-lg shadow-md ${style}`}
    >
      <p className="text-sm">{notification.message}</p>
    </div>
  );
};

export default Notification;
