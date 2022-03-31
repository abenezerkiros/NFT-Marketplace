// components
import ErrorPopup from "./ErrorPopup";

// context
import { useErrorStateContext } from "src/hooks/useError";

// types
import type { ErrorProps } from "./ErrorPopup";

export default function ErrorPopupContainer() {
  const { errors } = useErrorStateContext();
  return (
    <div>
      {errors.map((error: ErrorProps) => (
        <ErrorPopup open={error.open} id={error.id} key={error.id} type={error.type} message={error.message} />
      ))}
    </div>
  );
}
