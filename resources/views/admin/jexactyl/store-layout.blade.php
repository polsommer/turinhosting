@extends('layouts.admin')
@include('partials/admin.jexactyl.nav', ['activeTab' => 'store-layout'])

@section('title')
    Store Layout Builder
@endsection

@section('content-header')
    <h1>Store Layout<small>Configure the store page layout blocks.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Jexactyl</li>
    </ol>
@endsection

@section('content')
    @yield('jexactyl::nav')
    <div class="row">
        <div class="col-xs-12">
            <form action="{{ route('admin.jexactyl.store.layout') }}" method="POST">
                <div class="box box-info">
                    <div class="box-header with-border">
                        <i class="fa fa-columns"></i> <h3 class="box-title">Store Page Builder <small>Manage layout blocks for store pages.</small></h3>
                    </div>
                    <div class="box-body">
                        <p class="text-muted">
                            Define layout blocks for the storefront overview, resources, and balance pages. This JSON is stored as
                            <code>jexactyl::store:layout</code>. Leave the field empty to restore defaults.
                        </p>
                        <div class="form-group">
                            <label class="control-label">Layout JSON</label>
                            <textarea
                                name="store:layout:json"
                                class="form-control"
                                rows="18"
                            >{{ old('store:layout:json', $layout_json) }}</textarea>
                            <p class="text-muted"><small>Allowed block types: hero, banners, featured, catalog, resource-grid, resource-tips, resource-cta, balance-summary, earnings.</small></p>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        {!! method_field('PATCH') !!}
                        <button type="submit" class="btn btn-primary pull-right">Save Layout</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection
