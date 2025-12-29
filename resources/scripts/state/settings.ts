import { action, Action } from 'easy-peasy';

export interface SiteSettings {
    name: string;
    logo: string;
    locale: string;
    theme: ThemeSettings;
    themePreview: boolean;

    approvals: boolean;
    tickets: boolean;
    coupons: boolean;
    databases: boolean;

    alert: {
        type: 'success' | 'info' | 'warning' | 'danger';
        message: string;
    };

    recaptcha: {
        enabled: boolean;
        siteKey: string;
    };

    registration: {
        email: boolean;
        discord: boolean;
    };
}

export interface ThemeSettings {
    colors: {
        primary: string;
        primaryHover: string;
        primaryText: string;
        background: string;
        surface: string;
        text: string;
        muted: string;
        border: string;
        accent: string;
    };
    typography: {
        fontFamilyBase: string;
        fontFamilyHeading: string;
        fontFamilyMono: string;
        baseSize: string;
        fontImportUrl: string;
    };
    layout: {
        maxWidth: string;
        padding: string;
        contentGap: string;
    };
    components: {
        buttonRadius: string;
        cardRadius: string;
        inputRadius: string;
        focusRingColor: string;
    };
    blocks: {
        showHeader: boolean;
        showFooter: boolean;
        showSidebar: boolean;
    };
}

export interface SettingsStore {
    data?: SiteSettings;
    setSettings: Action<SettingsStore, SiteSettings>;
}

const settings: SettingsStore = {
    data: undefined,

    setSettings: action((state, payload) => {
        state.data = payload;
    }),
};

export default settings;
