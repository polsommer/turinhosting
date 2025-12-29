<?php

namespace Jexactyl\Http\Requests\Admin\Jexactyl;

use Illuminate\Validation\Validator;
use Illuminate\Support\Facades\Validator as ValidatorFacade;

class StoreProductRequest extends StoreFormRequest
{
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'store:products' => 'nullable|array',
            'store:products.categories' => 'nullable|array',
            'store:products.categories.*.id' => 'required_with:store:products.categories|string|max:50',
            'store:products.categories.*.name' => 'required_with:store:products.categories|string|max:100',
            'store:products.categories.*.description' => 'nullable|string|max:255',
            'store:products.categories.*.icon' => 'nullable|string|max:20',
            'store:products.products' => 'nullable|array',
            'store:products.products.*.id' => 'required_with:store:products.products|string|max:60',
            'store:products.products.*.name' => 'required_with:store:products.products|string|max:120',
            'store:products.products.*.category' => 'nullable|string|max:50',
            'store:products.products.*.price' => 'required_with:store:products.products|numeric|min:0',
            'store:products.products.*.billing' => 'nullable|string|max:10',
            'store:products.products.*.tag' => 'nullable|string|max:80',
            'store:products.products.*.region' => 'nullable|string|max:80',
            'store:products.products.*.highlight' => 'nullable|boolean',
            'store:products.products.*.cta' => 'nullable|string|max:40',
            'store:products.products.*.features' => 'nullable|array',
            'store:products.products.*.features.*' => 'nullable|string|max:120',
            'store:products.products.*.badges' => 'nullable|array',
            'store:products.products.*.badges.*' => 'nullable|string|max:80',
            'store:products.products.*.specs' => 'nullable|array',
            'store:products.products.*.specs.cpu' => 'nullable|string|max:40',
            'store:products.products.*.specs.memory' => 'nullable|string|max:40',
            'store:products.products.*.specs.disk' => 'nullable|string|max:40',
            'store:products.products.*.specs.bandwidth' => 'nullable|string|max:40',
            'store:products.products.*.provisioning' => 'nullable|array',
            'store:products.products.*.provisioning.cpu' => 'nullable|int|min:0',
            'store:products.products.*.provisioning.memory' => 'nullable|int|min:0',
            'store:products.products.*.provisioning.disk' => 'nullable|int|min:0',
            'store:products.products.*.provisioning.ports' => 'nullable|int|min:0',
            'store:products.products.*.provisioning.backups' => 'nullable|int|min:0',
            'store:products.products.*.provisioning.databases' => 'nullable|int|min:0',
            'store:products:json' => 'nullable|json',
        ]);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (!$this->filled('store:products:json')) {
                return;
            }

            $decoded = json_decode($this->input('store:products:json'), true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
                $validator->errors()->add('store:products:json', 'The catalog JSON must be a valid object.');

                return;
            }

            $catalogValidator = ValidatorFacade::make($decoded, $this->catalogRules());

            if ($catalogValidator->fails()) {
                foreach ($catalogValidator->errors()->all() as $message) {
                    $validator->errors()->add('store:products:json', $message);
                }
            }
        });
    }

    private function catalogRules(): array
    {
        return [
            'categories' => 'nullable|array',
            'categories.*.id' => 'required_with:categories|string|max:50',
            'categories.*.name' => 'required_with:categories|string|max:100',
            'categories.*.description' => 'nullable|string|max:255',
            'categories.*.icon' => 'nullable|string|max:20',
            'products' => 'nullable|array',
            'products.*.id' => 'required_with:products|string|max:60',
            'products.*.name' => 'required_with:products|string|max:120',
            'products.*.category' => 'nullable|string|max:50',
            'products.*.price' => 'required_with:products|numeric|min:0',
            'products.*.billing' => 'nullable|string|max:10',
            'products.*.tag' => 'nullable|string|max:80',
            'products.*.region' => 'nullable|string|max:80',
            'products.*.highlight' => 'nullable|boolean',
            'products.*.cta' => 'nullable|string|max:40',
            'products.*.features' => 'nullable|array',
            'products.*.features.*' => 'nullable|string|max:120',
            'products.*.badges' => 'nullable|array',
            'products.*.badges.*' => 'nullable|string|max:80',
            'products.*.specs' => 'nullable|array',
            'products.*.specs.cpu' => 'nullable|string|max:40',
            'products.*.specs.memory' => 'nullable|string|max:40',
            'products.*.specs.disk' => 'nullable|string|max:40',
            'products.*.specs.bandwidth' => 'nullable|string|max:40',
            'products.*.provisioning' => 'nullable|array',
            'products.*.provisioning.cpu' => 'nullable|int|min:0',
            'products.*.provisioning.memory' => 'nullable|int|min:0',
            'products.*.provisioning.disk' => 'nullable|int|min:0',
            'products.*.provisioning.ports' => 'nullable|int|min:0',
            'products.*.provisioning.backups' => 'nullable|int|min:0',
            'products.*.provisioning.databases' => 'nullable|int|min:0',
        ];
    }
}
