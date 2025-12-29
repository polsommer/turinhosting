<?php

namespace Jexactyl\Http\Requests\Admin\Jexactyl;

use Illuminate\Validation\Validator;
use Jexactyl\Http\Requests\Admin\AdminFormRequest;

class StoreLayoutRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'store:layout:json' => 'nullable|string',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (!$this->filled('store:layout:json')) {
                return;
            }

            $decoded = json_decode($this->input('store:layout:json'), true);
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
                $validator->errors()->add('store:layout:json', 'The store layout JSON must be a valid JSON object.');
            }
        });
    }
}
