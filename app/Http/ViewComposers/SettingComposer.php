<?php

namespace Jexactyl\Http\ViewComposers;

use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Jexactyl\Services\Helpers\AssetHashService;

class SettingComposer extends Composer
{
    /**
     * AssetComposer constructor.
     */
    public function __construct(private AssetHashService $assetHashService)
    {
        parent::__construct();
    }

    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $view->with('asset', $this->assetHashService);

        [$themeConfiguration, $themePreviewActive] = $this->resolveThemeConfiguration();
        $view->with('themeConfiguration', $themeConfiguration);
        $view->with('themePreviewActive', $themePreviewActive);
        $view->with('themeCssVariables', $this->themeCssVariables($themeConfiguration));

        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Jexactyl',
            'locale' => config('app.locale') ?? 'en',
            'logo' => config('app.logo'),
            'background' => config('theme.user.background'),
            'theme' => $themeConfiguration,
            'themePreview' => $themePreviewActive,

            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],

            'alert' => [
                'type' => $this->setting('alert:type', Composer::TYPE_STR),
                'message' => $this->setting('alert:message', Composer::TYPE_STR),
            ],

            'registration' => [
                'email' => $this->setting('registration:enabled', Composer::TYPE_BOOL),
                'discord' => $this->setting('discord:enabled', Composer::TYPE_BOOL),
            ],

            'approvals' => $this->setting('approvals:enabled', Composer::TYPE_BOOL),
            'tickets' => $this->setting('tickets:enabled', Composer::TYPE_BOOL),
            'coupons' => $this->setting('coupons:enabled', Composer::TYPE_BOOL),
            'databases' => $this->getDatabaseAvailability(),
        ]);
    }

    private function resolveThemeConfiguration(): array
    {
        $defaults = config('theme.layout_defaults', []);
        $previewConfiguration = $this->decodeThemeConfiguration(config('theme.layout_preview'));
        $publishedConfiguration = $this->decodeThemeConfiguration(config('theme.layout'));

        $previewEnabled = (bool) session('theme_preview', false);
        $usePreview = $previewEnabled
            && Auth::check()
            && Auth::user()->root_admin
            && !empty($previewConfiguration);

        $activeConfiguration = $usePreview ? $previewConfiguration : $publishedConfiguration;

        return [
            array_replace_recursive($defaults, $activeConfiguration),
            $usePreview,
        ];
    }

    private function decodeThemeConfiguration($value): array
    {
        if (is_array($value)) {
            return $value;
        }

        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);

            return is_array($decoded) ? $decoded : [];
        }

        return [];
    }

    private function themeCssVariables(array $themeConfiguration): string
    {
        $variables = [
            '--jex-color-primary' => data_get($themeConfiguration, 'colors.primary'),
            '--jex-color-primary-hover' => data_get($themeConfiguration, 'colors.primaryHover'),
            '--jex-color-primary-text' => data_get($themeConfiguration, 'colors.primaryText'),
            '--jex-color-accent' => data_get($themeConfiguration, 'colors.accent'),
            '--jex-color-bg' => data_get($themeConfiguration, 'colors.background'),
            '--jex-color-surface' => data_get($themeConfiguration, 'colors.surface'),
            '--jex-color-text' => data_get($themeConfiguration, 'colors.text'),
            '--jex-color-muted' => data_get($themeConfiguration, 'colors.muted'),
            '--jex-color-border' => data_get($themeConfiguration, 'colors.border'),
            '--jex-font-base' => data_get($themeConfiguration, 'typography.fontFamilyBase'),
            '--jex-font-heading' => data_get($themeConfiguration, 'typography.fontFamilyHeading'),
            '--jex-font-mono' => data_get($themeConfiguration, 'typography.fontFamilyMono'),
            '--jex-font-size' => data_get($themeConfiguration, 'typography.baseSize'),
            '--jex-layout-max-width' => data_get($themeConfiguration, 'layout.maxWidth'),
            '--jex-layout-padding' => data_get($themeConfiguration, 'layout.padding'),
            '--jex-layout-gap' => data_get($themeConfiguration, 'layout.contentGap'),
            '--jex-component-button-radius' => data_get($themeConfiguration, 'components.buttonRadius'),
            '--jex-component-card-radius' => data_get($themeConfiguration, 'components.cardRadius'),
            '--jex-component-input-radius' => data_get($themeConfiguration, 'components.inputRadius'),
            '--jex-component-focus-ring' => data_get($themeConfiguration, 'components.focusRingColor'),
        ];

        return collect($variables)
            ->map(function ($value, $key) {
                if (is_null($value)) {
                    return null;
                }

                return sprintf('%s:%s;', $key, $this->sanitizeCssValue($value));
            })
            ->filter()
            ->implode(' ');
    }

    private function sanitizeCssValue(string $value): string
    {
        return preg_replace('/[^#%(),.\w\s\-\'"]/', '', $value);
    }
}
