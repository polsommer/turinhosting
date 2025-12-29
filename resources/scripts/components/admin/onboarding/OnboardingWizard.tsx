import React, { useMemo, useState } from 'react';

type OnboardingCheck = {
    id: string;
    label: string;
    passed: boolean;
    tip: string;
};

type OnboardingAction = {
    label: string;
    href: string;
};

type OnboardingStep = {
    id: string;
    title: string;
    description: string;
    checks: OnboardingCheck[];
    actions: OnboardingAction[];
};

type OnboardingData = {
    completedSteps: string[];
    saveUrl: string;
    steps: OnboardingStep[];
};

type Props = {
    data: OnboardingData;
};

const getCsrfToken = (): string => {
    const meta = document.querySelector('meta[name="_token"]') as HTMLMetaElement | null;
    return meta?.content ?? '';
};

const OnboardingWizard = ({ data }: Props) => {
    const [completedSteps, setCompletedSteps] = useState<string[]>(data.completedSteps || []);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalSteps = data.steps.length;
    const completedCount = completedSteps.length;

    const handleComplete = async (stepId: string) => {
        if (completedSteps.includes(stepId)) {
            return;
        }

        setIsSaving(true);
        setError(null);
        const nextSteps = [...completedSteps, stepId];

        try {
            const response = await fetch(data.saveUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ steps: nextSteps }),
            });

            if (!response.ok) {
                throw new Error('Unable to save onboarding progress.');
            }

            const payload = await response.json();
            setCompletedSteps(payload.steps ?? nextSteps);
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : 'Unable to save onboarding progress.');
        } finally {
            setIsSaving(false);
        }
    };

    const completionLabel = useMemo(() => {
        if (completedCount === 0) {
            return 'Not started yet';
        }

        if (completedCount === totalSteps) {
            return 'All steps completed';
        }

        return `${completedCount} of ${totalSteps} steps completed`;
    }, [completedCount, totalSteps]);

    return (
        <div>
            <div className="callout callout-info" style={{ marginBottom: '20px' }}>
                <h4>Setup progress</h4>
                <p>{completionLabel}</p>
                {error && <p className="text-red" style={{ marginBottom: 0 }}>{error}</p>}
            </div>
            {data.steps.map((step) => {
                const isComplete = completedSteps.includes(step.id);
                const readyToComplete = step.checks.every((check) => check.passed);

                return (
                    <div className="box box-default" key={step.id} style={{ marginBottom: '20px' }}>
                        <div className="box-header with-border">
                            <h3 className="box-title">{step.title}</h3>
                            <div className="box-tools pull-right">
                                {isComplete ? (
                                    <span className="label label-success">Completed</span>
                                ) : (
                                    <span className="label label-warning">In progress</span>
                                )}
                            </div>
                        </div>
                        <div className="box-body">
                            <p>{step.description}</p>
                            <ul className="list-unstyled">
                                {step.checks.map((check) => (
                                    <li key={check.id} style={{ marginBottom: '10px' }}>
                                        <i
                                            className={`fa fa-${check.passed ? 'check' : 'times'} text-${
                                                check.passed ? 'green' : 'red'
                                            }`}
                                            style={{ marginRight: '8px' }}
                                        ></i>
                                        <strong>{check.label}</strong>
                                        {!check.passed && (
                                            <div className="text-muted" style={{ marginLeft: '26px' }}>
                                                <small>{check.tip}</small>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="btn-group">
                                {step.actions.map((action) => (
                                    <a key={action.href} className="btn btn-default btn-sm" href={action.href}>
                                        {action.label}
                                    </a>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    disabled={!readyToComplete || isComplete || isSaving}
                                    onClick={() => handleComplete(step.id)}
                                >
                                    {isComplete ? 'Completed' : 'Mark complete'}
                                </button>
                            </div>
                            {!readyToComplete && (
                                <p className="text-muted" style={{ marginTop: '10px' }}>
                                    <small>Complete the checklist above to mark this step done.</small>
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OnboardingWizard;
