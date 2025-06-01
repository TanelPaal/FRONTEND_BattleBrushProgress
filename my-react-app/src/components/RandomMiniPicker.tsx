import { useState } from 'react';
import { StatsService } from '@/services/StatsService';
import { getUserIdFromJwt } from '@/helpers/jwtHelper';

interface RandomMiniPickerProps {
    jwt: string;
}

export default function RandomMiniPicker({ jwt }: RandomMiniPickerProps) {
    const [miniature, setMiniature] = useState<{
        collectionName: string;
        collectionDesc: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePickRandom = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const userId = getUserIdFromJwt(jwt);
            if (!userId) {
                throw new Error("User ID not found");
            }

            const statsService = new StatsService();
            const result = await statsService.getRandomMiniature(userId);

            setMiniature({
                collectionName: result.collectionName,
                collectionDesc: result.collectionDesc
            });
        } catch (err) {
            setError("Failed to get random miniature. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h3 className="mb-0">Can't Decide What to Paint?</h3>
            </div>
            <div className="card-body">
                <button
                    onClick={handlePickRandom}
                    disabled={isLoading}
                    className="btn btn-primary"
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Picking...
                        </>
                    ) : (
                        "Pick Random Miniature"
                    )}
                </button>

                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {error}
                    </div>
                )}

                {miniature && (
                    <div className="mt-3">
                        <h4 className="card-title">{miniature.collectionName}</h4>
                        <p className="card-text text-muted">{miniature.collectionDesc}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
