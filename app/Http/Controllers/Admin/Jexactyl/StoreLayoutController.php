<?php

namespace Jexactyl\Http\Controllers\Admin\Jexactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Jexactyl\Http\Controllers\Controller;
use Jexactyl\Http\Requests\Admin\Jexactyl\StoreLayoutRequest;
use Jexactyl\Contracts\Repository\SettingsRepositoryInterface;
use Jexactyl\Services\Storefront\StoreLayoutService;

class StoreLayoutController extends Controller
{
    /**
     * StoreLayoutController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Render the store layout builder interface.
     */
    public function index(): View
    {
        $layout = StoreLayoutService::fromSetting($this->settings->get('jexactyl::store:layout'));

        return view('admin.jexactyl.store-layout', [
            'layout' => $layout,
            'layout_json' => json_encode($layout, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /**
     * Handle layout updates.
     */
    public function update(StoreLayoutRequest $request): RedirectResponse
    {
        if ($request->filled('store:layout:json')) {
            $decoded = json_decode($request->input('store:layout:json'), true);
            $layout = StoreLayoutService::normalize($decoded);

            $this->settings->set('jexactyl::store:layout', json_encode($layout, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } else {
            $this->settings->forget('jexactyl::store:layout');
        }

        $this->alert->success('Store layout updated successfully.')->flash();

        return redirect()->route('admin.jexactyl.store.layout');
    }
}
