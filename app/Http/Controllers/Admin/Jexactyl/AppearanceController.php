<?php

namespace Jexactyl\Http\Controllers\Admin\Jexactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Jexactyl\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository;
use Jexactyl\Exceptions\Model\DataValidationException;
use Jexactyl\Exceptions\Repository\RecordNotFoundException;
use Jexactyl\Contracts\Repository\SettingsRepositoryInterface;
use Jexactyl\Http\Requests\Admin\Jexactyl\AppearanceFormRequest;

class AppearanceController extends Controller
{
    /**
     * AppearanceController constructor.
     */
    public function __construct(
        private Repository $config,
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Render the Jexactyl settings interface.
     */
    public function index(): View
    {
        [$themeConfiguration, $themePreviewActive] = $this->resolveThemeConfiguration();

        return view('admin.jexactyl.appearance', [
            'name' => config('app.name'),
            'logo' => config('app.logo'),

            'admin' => config('theme.admin'),
            'user' => ['background' => config('theme.user.background')],
            'themeConfiguration' => $themeConfiguration,
            'themePreviewActive' => $themePreviewActive,
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws DataValidationException|RecordNotFoundException
     */
    public function update(AppearanceFormRequest $request): RedirectResponse
    {
        $data = $request->normalize();
        $themeConfiguration = $data['theme'] ?? [];
        $themeAction = $data['theme_action'] ?? 'publish';

        unset($data['theme'], $data['theme_action']);

        foreach ($data as $key => $value) {
            $this->settings->set('settings::' . $key, $value);
        }

        if (!empty($themeConfiguration)) {
            $themeConfiguration = $this->normalizeThemeConfiguration($themeConfiguration);
            $encodedTheme = json_encode($themeConfiguration, JSON_UNESCAPED_SLASHES);

            if ($themeAction === 'preview') {
                $this->settings->set('settings::theme:layout_preview', $encodedTheme);
                $request->session()->put('theme_preview', true);
                $this->alert->success('Theme preview has been updated.')->flash();
            } elseif ($themeAction === 'discard') {
                $this->settings->forget('settings::theme:layout_preview');
                $request->session()->forget('theme_preview');
                $this->alert->success('Theme preview has been cleared.')->flash();
            } else {
                $this->settings->set('settings::theme:layout', $encodedTheme);
                $this->settings->forget('settings::theme:layout_preview');
                $request->session()->forget('theme_preview');
                $this->alert->success('Theme changes have been published.')->flash();
            }
        } else {
            $this->alert->success('Jexactyl Appearance has been updated.')->flash();
        }

        return redirect()->route('admin.jexactyl.appearance');
    }

    private function resolveThemeConfiguration(): array
    {
        $defaults = config('theme.layout_defaults', []);
        $previewEnabled = (bool) session('theme_preview', false);

        $previewConfiguration = $this->decodeThemeConfiguration(config('theme.layout_preview'));
        $publishedConfiguration = $this->decodeThemeConfiguration(config('theme.layout'));

        $usePreview = $previewEnabled && !empty($previewConfiguration);
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

    private function normalizeThemeConfiguration(array $themeConfiguration): array
    {
        $defaults = config('theme.layout_defaults', []);

        return array_replace_recursive($defaults, $themeConfiguration);
    }
}
