import { 
  useUIStore, 
  useShowNotification, 
  useNotificationMessage, 
  useNotificationType 
} from '../stores/uiStore';

export default function NotificationDisplay() {
  const show = useShowNotification();
  const message = useNotificationMessage();
  const type = useNotificationType();
  const { hideNotification } = useUIStore();

  if (!show) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 
                  type === 'success' ? 'bg-green-500' : 
                  'bg-blue-500';

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <span>{message}</span>
        <button 
          onClick={hideNotification}
          className="text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}