import toast from "react-hot-toast";

export function useToast() {
  const showSuccess = (message: string) => {
    return toast.success(message);
  };

  const showError = (message: string) => {
    return toast.error(message);
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    showSuccess,
    showError,
    showLoading,
    dismiss,
  };
}
