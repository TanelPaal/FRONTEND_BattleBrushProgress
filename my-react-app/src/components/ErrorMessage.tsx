interface ErrorMessageProps {
    error: Error | string;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
    const message = error instanceof Error ? error.message : error;
    return (
        <div className="alert alert-danger" role="alert">
            {message}
        </div>
    );
}
