<?php

namespace Everest\Http\Requests\Api\Application\Settings;

use Everest\Models\AdminRole;
use Everest\Http\Requests\Api\Application\ApplicationApiRequest;

class GeneralSettingsRequest extends ApplicationApiRequest
{
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|min:3|max:40',
            'auto_update' => 'nullable|bool',
            'indicators' => 'nullable|bool',
            'speed_dial' => 'nullable|bool',
            'storefront_headline' => 'nullable|string|max:120',
            'storefront_subheading' => 'nullable|string|max:255',
            'storefront_cta' => 'nullable|string|max:40',
            'storefront_contact_email' => 'nullable|email|max:191',
            'storefront_show_pricing' => 'nullable|bool',
        ];
    }

    public function permission(): string
    {
        return AdminRole::SETTINGS_UPDATE;
    }
}
