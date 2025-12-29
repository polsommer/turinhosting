import React from 'react';
import tw from 'twin.macro';
import '@/assets/tailwind.css';
import { store } from '@/state';
import { StoreProvider } from 'easy-peasy';
import { hot } from 'react-hot-loader/root';
import { history } from '@/components/history';
import { SiteSettings, ThemeSettings } from '@/state/settings';
import { resolveTheme, resolveThemeMode, ThemeMode } from '@/theme/tokens';
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

const applyThemeConfiguration = (theme: ThemeSettings, mode: ThemeMode) => {
    const root = document.documentElement;
    const resolvedTheme = resolveTheme(theme, mode);
    const entries: Array<[string, string]> = [
        ['--jex-color-primary', resolvedTheme.colors.primary],
        ['--jex-color-primary-hover', resolvedTheme.colors.primaryHover],
        ['--jex-color-primary-text', resolvedTheme.colors.primaryText],
        ['--jex-color-accent', resolvedTheme.colors.accent],
        ['--jex-color-bg', resolvedTheme.colors.background],
        ['--jex-color-surface', resolvedTheme.colors.surface],
        ['--jex-color-text', resolvedTheme.colors.text],
        ['--jex-color-muted', resolvedTheme.colors.muted],
        ['--jex-color-border', resolvedTheme.colors.border],
        ['--jex-font-base', resolvedTheme.typography.fontFamilyBase],
        ['--jex-font-heading', resolvedTheme.typography.fontFamilyHeading],
        ['--jex-font-mono', resolvedTheme.typography.fontFamilyMono],
        ['--jex-font-size', resolvedTheme.typography.baseSize],
        ['--jex-layout-max-width', resolvedTheme.layout.maxWidth],
        ['--jex-layout-padding', resolvedTheme.layout.padding],
        ['--jex-layout-gap', resolvedTheme.layout.contentGap],
        ['--jex-component-button-radius', resolvedTheme.components.buttonRadius],
        ['--jex-component-card-radius', resolvedTheme.components.cardRadius],
        ['--jex-component-input-radius', resolvedTheme.components.inputRadius],
        ['--jex-component-focus-ring', resolvedTheme.components.focusRingColor],
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
        const themeMode = resolveThemeMode(document.body.dataset.theme ?? undefined);
        applyThemeConfiguration(SiteConfiguration.theme, themeMode);
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
