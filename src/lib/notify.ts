import { ToastOptions, toast } from "react-toastify";

const config = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
} as ToastOptions;

export const notifyError = (message: string) => toast.error(message, config);

export const notifySuccess = (message: string) =>
  toast.success(message, config);

export const notifyWarn = (message: string) => toast.warn(message, config);
