<?php

namespace Everest\Http\Controllers\Base;

use Illuminate\View\View;
use Everest\Http\Controllers\Controller;

class MarketingController extends Controller
{
    /**
     * Returns the public marketing page.
     */
    public function index(): View
    {
        return view('marketing.home');
    }
}
