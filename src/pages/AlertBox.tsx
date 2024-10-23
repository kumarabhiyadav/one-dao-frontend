import { AlertConfig, AlertType } from "../context/AlertContext";

const AlertDialog: React.FC<{
    isOpen: boolean;
    config: AlertConfig | null;
    onClose: () => void;
  }> = ({ isOpen, config, onClose }) => {
    if (!isOpen || !config) return null;
  
    const handleConfirm = () => {
      config.onConfirm?.();
      onClose();
    };
  
    const handleCancel = () => {
      config.onCancel?.();
      onClose();
    };
  
    const getIconByType = (type: AlertType) => {
      switch (type) {
        case 'success':
          return (
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case 'error':
          return (
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          );
        case 'warning':
          return (
            <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          );
        default:
          return (
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };
  
    const getBgColorByType = (type: AlertType) => {
      switch (type) {
        case 'success': return 'bg-green-50';
        case 'error': return 'bg-red-50';
        case 'warning': return 'bg-yellow-50';
        default: return 'bg-blue-50';
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl ${getBgColorByType(config.type)}`}>
          <div className="p-6">
            <div className="flex items-center gap-4">
              {getIconByType(config.type)}
              <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
            </div>
            <p className="mt-4 text-gray-600">{config.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              {config.onCancel && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {config.cancelLabel || 'Cancel'}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {config.confirmLabel || 'OK'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AlertDialog;