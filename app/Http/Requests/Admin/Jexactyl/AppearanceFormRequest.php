<?php

namespace Jexactyl\Http\Requests\Admin\Jexactyl;

use Jexactyl\Http\Requests\Admin\AdminFormRequest;

class AppearanceFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'app:name' => 'required|string|max:191',
            'app:logo' => 'required|string|max:191',
            'theme:user:background' => 'nullable|url',
            'theme:admin' => 'required|string|in:jexactyl,dark,light,blue,minecraft',
            'theme' => 'required|array',
            'theme.mode' => 'nullable|string|in:brand,dark,light',
            'theme.colors' => 'required|array',
            'theme.colors.primary' => 'required|string|max:32',
            'theme.colors.primaryHover' => 'required|string|max:32',
            'theme.colors.primaryText' => 'required|string|max:32',
            'theme.colors.background' => 'required|string|max:32',
            'theme.colors.surface' => 'required|string|max:32',
            'theme.colors.text' => 'required|string|max:32',
            'theme.colors.muted' => 'required|string|max:32',
            'theme.colors.border' => 'required|string|max:32',
            'theme.colors.accent' => 'required|string|max:32',
            'theme.typography' => 'required|array',
            'theme.typography.fontFamilyBase' => 'required|string|max:191',
            'theme.typography.fontFamilyHeading' => 'required|string|max:191',
            'theme.typography.fontFamilyMono' => 'required|string|max:191',
            'theme.typography.baseSize' => 'required|string|max:32',
            'theme.typography.fontImportUrl' => 'nullable|url|max:191',
            'theme.layout' => 'required|array',
            'theme.layout.maxWidth' => 'required|string|max:32',
            'theme.layout.padding' => 'required|string|max:32',
            'theme.layout.contentGap' => 'required|string|max:32',
            'theme.components' => 'required|array',
            'theme.components.buttonRadius' => 'required|string|max:32',
            'theme.components.cardRadius' => 'required|string|max:32',
            'theme.components.inputRadius' => 'required|string|max:32',
            'theme.components.focusRingColor' => 'required|string|max:32',
            'theme.blocks' => 'required|array',
            'theme.blocks.showHeader' => 'required|boolean',
            'theme.blocks.showFooter' => 'required|boolean',
            'theme.blocks.showSidebar' => 'required|boolean',
            'theme_action' => 'nullable|string|in:preview,publish,discard',
        ];
    }
}
