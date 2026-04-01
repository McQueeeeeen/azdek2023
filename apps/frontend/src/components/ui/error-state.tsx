import Button from "./button";

export default function ErrorState({
  title = "Что-то пошло не так",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="ui-error-state">
      <h3 className="h3">{title}</h3>
      {message ? <p className="text-secondary">{message}</p> : null}
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Повторить
        </Button>
      ) : null}
    </div>
  );
}
