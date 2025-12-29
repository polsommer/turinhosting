import './i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App';
import OnboardingWizard from '@/components/admin/onboarding/OnboardingWizard';
import { setConfig } from 'react-hot-loader';

// Prevents page reloads while making component changes which
// also avoids triggering constant loading indicators all over
// the place in development.
//
// @see https://github.com/gaearon/react-hot-loader#hook-support
setConfig({ reloadHooks: false });

const appElement = document.getElementById('app');
if (appElement) {
    ReactDOM.render(<App />, appElement);
}

const adminOnboardingElement = document.getElementById('admin-onboarding-root');
if (adminOnboardingElement) {
    const onboardingData = (window as Record<string, any>).AdminOnboardingData;
    if (onboardingData) {
        ReactDOM.render(<OnboardingWizard data={onboardingData} />, adminOnboardingElement);
    }
}
