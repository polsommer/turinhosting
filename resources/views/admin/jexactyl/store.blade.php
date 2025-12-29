@extends('layouts.admin')
@include('partials/admin.jexactyl.nav', ['activeTab' => 'store'])

@section('title')
    Jexactyl Settings
@endsection

@section('content-header')
    <h1>Jexactyl Store<small>Configure the Jexactyl storefront.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Jexactyl</li>
    </ol>
@endsection

@section('content')
    @yield('jexactyl::nav')
    @php
        $store_products = $store_products ?? ['categories' => [], 'products' => []];
        $catalog_categories = $store_products['categories'] ?? [];
        $catalog_products = $store_products['products'] ?? [];
    @endphp
    <style>
        .catalog-entry {
            margin-bottom: 20px;
        }
        .storefront-card-preview {
            border-radius: 6px;
            border: 1px solid #d2d6de;
            padding: 15px;
            background: #fff;
        }
        .storefront-card-preview.is-highlighted {
            border-color: #f0ad4e;
            box-shadow: 0 0 0 2px rgba(240, 173, 78, 0.25);
        }
        .storefront-card-preview .badge-list .label {
            margin-right: 6px;
        }
        .catalog-input-row {
            margin-bottom: 8px;
        }
    </style>
    <div class="row">
        <div class="col-xs-12">
            <form action="{{ route('admin.jexactyl.store') }}" method="POST">
                <div class="box
                    @if($enabled == 'true')
                        box-success
                    @else
                        box-danger
                    @endif
                ">
                    <div class="box-header with-border">
                        <i class="fa fa-shopping-cart"></i> <h3 class="box-title">Jexactyl Storefront <small>Configure whether certain options for the store are enabled.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Storefront Enabled</label>
                                <div>
                                    <select name="store:enabled" class="form-control">
                                        <option @if ($enabled == 'false') selected @endif value="false">Disabled</option>
                                        <option @if ($enabled == 'true') selected @endif value="true">Enabled</option>
                                    </select>
                                    <p class="text-muted"><small>Determines whether users can access the store UI.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">PayPal Enabled</label>
                                <div>
                                    <select name="store:paypal:enabled" class="form-control">
                                        <option @if ($paypal_enabled == 'false') selected @endif value="false">Disabled</option>
                                        <option @if ($paypal_enabled == 'true') selected @endif value="true">Enabled</option>
                                    </select>
                                    <p class="text-muted"><small>Determines whether users can buy credits with PayPal.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Stripe Enabled</label>
                                <div>
                                    <select name="store:stripe:enabled" class="form-control">
                                        <option @if ($stripe_enabled == 'false') selected @endif value="false">Disabled</option>
                                        <option @if ($stripe_enabled == 'true') selected @endif value="true">Enabled</option>
                                    </select>
                                    <p class="text-muted"><small>Determines whether users can buy credits with Stripe.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label" for="store:currency">Name of currency</label>
                                <select name="store:currency" id="store:currency" class="form-control">
                                    @foreach ($currencies as $currency)
                                        <option @if ($selected_currency === $currency['code']) selected @endif value="{{ $currency['code'] }}">{{ $currency['name'] }}</option>
                                    @endforeach
                                </select>
                                <p class="text-muted"><small>The name of the currency used for Jexactyl.</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-money"></i> <h3 class="box-title">Idle Earning <small>Configure settings for passive credit earning.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Enabled</label>
                                <div>
                                    <select name="earn:enabled" class="form-control">
                                        <option @if ($earn_enabled == 'false') selected @endif value="false">Disabled</option>
                                        <option @if ($earn_enabled == 'true') selected @endif value="true">Enabled</option>
                                    </select>
                                    <p class="text-muted"><small>Determines whether users can earn credits passively.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Amount of credits per minute</label>
                                <div>
                                    <input type="text" class="form-control" name="earn:amount" value="{{ $earn_amount }}" />
                                    <p class="text-muted"><small>The amount of credits a user should be given per minute of AFK.</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-dollar"></i> <h3 class="box-title">Resource Pricing <small>Set specific pricing for resources.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 50% CPU</label>
                                <div>
                                    <input type="text" class="form-control" name="store:cost:cpu" value="{{ $cpu }}" />
                                    <p class="text-muted"><small>Used to calculate the total cost for 50% CPU.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 1GB RAM</label>
                                <div>
                                    <input type="text" class="form-control" name="store:cost:memory" value="{{ $memory }}" />
                                    <p class="text-muted"><small>Used to calculate the total cost for 1GB of RAM.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 1GB Disk</label>
                                <div>
                                    <input type="text" class="form-control" name="store:cost:disk" value="{{ $disk }}" />
                                    <p class="text-muted"><small>Used to calculate the total cost for 1GB of disk.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 1 Server Slot</label>
                                <div>
                                    <input type="text" class="form-control" name="store:cost:slot" value="{{ $slot }}" />
                                    <p class="text-muted"><small>Used to calculate the total cost for 1 server slot.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 1 Network Allocation</label>
                                <div>
                                    <input type="text" class="form-control" name="store:cost:port" value="{{ $port }}" />
                                    <p class="text-muted"><small>Used to calculate the total cost for 1 port.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 1 Server Backup</label>
                                <div>
                                    <input type="text" class="form-control" name="store:cost:backup" value="{{ $backup }}" />
                                    <p class="text-muted"><small>Used to calculate the total cost for 1 backup.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Cost per 1 Server Database</label>
                                <div>
                                    <input type="text" class="form-control" name="store:cost:database" value="{{ $database }}" />
                                    <p class="text-muted"><small>Used to calculate the total cost for 1 database.</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-area-chart"></i> <h3 class="box-title">Resource Limits <small>Set limits for how many of each resource a server can be deployed with.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">CPU limit</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="store:limit:cpu" value="{{ $limit_cpu }}" />
                                        <span class="input-group-addon">%</span>
                                    </div>
                                    <p class="text-muted"><small>The maximum amount of CPU a server can be deployed with. </small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">RAM limit</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="store:limit:memory" value="{{ $limit_memory }}" />
                                        <span class="input-group-addon">MB</span>
                                    </div>
                                    <p class="text-muted"><small>The maximum amount of RAM a server can be deployed with. </small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Disk limit</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="store:limit:disk" value="{{ $limit_disk }}" />
                                        <span class="input-group-addon">MB</span>
                                    </div>
                                    <p class="text-muted"><small>The maximum amount of disk a server can be deployed with. </small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Network Allocation limit</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="store:limit:port" value="{{ $limit_port }}" />
                                        <span class="input-group-addon">ports</span>
                                    </div>
                                    <p class="text-muted"><small>The maximum amount of ports (allocations) a server can be deployed with. </small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Backup limit</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="store:limit:backup" value="{{ $limit_backup }}" />
                                        <span class="input-group-addon">backups</span>
                                    </div>
                                    <p class="text-muted"><small>The maximum amount of backups a server can be deployed with. </small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Database limit</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="store:limit:database" value="{{ $limit_database }}" />
                                        <span class="input-group-addon">databases</span>
                                    </div>
                                    <p class="text-muted"><small>The maximum amount of databases a server can be deployed with. </small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <i class="fa fa-th-large"></i> <h3 class="box-title">Storefront Catalog <small>Manage categories and plans shown in the storefront.</small></h3>
                    </div>
                    <div class="box-body">
                        <p class="text-muted">
                            <small>Use the structured forms below to create and edit storefront categories and plans. This data is stored as JSON in <code>jexactyl::store:products</code>.</small>
                        </p>
                    </div>
                </div>
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-folder-open"></i> <h3 class="box-title">Categories <small>Group plans into storefront sections.</small></h3>
                    </div>
                    <div class="box-body js-category-rows">
                        @forelse ($catalog_categories as $index => $category)
                            <div class="panel panel-default catalog-entry js-category-row" data-index="{{ $index }}">
                                <div class="panel-heading">
                                    <strong>Category</strong>
                                    <button type="button" class="btn btn-xs btn-danger pull-right js-remove-row">Remove</button>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="form-group col-md-3">
                                            <label class="control-label">ID</label>
                                            <input type="text" class="form-control js-category-id" name="store:products[categories][{{ $index }}][id]" value="{{ $category['id'] ?? '' }}" />
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label class="control-label">Name</label>
                                            <input type="text" class="form-control js-category-name" name="store:products[categories][{{ $index }}][name]" value="{{ $category['name'] ?? '' }}" />
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Description</label>
                                            <input type="text" class="form-control" name="store:products[categories][{{ $index }}][description]" value="{{ $category['description'] ?? '' }}" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label class="control-label">Icon</label>
                                            <input type="text" class="form-control" name="store:products[categories][{{ $index }}][icon]" value="{{ $category['icon'] ?? '' }}" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="panel panel-default catalog-entry js-category-row" data-index="0">
                                <div class="panel-heading">
                                    <strong>Category</strong>
                                    <button type="button" class="btn btn-xs btn-danger pull-right js-remove-row">Remove</button>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="form-group col-md-3">
                                            <label class="control-label">ID</label>
                                            <input type="text" class="form-control js-category-id" name="store:products[categories][0][id]" value="" />
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label class="control-label">Name</label>
                                            <input type="text" class="form-control js-category-name" name="store:products[categories][0][name]" value="" />
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Description</label>
                                            <input type="text" class="form-control" name="store:products[categories][0][description]" value="" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label class="control-label">Icon</label>
                                            <input type="text" class="form-control" name="store:products[categories][0][icon]" value="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforelse
                        <button type="button" class="btn btn-sm btn-default js-add-category"><i class="fa fa-plus"></i> Add Category</button>
                    </div>
                </div>
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-cubes"></i> <h3 class="box-title">Plans & Products <small>Configure VPS plan metadata and provisioning values.</small></h3>
                    </div>
                    <div class="box-body js-product-rows">
                        @forelse ($catalog_products as $index => $product)
                            <div class="panel panel-default catalog-entry js-product-row" data-index="{{ $index }}">
                                <div class="panel-heading">
                                    <strong>Plan</strong>
                                    <button type="button" class="btn btn-xs btn-danger pull-right js-remove-row">Remove</button>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <div class="row">
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">ID</label>
                                                    <input type="text" class="form-control js-product-id" name="store:products[products][{{ $index }}][id]" value="{{ $product['id'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Name</label>
                                                    <input type="text" class="form-control js-product-name" name="store:products[products][{{ $index }}][name]" value="{{ $product['name'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Category</label>
                                                    <select class="form-control js-product-category" name="store:products[products][{{ $index }}][category]">
                                                        <option value="">Unassigned</option>
                                                        @foreach ($catalog_categories as $category)
                                                            <option value="{{ $category['id'] ?? '' }}" @if (($product['category'] ?? '') === ($category['id'] ?? '')) selected @endif>
                                                                {{ $category['name'] ?? $category['id'] ?? 'Category' }}
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Price</label>
                                                    <input type="text" class="form-control js-product-price" name="store:products[products][{{ $index }}][price]" value="{{ $product['price'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Billing</label>
                                                    <select class="form-control js-product-billing" name="store:products[products][{{ $index }}][billing]">
                                                        <option value="mo" @if (($product['billing'] ?? '') === 'mo') selected @endif>Monthly</option>
                                                        <option value="yr" @if (($product['billing'] ?? '') === 'yr') selected @endif>Yearly</option>
                                                        <option value="hr" @if (($product['billing'] ?? '') === 'hr') selected @endif>Hourly</option>
                                                    </select>
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Call to Action</label>
                                                    <input type="text" class="form-control" name="store:products[products][{{ $index }}][cta]" value="{{ $product['cta'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Tagline</label>
                                                    <input type="text" class="form-control js-product-tag" name="store:products[products][{{ $index }}][tag]" value="{{ $product['tag'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Region</label>
                                                    <input type="text" class="form-control js-product-region" name="store:products[products][{{ $index }}][region]" value="{{ $product['region'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Highlight</label>
                                                    <div>
                                                        <input type="hidden" name="store:products[products][{{ $index }}][highlight]" value="0" />
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" class="js-product-highlight" name="store:products[products][{{ $index }}][highlight]" value="1" @if (!empty($product['highlight'])) checked @endif>
                                                            Highlight this plan
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-group col-md-3">
                                                    <label class="control-label">CPU Spec</label>
                                                    <input type="text" class="form-control js-product-spec-cpu" name="store:products[products][{{ $index }}][specs][cpu]" value="{{ $product['specs']['cpu'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label class="control-label">Memory Spec</label>
                                                    <input type="text" class="form-control js-product-spec-memory" name="store:products[products][{{ $index }}][specs][memory]" value="{{ $product['specs']['memory'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label class="control-label">Disk Spec</label>
                                                    <input type="text" class="form-control js-product-spec-disk" name="store:products[products][{{ $index }}][specs][disk]" value="{{ $product['specs']['disk'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label class="control-label">Bandwidth Spec</label>
                                                    <input type="text" class="form-control js-product-spec-bandwidth" name="store:products[products][{{ $index }}][specs][bandwidth]" value="{{ $product['specs']['bandwidth'] ?? '' }}" />
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-group col-md-6">
                                                    <label class="control-label">Features</label>
                                                    <div class="js-product-features">
                                                        @forelse (($product['features'] ?? []) as $feature)
                                                            <div class="input-group catalog-input-row">
                                                                <input type="text" class="form-control js-product-feature" name="store:products[products][{{ $index }}][features][]" value="{{ $feature }}" />
                                                                <span class="input-group-btn">
                                                                    <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                                                                </span>
                                                            </div>
                                                        @empty
                                                            <div class="input-group catalog-input-row">
                                                                <input type="text" class="form-control js-product-feature" name="store:products[products][{{ $index }}][features][]" value="" />
                                                                <span class="input-group-btn">
                                                                    <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                                                                </span>
                                                            </div>
                                                        @endforelse
                                                    </div>
                                                    <button type="button" class="btn btn-xs btn-default js-add-feature"><i class="fa fa-plus"></i> Add Feature</button>
                                                </div>
                                                <div class="form-group col-md-6">
                                                    <label class="control-label">Badges</label>
                                                    <div class="js-product-badges">
                                                        @forelse (($product['badges'] ?? []) as $badge)
                                                            <div class="input-group catalog-input-row">
                                                                <input type="text" class="form-control js-product-badge" name="store:products[products][{{ $index }}][badges][]" value="{{ $badge }}" />
                                                                <span class="input-group-btn">
                                                                    <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                                                                </span>
                                                            </div>
                                                        @empty
                                                            <div class="input-group catalog-input-row">
                                                                <input type="text" class="form-control js-product-badge" name="store:products[products][{{ $index }}][badges][]" value="" />
                                                                <span class="input-group-btn">
                                                                    <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                                                                </span>
                                                            </div>
                                                        @endforelse
                                                    </div>
                                                    <button type="button" class="btn btn-xs btn-default js-add-badge"><i class="fa fa-plus"></i> Add Badge</button>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">vCPU</label>
                                                    <input type="text" class="form-control" name="store:products[products][{{ $index }}][provisioning][cpu]" value="{{ $product['provisioning']['cpu'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Memory (MB)</label>
                                                    <input type="text" class="form-control" name="store:products[products][{{ $index }}][provisioning][memory]" value="{{ $product['provisioning']['memory'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Disk (MB)</label>
                                                    <input type="text" class="form-control" name="store:products[products][{{ $index }}][provisioning][disk]" value="{{ $product['provisioning']['disk'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Ports</label>
                                                    <input type="text" class="form-control" name="store:products[products][{{ $index }}][provisioning][ports]" value="{{ $product['provisioning']['ports'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Backups</label>
                                                    <input type="text" class="form-control" name="store:products[products][{{ $index }}][provisioning][backups]" value="{{ $product['provisioning']['backups'] ?? '' }}" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Databases</label>
                                                    <input type="text" class="form-control" name="store:products[products][{{ $index }}][provisioning][databases]" value="{{ $product['provisioning']['databases'] ?? '' }}" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="control-label">Storefront Preview</label>
                                            <div class="storefront-card-preview js-product-preview @if (!empty($product['highlight'])) is-highlighted @endif">
                                                <div class="clearfix">
                                                    <strong class="js-preview-name">{{ $product['name'] ?? 'Plan Name' }}</strong>
                                                    <span class="pull-right js-preview-price">
                                                        {{ $selected_currency }} {{ $product['price'] ?? '0.00' }}
                                                        <small class="text-muted">/{{ $product['billing'] ?? 'mo' }}</small>
                                                    </span>
                                                </div>
                                                <div class="text-muted js-preview-region">{{ $product['region'] ?? '' }}</div>
                                                <div class="badge-list js-preview-badges">
                                                    @foreach (($product['badges'] ?? []) as $badge)
                                                        <span class="label label-info">{{ $badge }}</span>
                                                    @endforeach
                                                </div>
                                                @if (!empty($product['tag']))
                                                    <p class="text-warning js-preview-tag"><small>{{ $product['tag'] }}</small></p>
                                                @else
                                                    <p class="text-warning js-preview-tag"><small></small></p>
                                                @endif
                                                <ul class="list-unstyled js-preview-specs">
                                                    @foreach (['cpu' => 'CPU', 'memory' => 'Memory', 'disk' => 'Disk', 'bandwidth' => 'Bandwidth'] as $specKey => $specLabel)
                                                        @if (!empty($product['specs'][$specKey]))
                                                            <li><strong>{{ $specLabel }}:</strong> <span class="js-preview-spec-{{ $specKey }}">{{ $product['specs'][$specKey] }}</span></li>
                                                        @else
                                                            <li><strong>{{ $specLabel }}:</strong> <span class="js-preview-spec-{{ $specKey }}"></span></li>
                                                        @endif
                                                    @endforeach
                                                </ul>
                                                <ul class="js-preview-features">
                                                    @foreach (($product['features'] ?? []) as $feature)
                                                        <li>{{ $feature }}</li>
                                                    @endforeach
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="panel panel-default catalog-entry js-product-row" data-index="0">
                                <div class="panel-heading">
                                    <strong>Plan</strong>
                                    <button type="button" class="btn btn-xs btn-danger pull-right js-remove-row">Remove</button>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <div class="row">
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">ID</label>
                                                    <input type="text" class="form-control js-product-id" name="store:products[products][0][id]" value="" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Name</label>
                                                    <input type="text" class="form-control js-product-name" name="store:products[products][0][name]" value="" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Category</label>
                                                    <select class="form-control js-product-category" name="store:products[products][0][category]">
                                                        <option value="">Unassigned</option>
                                                        @foreach ($catalog_categories as $category)
                                                            <option value="{{ $category['id'] ?? '' }}">{{ $category['name'] ?? $category['id'] ?? 'Category' }}</option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Price</label>
                                                    <input type="text" class="form-control js-product-price" name="store:products[products][0][price]" value="" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Billing</label>
                                                    <select class="form-control js-product-billing" name="store:products[products][0][billing]">
                                                        <option value="mo">Monthly</option>
                                                        <option value="yr">Yearly</option>
                                                        <option value="hr">Hourly</option>
                                                    </select>
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Call to Action</label>
                                                    <input type="text" class="form-control" name="store:products[products][0][cta]" value="" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Tagline</label>
                                                    <input type="text" class="form-control js-product-tag" name="store:products[products][0][tag]" value="" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Region</label>
                                                    <input type="text" class="form-control js-product-region" name="store:products[products][0][region]" value="" />
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="control-label">Highlight</label>
                                                    <div>
                                                        <input type="hidden" name="store:products[products][0][highlight]" value="0" />
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" class="js-product-highlight" name="store:products[products][0][highlight]" value="1">
                                                            Highlight this plan
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-group col-md-3">
                                                    <label class="control-label">CPU Spec</label>
                                                    <input type="text" class="form-control js-product-spec-cpu" name="store:products[products][0][specs][cpu]" value="" />
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label class="control-label">Memory Spec</label>
                                                    <input type="text" class="form-control js-product-spec-memory" name="store:products[products][0][specs][memory]" value="" />
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label class="control-label">Disk Spec</label>
                                                    <input type="text" class="form-control js-product-spec-disk" name="store:products[products][0][specs][disk]" value="" />
                                                </div>
                                                <div class="form-group col-md-3">
                                                    <label class="control-label">Bandwidth Spec</label>
                                                    <input type="text" class="form-control js-product-spec-bandwidth" name="store:products[products][0][specs][bandwidth]" value="" />
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-group col-md-6">
                                                    <label class="control-label">Features</label>
                                                    <div class="js-product-features">
                                                        <div class="input-group catalog-input-row">
                                                            <input type="text" class="form-control js-product-feature" name="store:products[products][0][features][]" value="" />
                                                            <span class="input-group-btn">
                                                                <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button type="button" class="btn btn-xs btn-default js-add-feature"><i class="fa fa-plus"></i> Add Feature</button>
                                                </div>
                                                <div class="form-group col-md-6">
                                                    <label class="control-label">Badges</label>
                                                    <div class="js-product-badges">
                                                        <div class="input-group catalog-input-row">
                                                            <input type="text" class="form-control js-product-badge" name="store:products[products][0][badges][]" value="" />
                                                            <span class="input-group-btn">
                                                                <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button type="button" class="btn btn-xs btn-default js-add-badge"><i class="fa fa-plus"></i> Add Badge</button>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">vCPU</label>
                                                    <input type="text" class="form-control" name="store:products[products][0][provisioning][cpu]" value="" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Memory (MB)</label>
                                                    <input type="text" class="form-control" name="store:products[products][0][provisioning][memory]" value="" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Disk (MB)</label>
                                                    <input type="text" class="form-control" name="store:products[products][0][provisioning][disk]" value="" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Ports</label>
                                                    <input type="text" class="form-control" name="store:products[products][0][provisioning][ports]" value="" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Backups</label>
                                                    <input type="text" class="form-control" name="store:products[products][0][provisioning][backups]" value="" />
                                                </div>
                                                <div class="form-group col-md-2">
                                                    <label class="control-label">Databases</label>
                                                    <input type="text" class="form-control" name="store:products[products][0][provisioning][databases]" value="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="control-label">Storefront Preview</label>
                                            <div class="storefront-card-preview js-product-preview">
                                                <div class="clearfix">
                                                    <strong class="js-preview-name">Plan Name</strong>
                                                    <span class="pull-right js-preview-price">
                                                        {{ $selected_currency }} 0.00
                                                        <small class="text-muted">/mo</small>
                                                    </span>
                                                </div>
                                                <div class="text-muted js-preview-region"></div>
                                                <div class="badge-list js-preview-badges"></div>
                                                <p class="text-warning js-preview-tag"><small></small></p>
                                                <ul class="list-unstyled js-preview-specs">
                                                    <li><strong>CPU:</strong> <span class="js-preview-spec-cpu"></span></li>
                                                    <li><strong>Memory:</strong> <span class="js-preview-spec-memory"></span></li>
                                                    <li><strong>Disk:</strong> <span class="js-preview-spec-disk"></span></li>
                                                    <li><strong>Bandwidth:</strong> <span class="js-preview-spec-bandwidth"></span></li>
                                                </ul>
                                                <ul class="js-preview-features"></ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforelse
                        <button type="button" class="btn btn-sm btn-default js-add-product"><i class="fa fa-plus"></i> Add Plan</button>
                    </div>
                </div>
                <div class="box box-warning">
                    <div class="box-header with-border">
                        <i class="fa fa-code"></i> <h3 class="box-title">Catalog JSON <small>Import, export, or bulk-edit the catalog.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-12">
                                <label class="control-label">JSON Editor (optional)</label>
                                <textarea class="form-control" rows="10" name="store:products:json" id="store-products-json">{{ $store_products_json ?? '' }}</textarea>
                                <p class="text-muted">
                                    <small>If provided, this JSON will override the structured form entries when you save.</small>
                                </p>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="control-label">Import JSON</label>
                                <input type="file" class="form-control" id="store-products-import" accept="application/json" />
                            </div>
                            <div class="form-group col-md-6">
                                <label class="control-label">Export JSON</label>
                                <div>
                                    <button type="button" class="btn btn-sm btn-default" id="store-products-export"><i class="fa fa-download"></i> Download JSON</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!! csrf_field() !!}
                <button type="submit" name="_method" value="PATCH" class="btn btn-default pull-right">Save Changes</button>
            </form>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        (function () {
            var categoryIndex = {{ count($catalog_categories) ? count($catalog_categories) : 1 }};
            var productIndex = {{ count($catalog_products) ? count($catalog_products) : 1 }};
            var currencyCode = '{{ $selected_currency }}';

            function refreshCategoryOptions() {
                var categories = [];
                $('.js-category-row').each(function () {
                    var id = $(this).find('.js-category-id').val();
                    var name = $(this).find('.js-category-name').val();
                    if (id) {
                        categories.push({ id: id, name: name || id });
                    }
                });

                $('.js-product-category').each(function () {
                    var current = $(this).val();
                    $(this).empty().append($('<option>').val('').text('Unassigned'));
                    categories.forEach(function (category) {
                        $(this).append($('<option>').val(category.id).text(category.name));
                    }, this);
                    $(this).val(current);
                });
            }

            function updateProductPreview($row) {
                var name = $row.find('.js-product-name').val() || 'Plan Name';
                var price = $row.find('.js-product-price').val() || '0.00';
                var billing = $row.find('.js-product-billing').val() || 'mo';
                var tag = $row.find('.js-product-tag').val() || '';
                var region = $row.find('.js-product-region').val() || '';
                var highlighted = $row.find('.js-product-highlight').is(':checked');
                var $preview = $row.find('.js-product-preview');

                $preview.toggleClass('is-highlighted', highlighted);
                $preview.find('.js-preview-name').text(name);
                $preview.find('.js-preview-price').html(currencyCode + ' ' + price + ' <small class="text-muted">/' + billing + '</small>');
                $preview.find('.js-preview-region').text(region);
                $preview.find('.js-preview-tag small').text(tag);

                ['cpu', 'memory', 'disk', 'bandwidth'].forEach(function (spec) {
                    var value = $row.find('.js-product-spec-' + spec).val() || '';
                    $preview.find('.js-preview-spec-' + spec).text(value);
                });

                var featureItems = [];
                $row.find('.js-product-feature').each(function () {
                    var value = $(this).val();
                    if (value) {
                        featureItems.push('<li>' + $('<div>').text(value).html() + '</li>');
                    }
                });
                $preview.find('.js-preview-features').html(featureItems.join(''));

                var badgeItems = [];
                $row.find('.js-product-badge').each(function () {
                    var value = $(this).val();
                    if (value) {
                        badgeItems.push('<span class="label label-info">' + $('<div>').text(value).html() + '</span>');
                    }
                });
                $preview.find('.js-preview-badges').html(badgeItems.join(''));
            }

            function addCategoryRow() {
                var index = categoryIndex++;
                var $row = $(`
                    <div class="panel panel-default catalog-entry js-category-row" data-index="${index}">
                        <div class="panel-heading">
                            <strong>Category</strong>
                            <button type="button" class="btn btn-xs btn-danger pull-right js-remove-row">Remove</button>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="form-group col-md-3">
                                    <label class="control-label">ID</label>
                                    <input type="text" class="form-control js-category-id" name="store:products[categories][${index}][id]" value="" />
                                </div>
                                <div class="form-group col-md-3">
                                    <label class="control-label">Name</label>
                                    <input type="text" class="form-control js-category-name" name="store:products[categories][${index}][name]" value="" />
                                </div>
                                <div class="form-group col-md-4">
                                    <label class="control-label">Description</label>
                                    <input type="text" class="form-control" name="store:products[categories][${index}][description]" value="" />
                                </div>
                                <div class="form-group col-md-2">
                                    <label class="control-label">Icon</label>
                                    <input type="text" class="form-control" name="store:products[categories][${index}][icon]" value="" />
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                $('.js-category-rows').append($row);
            }

            function addProductRow() {
                var index = productIndex++;
                var $row = $(`
                    <div class="panel panel-default catalog-entry js-product-row" data-index="${index}">
                        <div class="panel-heading">
                            <strong>Plan</strong>
                            <button type="button" class="btn btn-xs btn-danger pull-right js-remove-row">Remove</button>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="form-group col-md-4">
                                            <label class="control-label">ID</label>
                                            <input type="text" class="form-control js-product-id" name="store:products[products][${index}][id]" value="" />
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Name</label>
                                            <input type="text" class="form-control js-product-name" name="store:products[products][${index}][name]" value="" />
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Category</label>
                                            <select class="form-control js-product-category" name="store:products[products][${index}][category]">
                                                <option value="">Unassigned</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Price</label>
                                            <input type="text" class="form-control js-product-price" name="store:products[products][${index}][price]" value="" />
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Billing</label>
                                            <select class="form-control js-product-billing" name="store:products[products][${index}][billing]">
                                                <option value="mo">Monthly</option>
                                                <option value="yr">Yearly</option>
                                                <option value="hr">Hourly</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Call to Action</label>
                                            <input type="text" class="form-control" name="store:products[products][${index}][cta]" value="" />
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Tagline</label>
                                            <input type="text" class="form-control js-product-tag" name="store:products[products][${index}][tag]" value="" />
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Region</label>
                                            <input type="text" class="form-control js-product-region" name="store:products[products][${index}][region]" value="" />
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label class="control-label">Highlight</label>
                                            <div>
                                                <input type="hidden" name="store:products[products][${index}][highlight]" value="0" />
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" class="js-product-highlight" name="store:products[products][${index}][highlight]" value="1">
                                                    Highlight this plan
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-3">
                                            <label class="control-label">CPU Spec</label>
                                            <input type="text" class="form-control js-product-spec-cpu" name="store:products[products][${index}][specs][cpu]" value="" />
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label class="control-label">Memory Spec</label>
                                            <input type="text" class="form-control js-product-spec-memory" name="store:products[products][${index}][specs][memory]" value="" />
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label class="control-label">Disk Spec</label>
                                            <input type="text" class="form-control js-product-spec-disk" name="store:products[products][${index}][specs][disk]" value="" />
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label class="control-label">Bandwidth Spec</label>
                                            <input type="text" class="form-control js-product-spec-bandwidth" name="store:products[products][${index}][specs][bandwidth]" value="" />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label class="control-label">Features</label>
                                            <div class="js-product-features">
                                                <div class="input-group catalog-input-row">
                                                    <input type="text" class="form-control js-product-feature" name="store:products[products][${index}][features][]" value="" />
                                                    <span class="input-group-btn">
                                                        <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                                                    </span>
                                                </div>
                                            </div>
                                            <button type="button" class="btn btn-xs btn-default js-add-feature"><i class="fa fa-plus"></i> Add Feature</button>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label class="control-label">Badges</label>
                                            <div class="js-product-badges">
                                                <div class="input-group catalog-input-row">
                                                    <input type="text" class="form-control js-product-badge" name="store:products[products][${index}][badges][]" value="" />
                                                    <span class="input-group-btn">
                                                        <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                                                    </span>
                                                </div>
                                            </div>
                                            <button type="button" class="btn btn-xs btn-default js-add-badge"><i class="fa fa-plus"></i> Add Badge</button>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-2">
                                            <label class="control-label">vCPU</label>
                                            <input type="text" class="form-control" name="store:products[products][${index}][provisioning][cpu]" value="" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label class="control-label">Memory (MB)</label>
                                            <input type="text" class="form-control" name="store:products[products][${index}][provisioning][memory]" value="" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label class="control-label">Disk (MB)</label>
                                            <input type="text" class="form-control" name="store:products[products][${index}][provisioning][disk]" value="" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label class="control-label">Ports</label>
                                            <input type="text" class="form-control" name="store:products[products][${index}][provisioning][ports]" value="" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label class="control-label">Backups</label>
                                            <input type="text" class="form-control" name="store:products[products][${index}][provisioning][backups]" value="" />
                                        </div>
                                        <div class="form-group col-md-2">
                                            <label class="control-label">Databases</label>
                                            <input type="text" class="form-control" name="store:products[products][${index}][provisioning][databases]" value="" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="control-label">Storefront Preview</label>
                                    <div class="storefront-card-preview js-product-preview">
                                        <div class="clearfix">
                                            <strong class="js-preview-name">Plan Name</strong>
                                            <span class="pull-right js-preview-price">
                                                ${currencyCode} 0.00
                                                <small class="text-muted">/mo</small>
                                            </span>
                                        </div>
                                        <div class="text-muted js-preview-region"></div>
                                        <div class="badge-list js-preview-badges"></div>
                                        <p class="text-warning js-preview-tag"><small></small></p>
                                        <ul class="list-unstyled js-preview-specs">
                                            <li><strong>CPU:</strong> <span class="js-preview-spec-cpu"></span></li>
                                            <li><strong>Memory:</strong> <span class="js-preview-spec-memory"></span></li>
                                            <li><strong>Disk:</strong> <span class="js-preview-spec-disk"></span></li>
                                            <li><strong>Bandwidth:</strong> <span class="js-preview-spec-bandwidth"></span></li>
                                        </ul>
                                        <ul class="js-preview-features"></ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                $('.js-product-rows').append($row);
                refreshCategoryOptions();
                updateProductPreview($row);
            }

            $(document).on('click', '.js-add-category', function () {
                addCategoryRow();
            });

            $(document).on('click', '.js-add-product', function () {
                addProductRow();
            });

            $(document).on('click', '.js-remove-row', function () {
                $(this).closest('.catalog-entry').remove();
                refreshCategoryOptions();
            });

            $(document).on('click', '.js-add-feature', function () {
                var $container = $(this).siblings('.js-product-features');
                var inputName = $container.closest('.js-product-row').data('index');
                $container.append(`
                    <div class="input-group catalog-input-row">
                        <input type="text" class="form-control js-product-feature" name="store:products[products][${inputName}][features][]" value="" />
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                        </span>
                    </div>
                `);
            });

            $(document).on('click', '.js-add-badge', function () {
                var $container = $(this).siblings('.js-product-badges');
                var inputName = $container.closest('.js-product-row').data('index');
                $container.append(`
                    <div class="input-group catalog-input-row">
                        <input type="text" class="form-control js-product-badge" name="store:products[products][${inputName}][badges][]" value="" />
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-default js-remove-item"><i class="fa fa-times"></i></button>
                        </span>
                    </div>
                `);
            });

            $(document).on('click', '.js-remove-item', function () {
                $(this).closest('.catalog-input-row').remove();
            });

            $(document).on('input change', '.js-product-row input, .js-product-row select, .js-product-row textarea', function () {
                updateProductPreview($(this).closest('.js-product-row'));
            });

            $(document).on('input change', '.js-category-row input', function () {
                refreshCategoryOptions();
            });

            $('#store-products-import').on('change', function (event) {
                var file = event.target.files[0];
                if (!file) {
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#store-products-json').val(e.target.result);
                };
                reader.readAsText(file);
            });

            $('#store-products-export').on('click', function () {
                var content = $('#store-products-json').val();
                var blob = new Blob([content], { type: 'application/json' });
                var url = URL.createObjectURL(blob);
                var anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'store-catalog.json';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                URL.revokeObjectURL(url);
            });

            $('.js-product-row').each(function () {
                updateProductPreview($(this));
            });
        })();
    </script>
@endsection
