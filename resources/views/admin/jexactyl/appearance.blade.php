@extends('layouts.admin')
@include('partials/admin.jexactyl.nav', ['activeTab' => 'appearance'])

@section('title')
    Theme Settings
@endsection

@section('content-header')
    <h1>Jexactyl Appearance<small>Configure the theme for Jexactyl.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Jexactyl</li>
    </ol>
@endsection

@section('content')
    @yield('jexactyl::nav')
    <div class="row">
        <div class="col-xs-12">
            <form action="{{ route('admin.jexactyl.appearance') }}" method="POST">
            @if ($themePreviewActive)
                <div class="callout callout-warning">
                    <h4>Preview Mode Enabled</h4>
                    <p>Changes are currently in preview for your session. Publish to make them live for all users.</p>
                </div>
            @endif
            <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">General Settings <small>Configure general appearance settings.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Panel Name</label>
                                <div>
                                    <input type="text" class="form-control" name="app:name" value="{{ old('app:name', config('app.name')) }}" />
                                    <p class="text-muted"><small>This is the name that is used throughout the panel and in emails sent to clients.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Panel Logo</label>
                                <div>
                                    <input type="text" class="form-control" name="app:logo" value="{{ $logo }}" />
                                    <p class="text-muted"><small>The logo which is used for the Panel&apos;s frontend.</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Theme Settings <small>The selection for Jexactyl's theme.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Admin Theme</label>
                                <div>
                                    <select name="theme:admin" class="form-control">
                                        <option @if ($admin == 'jexactyl') selected @endif value="jexactyl">Default Theme</option>
                                        <option @if ($admin == 'dark') selected @endif value="dark">Dark Theme</option>
                                        <option @if ($admin == 'light') selected @endif value="light">Light Theme</option>
                                        <option @if ($admin == 'blue') selected @endif value="blue">Blue Theme</option>
                                        <option @if ($admin == 'minecraft') selected @endif value="minecraft">Minecraft&#8482; Theme</option>
                                    </select>
                                    <p class="text-muted"><small>Determines the theme for Jexactyl's Admin UI.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Base Client Theme</label>
                                <div>
                                    <select name="theme[mode]" class="form-control">
                                        @php($baseMode = old('theme.mode', data_get($themeConfiguration ?? [], 'mode', 'brand')))
                                        <option value="brand" @if ($baseMode === 'brand') selected @endif>Brand</option>
                                        <option value="dark" @if ($baseMode === 'dark') selected @endif>Dark</option>
                                        <option value="light" @if ($baseMode === 'light') selected @endif>Light</option>
                                    </select>
                                    <p class="text-muted"><small>Sets the default client theme tokens (brand, dark, or light).</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Client Background</label>
                                <div>
                                    <input type="text" class="form-control" name="theme:user:background" value="{{ old('theme:user:background', config('theme.user.background')) }}" />
                                    <p class="text-muted"><small>If you enter a URL here, the client pages will have your image as the page background.</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Theme Editor <small>Customize colors, typography, layout, and component styles.</small></h3>
                    </div>
                    <div class="box-body">
                        @php($theme = $themeConfiguration ?? [])
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label class="control-label">Primary Color</label>
                                <input type="color" class="form-control" name="theme[colors][primary]" value="{{ old('theme.colors.primary', data_get($theme, 'colors.primary')) }}" />
                            </div>
                            <div class="form-group col-md-3">
                                <label class="control-label">Primary Hover</label>
                                <input type="color" class="form-control" name="theme[colors][primaryHover]" value="{{ old('theme.colors.primaryHover', data_get($theme, 'colors.primaryHover')) }}" />
                            </div>
                            <div class="form-group col-md-3">
                                <label class="control-label">Primary Text</label>
                                <input type="color" class="form-control" name="theme[colors][primaryText]" value="{{ old('theme.colors.primaryText', data_get($theme, 'colors.primaryText')) }}" />
                            </div>
                            <div class="form-group col-md-3">
                                <label class="control-label">Accent Color</label>
                                <input type="color" class="form-control" name="theme[colors][accent]" value="{{ old('theme.colors.accent', data_get($theme, 'colors.accent')) }}" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label class="control-label">Background Color</label>
                                <input type="color" class="form-control" name="theme[colors][background]" value="{{ old('theme.colors.background', data_get($theme, 'colors.background')) }}" />
                            </div>
                            <div class="form-group col-md-3">
                                <label class="control-label">Surface Color</label>
                                <input type="color" class="form-control" name="theme[colors][surface]" value="{{ old('theme.colors.surface', data_get($theme, 'colors.surface')) }}" />
                            </div>
                            <div class="form-group col-md-3">
                                <label class="control-label">Text Color</label>
                                <input type="color" class="form-control" name="theme[colors][text]" value="{{ old('theme.colors.text', data_get($theme, 'colors.text')) }}" />
                            </div>
                            <div class="form-group col-md-3">
                                <label class="control-label">Muted Text</label>
                                <input type="color" class="form-control" name="theme[colors][muted]" value="{{ old('theme.colors.muted', data_get($theme, 'colors.muted')) }}" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label class="control-label">Border Color</label>
                                <input type="color" class="form-control" name="theme[colors][border]" value="{{ old('theme.colors.border', data_get($theme, 'colors.border')) }}" />
                            </div>
                            <div class="form-group col-md-9">
                                <p class="text-muted" style="margin-top: 28px;"><small>Colors update button, card, and text styles across the panel.</small></p>
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Base Font Family</label>
                                <input type="text" class="form-control" name="theme[typography][fontFamilyBase]" value="{{ old('theme.typography.fontFamilyBase', data_get($theme, 'typography.fontFamilyBase')) }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Heading Font Family</label>
                                <input type="text" class="form-control" name="theme[typography][fontFamilyHeading]" value="{{ old('theme.typography.fontFamilyHeading', data_get($theme, 'typography.fontFamilyHeading')) }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Mono Font Family</label>
                                <input type="text" class="form-control" name="theme[typography][fontFamilyMono]" value="{{ old('theme.typography.fontFamilyMono', data_get($theme, 'typography.fontFamilyMono')) }}" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Base Font Size</label>
                                <input type="text" class="form-control" name="theme[typography][baseSize]" value="{{ old('theme.typography.baseSize', data_get($theme, 'typography.baseSize')) }}" />
                            </div>
                            <div class="form-group col-md-8">
                                <label class="control-label">Font Import URL</label>
                                <input type="text" class="form-control" name="theme[typography][fontImportUrl]" value="{{ old('theme.typography.fontImportUrl', data_get($theme, 'typography.fontImportUrl')) }}" />
                                <p class="text-muted"><small>Optional URL to load custom fonts (e.g. a Google Fonts stylesheet).</small></p>
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Content Max Width</label>
                                <input type="text" class="form-control" name="theme[layout][maxWidth]" value="{{ old('theme.layout.maxWidth', data_get($theme, 'layout.maxWidth')) }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Content Padding</label>
                                <input type="text" class="form-control" name="theme[layout][padding]" value="{{ old('theme.layout.padding', data_get($theme, 'layout.padding')) }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Section Gap</label>
                                <input type="text" class="form-control" name="theme[layout][contentGap]" value="{{ old('theme.layout.contentGap', data_get($theme, 'layout.contentGap')) }}" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Button Radius</label>
                                <input type="text" class="form-control" name="theme[components][buttonRadius]" value="{{ old('theme.components.buttonRadius', data_get($theme, 'components.buttonRadius')) }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Card Radius</label>
                                <input type="text" class="form-control" name="theme[components][cardRadius]" value="{{ old('theme.components.cardRadius', data_get($theme, 'components.cardRadius')) }}" />
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Input Radius</label>
                                <input type="text" class="form-control" name="theme[components][inputRadius]" value="{{ old('theme.components.inputRadius', data_get($theme, 'components.inputRadius')) }}" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Focus Ring Color</label>
                                <input type="color" class="form-control" name="theme[components][focusRingColor]" value="{{ old('theme.components.focusRingColor', data_get($theme, 'components.focusRingColor')) }}" />
                            </div>
                            <div class="form-group col-md-8">
                                <label class="control-label">Layout Blocks</label>
                                <div style="margin-top: 8px;">
                                    <label style="margin-right: 16px;">
                                        <input type="hidden" name="theme[blocks][showHeader]" value="0" />
                                        <input type="checkbox" name="theme[blocks][showHeader]" value="1" @if (old('theme.blocks.showHeader', data_get($theme, 'blocks.showHeader'))) checked @endif />
                                        Show header
                                    </label>
                                    <label style="margin-right: 16px;">
                                        <input type="hidden" name="theme[blocks][showSidebar]" value="0" />
                                        <input type="checkbox" name="theme[blocks][showSidebar]" value="1" @if (old('theme.blocks.showSidebar', data_get($theme, 'blocks.showSidebar'))) checked @endif />
                                        Show sidebar
                                    </label>
                                    <label>
                                        <input type="hidden" name="theme[blocks][showFooter]" value="0" />
                                        <input type="checkbox" name="theme[blocks][showFooter]" value="1" @if (old('theme.blocks.showFooter', data_get($theme, 'blocks.showFooter'))) checked @endif />
                                        Show footer
                                    </label>
                                </div>
                                <p class="text-muted"><small>Control visibility of layout blocks in the client UI.</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                {!! csrf_field() !!}
                <input type="hidden" name="_method" value="PATCH" />
                <button type="submit" class="btn btn-primary pull-right" style="margin-left: 8px;">Publish Changes</button>
                <button type="submit" name="theme_action" value="preview" class="btn btn-warning pull-right" style="margin-left: 8px;">Preview Changes</button>
                @if ($themePreviewActive)
                    <button type="submit" name="theme_action" value="discard" class="btn btn-default pull-right">Discard Preview</button>
                @endif
            </form>
        </div>
    </div>
@endsection
