<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>{{ config('app.name', 'Jexactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0e4688">

        <script src="https://unpkg.com/feather-icons"></script>

        @include('layouts.scripts')

        @if(!empty($themeCssVariables))
            <style>
                :root {
                    {{ $themeCssVariables }}
                }
                body {
                    font-family: var(--jex-font-base, 'Rubik', sans-serif);
                    font-size: var(--jex-font-size, 16px);
                }
            </style>
        @endif
        @if(!empty(data_get($themeConfiguration ?? [], 'typography.fontImportUrl')))
            <link rel="stylesheet" href="{{ data_get($themeConfiguration, 'typography.fontImportUrl') }}">
        @endif

        <style>
            .admin-help-toggle {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 1030;
            }
            .admin-help-panel {
                position: fixed;
                bottom: 70px;
                right: 24px;
                width: 320px;
                max-height: 60vh;
                overflow-y: auto;
                background: #ffffff;
                border: 1px solid #d2d6de;
                border-radius: 4px;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
                display: none;
                z-index: 1030;
            }
            .admin-help-panel .admin-help-header {
                padding: 10px 12px;
                border-bottom: 1px solid #f4f4f4;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .admin-help-panel .admin-help-body {
                padding: 12px;
            }
        </style>

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            <!-- Ability to customize Jexactyl theme -->
            <link rel="stylesheet" href="/themes/{{ config('theme.admin', 'jexactyl') }}/css/{{ config('theme.admin', 'jexactyl') }}.css">

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
        @show
    </head>
    <body class="skin-blue fixed">
        <div class="wrapper">
            <header class="main-header">
                <a href="{{ route('index') }}" class="logo">
                    <img src="{{ config('app.logo') }}" width="48" height="48" />
                </a>
            </header>
            <aside class="main-sidebar">
                <section class="sidebar">
                    <ul class="sidebar-menu">
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.index') ?: 'active' }}">
                            <a href="{{ route('admin.index')}}">
                                <i data-feather="tool" style="margin-left: 12px;"></i> 
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.tickets') ?: 'active' }}">
                            <a href="{{ route('admin.tickets.index')}}">
                                <i data-feather="help-circle" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.api') ?: 'active' }}">
                            <a href="{{ route('admin.api.index')}}">
                                <i data-feather="git-branch" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.databases') ?: 'active' }}">
                            <a href="{{ route('admin.databases') }}">
                                <i data-feather="database" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.locations') ?: 'active' }}">
                            <a href="{{ route('admin.locations') }}">
                                <i data-feather="navigation" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nodes') ?: 'active' }}">
                            <a href="{{ route('admin.nodes') }}">
                                <i data-feather="layers" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.servers') ?: 'active' }}">
                            <a href="{{ route('admin.servers') }}">
                                <i data-feather="server" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.users') ?: 'active' }}">
                            <a href="{{ route('admin.users') }}">
                                <i data-feather="users" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.mounts') ?: 'active' }}">
                            <a href="{{ route('admin.mounts') }}">
                                <i data-feather="hard-drive" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
                            <a href="{{ route('admin.nests') }}">
                                <i data-feather="archive" style="margin-left: 12px;"></i>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
            <div class="content-wrapper">
                <section class="content-header">
                    @yield('content-header')
                </section>
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            @if (count($errors) > 0)
                                <div class="alert alert-danger">
                                    There was an error validating the data provided.<br><br>
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            @foreach (Alert::getMessages() as $type => $messages)
                                @foreach ($messages as $message)
                                    <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                        {!! $message !!}
                                    </div>
                                @endforeach
                            @endforeach
                        </div>
                    </div>
                    @yield('content')
                </section>
            </div>
        </div>
        <div id="admin-help-panel" class="admin-help-panel">
            <div class="admin-help-header">
                <strong id="admin-help-title">Admin Help</strong>
                <button type="button" class="btn btn-box-tool" id="admin-help-close">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="admin-help-body">
                <ul id="admin-help-list" class="list-unstyled"></ul>
                <p id="admin-help-empty" class="text-muted" style="display: none;">No tips available for this page yet.</p>
            </div>
        </div>
        <button type="button" id="admin-help-toggle" class="btn btn-info admin-help-toggle">
            <i class="fa fa-life-ring"></i> Help
        </button>
        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>

            <script>
                feather.replace()
            </script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                })
            </script>

            <script>
                $(function () {
                    const tipsByRoute = {
                        'admin.jexactyl.onboarding': {
                            title: 'Onboarding help',
                            items: [
                                'Complete each checklist item before marking a step done.',
                                'Use the buttons in each step to jump to the right configuration screen.',
                            ],
                        },
                        'admin.jexactyl.store': {
                            title: 'Storefront guidance',
                            items: [
                                'Enable Stripe or PayPal before turning on the storefront.',
                                'Define pricing so users can see what credits or resources cost.',
                            ],
                        },
                        'admin.jexactyl.mail': {
                            title: 'Mail configuration',
                            items: [
                                'SMTP is required to send receipts and alerts.',
                                'Use the test button to confirm delivery after saving settings.',
                            ],
                        },
                        'admin.jexactyl.appearance': {
                            title: 'Appearance tips',
                            items: [
                                'Publish a theme layout to update the UI immediately.',
                                'Preview changes before saving to avoid disrupting users.',
                            ],
                        },
                        'admin.nodes': {
                            title: 'Node setup',
                            items: [
                                'Add at least one node before creating servers.',
                                'Verify the node is online and has allocations available.',
                            ],
                        },
                        'admin.servers': {
                            title: 'Server management',
                            items: [
                                'Use locations and nodes to control where servers are deployed.',
                                'Double-check resource limits when provisioning new servers.',
                            ],
                        },
                    };

                    const currentRoute = '{{ Route::currentRouteName() }}';
                    const tips = tipsByRoute[currentRoute];
                    const $panel = $('#admin-help-panel');
                    const $list = $('#admin-help-list');
                    const $empty = $('#admin-help-empty');
                    const $title = $('#admin-help-title');
                    const $toggle = $('#admin-help-toggle');

                    $list.empty();

                    if (tips && tips.items.length) {
                        $title.text(tips.title);
                        tips.items.forEach((tip) => {
                            $('<li/>').text(tip).appendTo($list);
                        });
                        $empty.hide();
                        $toggle.show();
                    } else {
                        $title.text('Admin Help');
                        $empty.show();
                        $toggle.show();
                    }

                    $toggle.on('click', function () {
                        $panel.toggle();
                    });

                    $('#admin-help-close').on('click', function () {
                        $panel.hide();
                    });
                });
            </script>
        @show
    </body>
</html>
