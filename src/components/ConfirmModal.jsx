export default function ConfirmModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          ¿Estás seguro de eliminar la lista?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800" onClick={onClose} >
            Cancelar
          </button>
          
          <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
