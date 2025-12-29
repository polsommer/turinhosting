import { ThemeSettings } from '@/state/settings';

export type ThemeMode = 'light' | 'dark' | 'brand';

type ThemeDefinition = Pick<ThemeSettings, 'colors' | 'typography' | 'layout' | 'components'>;

const sharedTypography: ThemeDefinition['typography'] = {
    fontFamilyBase: 'Rubik, sans-serif',
    fontFamilyHeading: 'IBM Plex Sans, sans-serif',
    fontFamilyMono: 'IBM Plex Mono, monospace',
    baseSize: '16px',
    fontImportUrl: '',
};

const sharedLayout: ThemeDefinition['layout'] = {
    maxWidth: '1200px',
    padding: '24px',
    contentGap: '24px',
};

const sharedComponents: ThemeDefinition['components'] = {
    buttonRadius: '10px',
    cardRadius: '16px',
    inputRadius: '10px',
    focusRingColor: '#38bdf8',
};

export const baseThemes: Record<ThemeMode, ThemeDefinition> = {
    brand: {
        colors: {
            primary: '#2563eb',
            primaryHover: '#1d4ed8',
            primaryText: '#f8fafc',
            accent: '#22d3ee',
            background: '#0b1220',
            surface: '#111827',
            text: '#e5e7eb',
            muted: '#94a3b8',
            border: '#1f2937',
        },
        typography: sharedTypography,
        layout: sharedLayout,
        components: sharedComponents,
    },
    dark: {
        colors: {
            primary: '#3b82f6',
            primaryHover: '#2563eb',
            primaryText: '#f8fafc',
            accent: '#38bdf8',
            background: '#0f172a',
            surface: '#111827',
            text: '#e2e8f0',
            muted: '#94a3b8',
            border: '#1e293b',
        },
        typography: sharedTypography,
        layout: sharedLayout,
        components: sharedComponents,
    },
    light: {
        colors: {
            primary: '#1d4ed8',
            primaryHover: '#1e40af',
            primaryText: '#f8fafc',
            accent: '#0284c7',
            background: '#f8fafc',
            surface: '#ffffff',
            text: '#0f172a',
            muted: '#64748b',
            border: '#e2e8f0',
        },
        typography: sharedTypography,
        layout: sharedLayout,
        components: sharedComponents,
    },
};

export const themeModes: ThemeMode[] = ['light', 'dark', 'brand'];

export const resolveThemeMode = (value?: string | null): ThemeMode => {
    if (!value) {
        return 'brand';
    }

    return themeModes.includes(value as ThemeMode) ? (value as ThemeMode) : 'brand';
};

export const resolveTheme = (theme?: ThemeSettings, mode: ThemeMode = 'brand'): ThemeDefinition => {
    const baseTheme = baseThemes[mode] ?? baseThemes.brand;

    return {
        colors: { ...baseTheme.colors, ...(theme?.colors ?? {}) },
        typography: { ...baseTheme.typography, ...(theme?.typography ?? {}) },
        layout: { ...baseTheme.layout, ...(theme?.layout ?? {}) },
        components: { ...baseTheme.components, ...(theme?.components ?? {}) },
    };
};

const fallback = baseThemes.brand;

export const tokens = {
    colors: {
        primary: `var(--jex-color-primary, ${fallback.colors.primary})`,
        primaryHover: `var(--jex-color-primary-hover, ${fallback.colors.primaryHover})`,
        primaryText: `var(--jex-color-primary-text, ${fallback.colors.primaryText})`,
        accent: `var(--jex-color-accent, ${fallback.colors.accent})`,
        background: `var(--jex-color-bg, ${fallback.colors.background})`,
        surface: `var(--jex-color-surface, ${fallback.colors.surface})`,
        text: `var(--jex-color-text, ${fallback.colors.text})`,
        muted: `var(--jex-color-muted, ${fallback.colors.muted})`,
        border: `var(--jex-color-border, ${fallback.colors.border})`,
    },
    typography: {
        fontBase: `var(--jex-font-base, ${fallback.typography.fontFamilyBase})`,
        fontHeading: `var(--jex-font-heading, ${fallback.typography.fontFamilyHeading})`,
        fontMono: `var(--jex-font-mono, ${fallback.typography.fontFamilyMono})`,
        baseSize: `var(--jex-font-size, ${fallback.typography.baseSize})`,
    },
    layout: {
        maxWidth: `var(--jex-layout-max-width, ${fallback.layout.maxWidth})`,
        padding: `var(--jex-layout-padding, ${fallback.layout.padding})`,
        contentGap: `var(--jex-layout-gap, ${fallback.layout.contentGap})`,
    },
    components: {
        buttonRadius: `var(--jex-component-button-radius, ${fallback.components.buttonRadius})`,
        cardRadius: `var(--jex-component-card-radius, ${fallback.components.cardRadius})`,
        inputRadius: `var(--jex-component-input-radius, ${fallback.components.inputRadius})`,
        focusRingColor: `var(--jex-component-focus-ring, ${fallback.components.focusRingColor})`,
    },
    effects: {
        modalOverlay: 'rgba(15, 23, 42, 0.8)',
        modalSpinnerOverlay: 'rgba(148, 163, 184, 0.35)',
    },
    status: {
        dangerBorder: '#f87171',
        dangerText: '#fecaca',
        dangerTextStrong: '#fca5a5',
    },
};
