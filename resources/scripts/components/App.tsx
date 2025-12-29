import React from 'react';
import tw from 'twin.macro';
import '@/assets/tailwind.css';
import { store } from '@/state';
import { StoreProvider } from 'easy-peasy';
import { hot } from 'react-hot-loader/root';
import { history } from '@/components/history';
import { SiteSettings, ThemeSettings } from '@/state/settings';
import IndexRouter from '@/routers/IndexRouter';
import earnCredits from '@/api/account/earnCredits';
import { setupInterceptors } from '@/api/interceptors';
import { StorefrontSettings } from '@/state/storefront';
import GlobalStylesheet from '@/assets/css/GlobalStylesheet';

interface ExtendedWindow extends Window {
    SiteConfiguration?: SiteSettings;
    StoreConfiguration?: StorefrontSettings;
    JexactylUser?: {
        uuid: string;
        username: string;
        email: string;
        approved: boolean;
        verified: boolean;
        /* eslint-disable camelcase */
        discord_id: string;
        root_admin: boolean;
        use_totp: boolean;
        referral_code: string;
        language: string;
        updated_at: string;
        created_at: string;
        /* eslint-enable camelcase */
    };
}

setupInterceptors(history);

const applyThemeConfiguration = (theme: ThemeSettings) => {
    const root = document.documentElement;
    const entries: Array<[string, string]> = [
        ['--jex-color-primary', theme.colors.primary],
        ['--jex-color-primary-hover', theme.colors.primaryHover],
        ['--jex-color-primary-text', theme.colors.primaryText],
        ['--jex-color-accent', theme.colors.accent],
        ['--jex-color-bg', theme.colors.background],
        ['--jex-color-surface', theme.colors.surface],
        ['--jex-color-text', theme.colors.text],
        ['--jex-color-muted', theme.colors.muted],
        ['--jex-color-border', theme.colors.border],
        ['--jex-font-base', theme.typography.fontFamilyBase],
        ['--jex-font-heading', theme.typography.fontFamilyHeading],
        ['--jex-font-mono', theme.typography.fontFamilyMono],
        ['--jex-font-size', theme.typography.baseSize],
        ['--jex-layout-max-width', theme.layout.maxWidth],
        ['--jex-layout-padding', theme.layout.padding],
        ['--jex-layout-gap', theme.layout.contentGap],
        ['--jex-component-button-radius', theme.components.buttonRadius],
        ['--jex-component-card-radius', theme.components.cardRadius],
        ['--jex-component-input-radius', theme.components.inputRadius],
        ['--jex-component-focus-ring', theme.components.focusRingColor],
    ];

    entries.forEach(([key, value]) => {
        if (value) {
            root.style.setProperty(key, value);
        }
    });
};

const App = () => {
    const { JexactylUser, SiteConfiguration, StoreConfiguration } = window as ExtendedWindow;

    if (JexactylUser && !store.getState().user.data) {
        store.getActions().user.setUserData({
            uuid: JexactylUser.uuid,
            username: JexactylUser.username,
            email: JexactylUser.email,
            approved: JexactylUser.approved,
            verified: JexactylUser.verified,
            discordId: JexactylUser.discord_id,
            language: JexactylUser.language,
            rootAdmin: JexactylUser.root_admin,
            useTotp: JexactylUser.use_totp,
            referralCode: JexactylUser.referral_code,
            createdAt: new Date(JexactylUser.created_at),
            updatedAt: new Date(JexactylUser.updated_at),
        });
    }

    if (!store.getState().settings.data) {
        store.getActions().settings.setSettings(SiteConfiguration!);
    }

    if (SiteConfiguration?.theme) {
        applyThemeConfiguration(SiteConfiguration.theme);
    }

    if (!store.getState().storefront.data) {
        store.getActions().storefront.setStorefront(StoreConfiguration!);
    }

    function earn() {
        setTimeout(earn, 61000); // Allow 1 second for time inconsistencies.
        earnCredits().catch(() => console.error('Failed to add credits'));
    }

    earn();

    return (
        <>
            <GlobalStylesheet />
            <StoreProvider store={store}>
                <div css={tw`mx-auto w-auto`}>
                    <IndexRouter />
                </div>
            </StoreProvider>
        </>
    );
};

export default hot(App);
