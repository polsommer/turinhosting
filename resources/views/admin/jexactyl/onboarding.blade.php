@extends('layouts.admin')
@include('partials/admin.jexactyl.nav', ['activeTab' => 'onboarding'])

@section('title')
    Admin Onboarding
@endsection

@section('content-header')
    <h1>Admin Onboarding<small>Guided setup for billing, branding, nodes, and store settings.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.index') }}">Jexactyl</a></li>
        <li class="active">Onboarding</li>
    </ol>
@endsection

@section('content')
    @yield('jexactyl::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <i class="fa fa-flag-checkered"></i> <h3 class="box-title">Setup Assistant</h3>
                </div>
                <div class="box-body">
                    <div id="admin-onboarding-root"></div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        window.AdminOnboardingData = {!! json_encode($onboardingData) !!};
    </script>
    {!! $asset->js('main.js') !!}
@endsection
