import http from '@/api/http';
import { PanelMode } from '@/state/settings';

export interface GeneralSettings {
    name: string;
    auto_update: boolean;
    indicators: boolean;
    speed_dial: boolean;
}

export interface StorefrontSettings {
    storefront_headline: string;
    storefront_subheading: string;
    storefront_cta: string;
    storefront_contact_email: string;
    storefront_show_pricing: boolean;
}

export type SettingsUpdatePayload = Partial<GeneralSettings & StorefrontSettings>;

export const updateGeneralSettings = async (settings: SettingsUpdatePayload): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.patch(`/api/application/settings`, settings)
            .then(() => resolve())
            .catch(reject);
    });
};

export const updateModeSettings = async (mode: PanelMode): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.patch(`/api/application/settings/mode`, mode)
            .then(() => resolve())
            .catch(reject);
    });
};
