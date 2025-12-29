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

            .admin-command-bar {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                margin-bottom: 16px;
                background: var(--admin-surface, #1f2933);
                border: 1px solid var(--admin-border, #2a3440);
                border-radius: 16px;
                box-shadow: 0 14px 30px rgba(15, 23, 42, 0.35);
            }

            .admin-command-main {
                min-width: 220px;
            }

            .admin-command-title {
                font-size: 18px;
                font-weight: 600;
                color: var(--admin-text, #f8fafc);
            }

            .admin-command-subtitle {
                font-size: 13px;
                color: var(--admin-muted, #9aa5b1);
                margin-top: 4px;
            }

            .admin-command-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                align-items: center;
                justify-content: flex-end;
            }

            .admin-command-search {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 14px;
                background: var(--admin-input-bg, #0b1220);
                border: 1px solid var(--admin-border, #2a3440);
                border-radius: 999px;
                min-width: 240px;
            }

            .admin-command-search i {
                color: var(--admin-muted, #9aa5b1);
            }

            .admin-command-search input {
                width: 100%;
                border: none;
                background: transparent;
                color: var(--admin-text, #e5e7eb);
                outline: none;
            }

            .admin-command-buttons .btn {
                border-radius: 999px;
                padding: 6px 14px;
            }

            .admin-command-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 16px;
                margin-bottom: 16px;
            }

            .admin-command-panel {
                background: var(--admin-surface-alt, #111827);
                border: 1px solid var(--admin-border, #2a3440);
                border-radius: 14px;
                padding: 14px 16px;
                box-shadow: 0 10px 20px rgba(15, 23, 42, 0.25);
            }

            .admin-command-panel-header {
                font-size: 13px;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: var(--admin-muted, #9aa5b1);
                margin-bottom: 10px;
            }

            .admin-command-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .admin-command-item {
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding: 8px 0;
                border-bottom: 1px solid var(--admin-border, #2a3440);
            }

            .admin-command-item:last-child {
                border-bottom: none;
            }

            .admin-command-item a {
                color: var(--admin-link, #38bdf8);
                font-weight: 600;
            }

            .admin-command-item span {
                font-size: 12px;
                color: var(--admin-muted, #9aa5b1);
            }

            .admin-command-results {
                display: none;
                margin-bottom: 16px;
            }

            .admin-command-results.is-visible {
                display: block;
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
                    <div class="admin-command-bar">
                        <div class="admin-command-main">
                            <div class="admin-command-title">Admin Command Center</div>
                            <div class="admin-command-subtitle">Modern shortcuts, smart guidance, and on-the-go configuration controls.</div>
                        </div>
                        <div class="admin-command-actions">
                            <label class="admin-command-search" for="admin-command-input">
                                <i class="fa fa-search"></i>
                                <input id="admin-command-input" type="text" placeholder="Search admin actions..." autocomplete="off">
                            </label>
                            <div class="admin-command-buttons">
                                <a class="btn btn-primary btn-sm" href="{{ route('admin.index') }}">Overview</a>
                                <button type="button" class="btn btn-default btn-sm" id="admin-command-help">Tips</button>
                            </div>
                        </div>
                    </div>
                    <div class="admin-command-results admin-command-panel" id="admin-command-results-panel">
                        <div class="admin-command-panel-header">Search Results</div>
                        <ul class="admin-command-list" id="admin-command-results"></ul>
                        <p class="text-muted" id="admin-command-results-empty" style="display: none;">No matches. Try searching for “mail”, “theme”, or “nodes”.</p>
                    </div>
                    <div class="admin-command-grid">
                        <div class="admin-command-panel">
                            <div class="admin-command-panel-header">Quick Configure</div>
                            <ul class="admin-command-list" id="admin-command-quick"></ul>
                        </div>
                        <div class="admin-command-panel">
                            <div class="admin-command-panel-header">Recent Pages</div>
                            <ul class="admin-command-list" id="admin-command-recent"></ul>
                            <p class="text-muted" id="admin-command-recent-empty">No recent admin pages yet.</p>
                        </div>
                        <div class="admin-command-panel">
                            <div class="admin-command-panel-header">Smart Suggestions</div>
                            <ul class="admin-command-list" id="admin-command-suggestions"></ul>
                        </div>
                    </div>
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
                    const quickActions = [
                        {
                            label: 'Onboarding checklist',
                            description: 'Track setup progress and next steps.',
                            href: '{{ route('admin.jexactyl.onboarding') }}',
                            keywords: 'setup onboarding checklist',
                        },
                        {
                            label: 'Appearance & branding',
                            description: 'Update logos, colors, and theme.',
                            href: '{{ route('admin.jexactyl.appearance') }}',
                            keywords: 'theme branding appearance',
                        },
                        {
                            label: 'Mail configuration',
                            description: 'Manage SMTP delivery settings.',
                            href: '{{ route('admin.jexactyl.mail') }}',
                            keywords: 'email mail smtp',
                        },
                        {
                            label: 'Storefront controls',
                            description: 'Manage billing, pricing, and layout.',
                            href: '{{ route('admin.jexactyl.store') }}',
                            keywords: 'store billing pricing',
                        },
                        {
                            label: 'Registration & approvals',
                            description: 'Control account creation flow.',
                            href: '{{ route('admin.jexactyl.registration') }}',
                            keywords: 'registration approvals users',
                        },
                        {
                            label: 'Server settings',
                            description: 'Set defaults and global limits.',
                            href: '{{ route('admin.jexactyl.server') }}',
                            keywords: 'server limits defaults',
                        },
                        {
                            label: 'Alerts & announcements',
                            description: 'Push announcements instantly.',
                            href: '{{ route('admin.jexactyl.alerts') }}',
                            keywords: 'alerts announcements',
                        },
                    ];

                    const suggestionsByRoute = {
                        'admin.jexactyl.onboarding': [
                            {
                                label: 'Configure mail delivery',
                                description: 'Finish mail setup to deliver receipts.',
                                href: '{{ route('admin.jexactyl.mail') }}',
                                keywords: 'mail smtp',
                            },
                            {
                                label: 'Update theme branding',
                                description: 'Set a logo and admin theme.',
                                href: '{{ route('admin.jexactyl.appearance') }}',
                                keywords: 'branding appearance theme',
                            },
                        ],
                        'admin.jexactyl.mail': [
                            {
                                label: 'Send a test message',
                                description: 'Verify SMTP is working after saving.',
                                href: '{{ route('admin.jexactyl.mail') }}',
                                keywords: 'test mail smtp',
                            },
                            {
                                label: 'Enable storefront receipts',
                                description: 'Make sure billing emails are enabled.',
                                href: '{{ route('admin.jexactyl.store') }}',
                                keywords: 'store billing mail',
                            },
                        ],
                        'admin.nodes': [
                            {
                                label: 'Add allocations',
                                description: 'Ensure nodes have free ports.',
                                href: '{{ route('admin.nodes') }}',
                                keywords: 'allocations ports nodes',
                            },
                            {
                                label: 'Provision new servers',
                                description: 'Create servers once nodes are ready.',
                                href: '{{ route('admin.servers') }}',
                                keywords: 'servers provision',
                            },
                        ],
                        'admin.servers': [
                            {
                                label: 'Review node capacity',
                                description: 'Balance load across locations.',
                                href: '{{ route('admin.nodes') }}',
                                keywords: 'nodes capacity',
                            },
                            {
                                label: 'Check user resources',
                                description: 'Adjust allocations per account.',
                                href: '{{ route('admin.users') }}',
                                keywords: 'users resources',
                            },
                        ],
                        default: [
                            {
                                label: 'Review onboarding status',
                                description: 'Keep the setup checklist green.',
                                href: '{{ route('admin.jexactyl.onboarding') }}',
                                keywords: 'onboarding checklist',
                            },
                            {
                                label: 'Tune advanced settings',
                                description: 'Adjust performance defaults.',
                                href: '{{ route('admin.jexactyl.advanced') }}',
                                keywords: 'advanced performance',
                            },
                        ],
                    };

                    const routeLabels = {
                        'admin.index': 'Admin overview',
                        'admin.tickets.index': 'Ticket inbox',
                        'admin.api.index': 'Application API',
                        'admin.databases': 'Database hosts',
                        'admin.locations': 'Locations',
                        'admin.nodes': 'Nodes overview',
                        'admin.servers': 'Servers overview',
                        'admin.users': 'Users directory',
                        'admin.mounts': 'Mounts overview',
                        'admin.nests': 'Nests library',
                        'admin.jexactyl.onboarding': 'Onboarding checklist',
                        'admin.jexactyl.appearance': 'Appearance & branding',
                        'admin.jexactyl.mail': 'Mail configuration',
                        'admin.jexactyl.store': 'Storefront controls',
                        'admin.jexactyl.registration': 'Registration & approvals',
                        'admin.jexactyl.server': 'Server settings',
                        'admin.jexactyl.alerts': 'Alerts & announcements',
                    };

                    const $quickList = $('#admin-command-quick');
                    const $recentList = $('#admin-command-recent');
                    const $recentEmpty = $('#admin-command-recent-empty');
                    const $suggestionList = $('#admin-command-suggestions');
                    const $resultsPanel = $('#admin-command-results-panel');
                    const $resultsList = $('#admin-command-results');
                    const $resultsEmpty = $('#admin-command-results-empty');
                    const $searchInput = $('#admin-command-input');

                    const renderList = ($target, items) => {
                        $target.empty();
                        items.forEach((item) => {
                            const $item = $('<li/>').addClass('admin-command-item');
                            $('<a/>').attr('href', item.href).text(item.label).appendTo($item);
                            if (item.description) {
                                $('<span/>').text(item.description).appendTo($item);
                            }
                            $target.append($item);
                        });
                    };

                    renderList($quickList, quickActions);

                    const currentRoute = '{{ Route::currentRouteName() }}';
                    const suggestions = suggestionsByRoute[currentRoute] || suggestionsByRoute.default;
                    renderList($suggestionList, suggestions);

                    const storageKey = 'adminRecentPages';
                    const maxRecent = 5;
                    let recentPages = [];

                    try {
                        recentPages = JSON.parse(localStorage.getItem(storageKey)) || [];
                    } catch (error) {
                        recentPages = [];
                    }

                    const currentLabel = routeLabels[currentRoute];
                    if (currentLabel) {
                        const currentHref = window.location.pathname;
                        recentPages = recentPages.filter((item) => item.href !== currentHref);
                        recentPages.unshift({
                            label: currentLabel,
                            href: currentHref,
                            description: 'Visited just now',
                            timestamp: Date.now(),
                        });
                        recentPages = recentPages.slice(0, maxRecent);
                        localStorage.setItem(storageKey, JSON.stringify(recentPages));
                    }

                    if (recentPages.length) {
                        $recentEmpty.hide();
                        renderList($recentList, recentPages);
                    } else {
                        $recentEmpty.show();
                    }

                    const combineSearchItems = () => {
                        const combined = [...quickActions, ...recentPages, ...suggestions];
                        const unique = new Map();
                        combined.forEach((item) => {
                            if (!unique.has(item.href)) {
                                unique.set(item.href, item);
                            }
                        });
                        return Array.from(unique.values());
                    };

                    const updateResults = (query) => {
                        const trimmed = query.trim().toLowerCase();
                        if (!trimmed) {
                            $resultsPanel.removeClass('is-visible');
                            return;
                        }

                        const items = combineSearchItems().filter((item) => {
                            const haystack = `${item.label} ${item.description || ''} ${item.keywords || ''}`.toLowerCase();
                            return haystack.includes(trimmed);
                        });

                        renderList($resultsList, items);
                        if (items.length) {
                            $resultsEmpty.hide();
                        } else {
                            $resultsEmpty.show();
                        }
                        $resultsPanel.addClass('is-visible');
                    };

                    $searchInput.on('input', function () {
                        updateResults($(this).val());
                    });

                    $(document).on('keydown', function (event) {
                        if (event.key === '/' && !$searchInput.is(':focus')) {
                            event.preventDefault();
                            $searchInput.focus();
                        }
                    });

                    $('#admin-command-help').on('click', function () {
                        $('#admin-help-panel').toggle();
                    });
                });
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
