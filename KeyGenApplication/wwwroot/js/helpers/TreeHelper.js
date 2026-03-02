const TreeHelper = (function () {
    return {
        getFlat: function (arr, idField, parentIdField, textField, allowOrphanAsRoot = false) {
            const lookup = {}, flat = [];

            // Lượt đầu tiên: tạo lookup và khởi tạo mảng children
            arr.forEach(item => {
                lookup[item[idField]] = { ...item, children: [] };
            });

            // Lượt thứ hai: xây dựng cấu trúc cây
            arr.forEach(item => {
                const parentId = item[parentIdField];
                if (parentId !== 0 && lookup[parentId]) {
                    lookup[parentId].children.push(lookup[item[idField]]);
                } else if (parentId === 0 || allowOrphanAsRoot) {
                    flat.push(lookup[item[idField]]);
                }
            });

            const flatten = (node, level = 0) => {
                node.level = level;
                const flatNode = {
                    id: node[idField],
                    text: node[textField],
                    parentID: node[parentIdField],
                    level: node.level,
                    children: node.children.map(child => ({
                        id: child[idField],
                        text: child[textField],
                        parentID: child[parentIdField],
                        level: child.level,
                        children: child.children
                    }))
                };
                flat.push(flatNode);
                node.children.forEach(child => flatten(child, level + 1));
            };

            const roots = flat.slice();
            flat.length = 0;

            roots.forEach(rootNode => flatten(rootNode));

            return flat;
        },
        getFlatV2: function (arr, idField, parentIdField, textField, iconField = 'icon', activeField = 'isActive', allowOrphanAsRoot = false) {
            const lookup = {}, flat = [];

            // Lượt đầu tiên: tạo lookup và khởi tạo mảng children
            arr.forEach(item => {
                lookup[item[idField]] = { ...item, children: [] };
            });

            // Lượt thứ hai: xây dựng cấu trúc cây
            arr.forEach(item => {
                const parentId = item[parentIdField];
                if (parentId !== 0 && lookup[parentId]) {
                    lookup[parentId].children.push(lookup[item[idField]]);
                } else if (parentId === 0 || allowOrphanAsRoot) {
                    flat.push(lookup[item[idField]]);
                }
            });

            const flatten = (node, level = 0) => {
                node.level = level;
                const flatNode = {
                    id: node[idField],
                    text: node[textField],
                    parentID: node[parentIdField],
                    level: node.level,
                    icon: node[iconField],        // Thêm icon
                    isActive: node[activeField],  // Thêm isActive
                    children: node.children.map(child => ({
                        id: child[idField],
                        text: child[textField],
                        parentID: child[parentIdField],
                        level: child.level,
                        icon: child[iconField],        // Thêm icon
                        isActive: child[activeField],  // Thêm isActive
                        children: child.children
                    }))
                };
                flat.push(flatNode);
                node.children.forEach(child => flatten(child, level + 1));
            };

            const roots = flat.slice();
            flat.length = 0;

            roots.forEach(rootNode => flatten(rootNode));

            return flat;
        },
        initializeSelect2: function (selector, arr, idField, textField, valueInit) {
            var selectData = arr.map(function (item) {
                return {
                    id: item[idField],
                    text: item[textField],
                    level: item.level
                };
            });

            function formatResult(node) {
                var $result = $('<span></span>');
                $result.css('padding-left', (node.level * 10) + 'px');

                // Thêm icon cho từng level
                var iconHtml = '';
                switch (node.level) {
                    case 0:
                        iconHtml = '<i class="fas fa-folder"></i> ';
                        break;
                    case 1:
                        iconHtml = '<i class="fas fa-folder-open"></i> ';
                        break;
                    case 2:
                        iconHtml = '<i class="far fa-folder"></i> ';
                        break;
                    case 3:
                        iconHtml = '<i class="far fa-folder-open"></i> ';
                        break;
                    case 4:
                        iconHtml = '<i class="fas fa-folder-plus"></i> ';
                        break;
                    default:
                        iconHtml = '<i class="fas fa-dot-circle"></i> ';
                }

                $result.html(iconHtml + node.text);
                if (node.level === 0) {
                    $result.css('font-weight', 'bold');
                }
                return $result;
            }

            function formatSelection(node) {
                return node.text;
            }

            $(selector).select2({
                data: selectData,
                placeholder: 'Chọn một tùy chọn',
                allowClear: true,
                templateResult: formatResult,
                templateSelection: formatSelection
            });

            $(selector).val(valueInit).trigger('change');
        },
        initializeJSTree: function (selector, data, options) {
            const result = [];
            const map = {};

            function getIcon(item, isOpened) {
                if (isOpened) {
                    switch (item.level) {
                        case 0:
                        case 1:
                            return "fas fa-folder-open";
                        case 2:
                        case 3:
                            return "far fa-folder-open";
                        case 4:
                            return "fas fa-folder-plus";
                        default:
                            return "fas fa-folder-open";
                    }
                } else {
                    switch (item.level) {
                        case 0:
                            return "fas fa-folder";
                        case 1:
                            return "fas fa-folder";
                        case 2:
                            return "far fa-folder";
                        case 3:
                            return "far fa-folder";
                        case 4:
                            return "fas fa-folder-plus";
                        default:
                            return "fas fa-folder";
                    }
                }
            }

            data.forEach(item => {
                map[item.id] = item;
                item.parent = item.parentID === 0 ? "#" : item.parentID;
                result.push({
                    id: item.id,
                    parent: item.parent,
                    text: item.text,
                    icon: getIcon(item, false),
                    state: {
                        opened: false
                    },
                    a_attr: { class: "fs-6 fw-bold text-gray-800" }
                });
            });

            const defaultOptions = {
                core: {
                    data: result,
                    check_callback: true,
                    themes: {
                        responsive: false
                    }
                },
                plugins: ['types']
            };

            const mergedOptions = $.extend(true, {}, defaultOptions, options);


            selector.jstree(mergedOptions);

            // Xử lý sự kiện mở/đóng nút
            selector.on('open_node.jstree close_node.jstree', function (e, data) {
                var node = data.node;
                var isOpened = e.type === 'open_node.jstree';
                selector.jstree(true).set_icon(node, getIcon(node.original, isOpened));
            });

            // Xử lý các callback và tính năng bổ sung
            if (typeof options.onClickCallback === 'function') {
                selector.on('select_node.jstree', function (e, data) {
                    options.onClickCallback(data.node);
                });
            }

            if (options.searchInputSelector) {
                $(options.searchInputSelector).on('keyup', function () {
                    var searchString = $(this).val();
                    selector.jstree('search', searchString);
                });
            }
        },
        initializeJSTreeV3: function (selector, data, options) {
            const result = [];
            const map = {};

            data.forEach(item => {
                map[item.id] = item;

                // Kiểm tra xem parent có tồn tại không
                const parentExists = item.parentID === 0 || data.some(d => d.id === item.parentID);

                // Nếu parent không tồn tại, set thành root node
                if (!parentExists) {
                    item.parent = "#";
                } else {
                    item.parent = item.parentID === 0 ? "#" : item.parentID;
                }

                // Xác định loại node (folder hoặc file)
                const hasChildren = data.some(child => child.parentID === item.id);
                const nodeType = hasChildren ? 'folder' : 'file';

                result.push({
                    id: item.id,
                    parent: item.parent,
                    text: item.text,
                    icon: false,
                    type: nodeType,
                    data: {
                        customIcon: item.icon,
                        nodeType: nodeType,
                        level: this.calculateNodeLevel(item, data) // Tính level của node
                    },
                    state: {
                        opened: item.forceOpen || false, // Chỉ mở khi được chỉ định
                        selected: item.isActive || false
                    },
                    original: item,
                    a_attr: {
                        class: `jstree-node-text fs-6 fw-bold ${item.isActive ? 'text-primary' : 'text-danger'}`,
                        title: item.text
                    }
                });
            });

            const defaultOptions = {
                core: {
                    data: result,
                    check_callback: true,
                    themes: {
                        responsive: false,
                        variant: 'large',
                        stripes: false, // Bật stripes cho dễ đọc
                        dots: true
                    }
                },
                types: {
                    default: { icon: false },
                    folder: { icon: false },
                    file: { icon: false }
                },
                plugins: ['types', 'search', 'state', 'wholerow'],
                search: {
                    case_sensitive: false,
                    show_only_matches: true,
                    show_only_matches_children: true
                },
                state: {
                    key: 'jstree-state'
                },
                // Tùy chỉnh options
                textMaxWidth: 600,
                iconSize: 'normal',
                maxDisplayLevel: null, // Giới hạn số cấp hiển thị
                lazyLoad: false, // Bật lazy loading
                showLevelIndicator: false, // Đã tắt badge cấp
                compactMode: false, // Chế độ compact
                virtualScroll: false, // Virtual scrolling cho performance
                expandCollapseAll: true, // Buttons expand/collapse all
                showNodeCount: true, // Hiển thị số lượng nodes
                breadcrumb: true, // Hiển thị breadcrumb cho node được chọn
                showSearch: true // Thêm search vào controls
            };

            const mergedOptions = $.extend(true, {}, defaultOptions, options);

            // Lấy các options tùy chỉnh
            const textMaxWidth = mergedOptions.textMaxWidth || 200;
            const iconSize = mergedOptions.iconSize || 'normal';
            const maxDisplayLevel = mergedOptions.maxDisplayLevel;
            const compactMode = mergedOptions.compactMode;
            const showLevelIndicator = mergedOptions.showLevelIndicator;

            // Tính toán kích thước icon
            let folderIconSize, fileIconSize, customIconSize, nodeSpacing;
            switch (iconSize) {
                case 'small':
                    folderIconSize = '12px';
                    fileIconSize = '11px';
                    customIconSize = '12px';
                    nodeSpacing = compactMode ? '1px' : '2px';
                    break;
                case 'large':
                    folderIconSize = '18px';
                    fileIconSize = '16px';
                    customIconSize = '18px';
                    nodeSpacing = compactMode ? '2px' : '4px';
                    break;
                default:
                    folderIconSize = '16px';
                    fileIconSize = '14px';
                    customIconSize = '16px';
                    nodeSpacing = compactMode ? '1px' : '2px';
            }

            // Thêm controls UI cho cây phức tạp
            this.addTreeControls(selector, mergedOptions);

            // Dynamic CSS với nhiều tùy chỉnh
            const styleId = `jstree-custom-styles-${selector.attr('id') || Date.now()}`;
            $(`#${styleId}`).remove(); // Remove existing styles

            $('head').append(`
<style id="${styleId}">
    /* Base styling */
    .jstree-default {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: ${compactMode ? '12px' : '14px'};
        line-height: ${compactMode ? '1.2' : '1.4'};
    }
    
    /* Icons */
    .jstree-folder-icon {
        color: #f39c12 !important;
        font-size: ${folderIconSize};
        margin-right: ${compactMode ? '4px' : '8px'};
        vertical-align: middle;
        transition: all 0.2s ease;
    }
    
    .jstree-folder-icon.open {
        color: #e67e22 !important;
    }
    
    .jstree-file-icon {
        color: #3498db;
        font-size: ${fileIconSize};
        margin-right: ${compactMode ? '4px' : '8px'};
        vertical-align: middle;
        transition: all 0.2s ease;
    }
    
    .custom-icon {
        font-size: ${customIconSize};
        margin-right: ${compactMode ? '4px' : '8px'};
        vertical-align: middle;
        transition: all 0.2s ease;
    }
    
    /* Text truncation */
    .jstree-node-text {
        max-width: ${textMaxWidth}px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
        transition: all 0.3s ease;
    }
    
    /* Node spacing */
    .jstree-node {
        margin: ${nodeSpacing} 0;
        position: relative;
    }
    
    /* Hover effects */
    .jstree-anchor:hover .jstree-node-text {
        color: #2c3e50 !important;
        background-color: #ecf0f1;
        border-radius: 4px;
        padding: ${compactMode ? '2px 4px' : '3px 6px'};
        max-width: none !important;
        white-space: normal !important;
        overflow: visible !important;
        text-overflow: unset !important;
        position: relative;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    
    .jstree-anchor:hover .jstree-folder-icon,
    .jstree-anchor:hover .jstree-file-icon,
    .jstree-anchor:hover .custom-icon {
        transform: scale(1.1);
    }
    
    /* Selected node */
    .jstree-clicked .jstree-node-text {
        background-color: #3498db !important;
        color: white !important;
        border-radius: 4px;
        padding: ${compactMode ? '2px 4px' : '3px 6px'};
        max-width: none !important;
        white-space: normal !important;
        overflow: visible !important;
        text-overflow: unset !important;
    }
    
    /* Tree controls */
    .jstree-controls {
        margin-bottom: 10px;
        padding: 8px;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #dee2e6;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }
    
    .jstree-control-btn {
        padding: 4px 8px;
        font-size: 12px;
        border: 1px solid #bdc3c7;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .jstree-control-btn:hover {
        background: #3498db;
        color: white;
        border-color: #3498db;
    }
    
    /* Search input */
    .jstree-search-container {
        position: relative;
        flex: 1;
        min-width: 200px;
        max-width: 300px;
    }
    
    .jstree-search-input {
        width: 100%;
        padding: 6px 12px 6px 35px;
        font-size: 12px;
        border: 1px solid #bdc3c7;
        border-radius: 4px;
        outline: none;
        transition: all 0.2s ease;
    }
    
    .jstree-search-input:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
    
    .jstree-search-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #7f8c8d;
        font-size: 12px;
        pointer-events: none;
    }
    
    .jstree-search-clear {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: #7f8c8d;
        font-size: 12px;
        cursor: pointer;
        padding: 2px;
        border-radius: 2px;
        transition: all 0.2s ease;
        display: none;
    }
    
    .jstree-search-clear:hover {
        background: #e74c3c;
        color: white;
    }
    
    .jstree-search-input:not(:placeholder-shown) + .jstree-search-icon + .jstree-search-clear {
        display: block;
    }
    
    .jstree-control-info {
        color: #7f8c8d;
        font-size: 12px;
        margin-left: auto;
        white-space: nowrap;
    }
    
    /* Breadcrumb */
    .jstree-breadcrumb {
        margin-top: 8px;
        padding: 6px;
        background: #fff;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        font-size: 12px;
        color: #6c757d;
    }
    
    .jstree-breadcrumb-item {
        display: inline;
    }
    
    .jstree-breadcrumb-item:not(:last-child):after {
        content: ' → ';
        color: #bdc3c7;
        margin: 0 4px;
    }
    
    /* Compact mode adjustments */
    ${compactMode ? `
    .jstree-default .jstree-node {
        min-height: 20px;
    }
    
    .jstree-default .jstree-anchor {
        height: 20px;
        line-height: 20px;
    }
    
    .jstree-default .jstree-icon {
        width: 16px;
        height: 16px;
    }
    ` : ''}
    
    /* Virtual scroll container */
    ${mergedOptions.virtualScroll ? `
    .jstree-container-ul {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    ` : ''}
    
    /* Hide deep levels if specified */
    ${maxDisplayLevel ? `
    .jstree-node[data-level] {
        display: ${maxDisplayLevel ? 'list-item' : 'none'};
    }
    
    ${Array.from({ length: maxDisplayLevel }, (_, i) =>
                `.jstree-node[data-level="${i + 1}"] { display: list-item; }`
            ).join('\n')}
    ` : ''}
    
    /* Responsive */
    @media (max-width: 768px) {
        .jstree-node-text {
            max-width: ${Math.max(textMaxWidth * 0.75, 100)}px;
        }
        
        .jstree-controls {
            flex-direction: column;
            align-items: stretch;
        }
        
        .jstree-search-container {
            min-width: auto;
            max-width: none;
        }
        
        .jstree-control-info {
            margin-left: 0;
            text-align: center;
        }
    }
</style>
`);

            selector.jstree(mergedOptions);

            // Initialize tree features
            this.initializeTreeFeatures(selector, mergedOptions);

            return selector;
        },
        clearTree: function (selector) {
            var treeInstance = $(selector).jstree(true);
            if (treeInstance) {
                // Deselect all nodes
                treeInstance.deselect_all();

                // Clear search if any
                treeInstance.clear_search();

                // Clear state cache
                treeInstance.clear_state();

                // Clear breadcrumb nếu có
                $(selector).siblings('.jstree-breadcrumb').empty();
            }
        },

        // Helper method to calculate node level
        calculateNodeLevel: function (node, data) {
            let level = 1;
            let currentParent = node.parentID;

            while (currentParent && currentParent !== 0) {
                const parent = data.find(item => item.id === currentParent);
                if (parent) {
                    currentParent = parent.parentID;
                    level++;
                } else {
                    break;
                }
            }

            return level;
        },

        // Add tree controls
        addTreeControls: function (selector, options) {
            if (!options.expandCollapseAll && !options.showNodeCount && !options.showSearch) return;

            const controlsHtml = `
<div class="jstree-controls">
    ${options.showSearch ? `
        <div class="jstree-search-container">
            <i class="fas fa-search jstree-search-icon"></i>
            <input type="text" class="jstree-search-input" placeholder="Tìm kiếm trong cây...">
            <i class="fas fa-times jstree-search-clear" title="Xóa tìm kiếm"></i>
        </div>
    ` : ''}
    ${options.expandCollapseAll ? `
        <button class="jstree-control-btn" data-action="expand-all">
            <i class="fas fa-plus-square"></i> Mở tất cả
        </button>
        <button class="jstree-control-btn" data-action="collapse-all">
            <i class="fas fa-minus-square"></i> Đóng tất cả
        </button>
        <button class="jstree-control-btn" data-action="expand-level">
            <i class="fas fa-layer-group"></i> Mở 2 cấp
        </button>
    ` : ''}
    ${options.showNodeCount ? `
        <span class="jstree-control-info">
            <i class="fas fa-info-circle"></i> 
            <span class="node-count">0</span> nodes
        </span>
    ` : ''}
</div>
`;

            selector.before(controlsHtml);

            // Add breadcrumb container
            if (options.breadcrumb) {
                selector.after('<div class="jstree-breadcrumb" style="display: none;"></div>');
            }
        },

        // Initialize tree features
        initializeTreeFeatures: function (selector, options) {
            const self = this;

            // Control button handlers
            selector.prev('.jstree-controls').on('click', '.jstree-control-btn', function () {
                const action = $(this).data('action');

                switch (action) {
                    case 'expand-all':
                        selector.jstree('open_all');
                        break;
                    case 'collapse-all':
                        selector.jstree('close_all');
                        break;
                    case 'expand-level':
                        self.expandToLevel(selector, 2);
                        break;
                }
            });

            // Search functionality
            if (options.showSearch) {
                const $searchInput = selector.prev('.jstree-controls').find('.jstree-search-input');
                const $clearBtn = selector.prev('.jstree-controls').find('.jstree-search-clear');
                let searchTimeout = null;

                // Search input handler
                $searchInput.on('input', function () {
                    if (searchTimeout) clearTimeout(searchTimeout);
                    const searchString = $(this).val().trim();

                    searchTimeout = setTimeout(function () {
                        if (searchString) {
                            selector.jstree('search', searchString);
                        } else {
                            selector.jstree('clear_search');
                        }
                        // Đảm bảo icons được setup lại sau search
                        setTimeout(() => {
                            self.setupNodeDisplay(selector, options);
                        }, 100);
                    }, 300);
                });

                // Clear search handler
                $clearBtn.on('click', function () {
                    $searchInput.val('').focus();
                    selector.jstree('clear_search');
                    // Đảm bảo icons được setup lại sau clear search
                    setTimeout(() => {
                        self.setupNodeDisplay(selector, options);
                    }, 100);
                });

                // ESC key to clear search
                $searchInput.on('keydown', function (e) {
                    if (e.key === 'Escape') {
                        $(this).val('');
                        selector.jstree('clear_search');
                        // Đảm bảo icons được setup lại sau clear search
                        setTimeout(() => {
                            self.setupNodeDisplay(selector, options);
                        }, 100);
                    }
                });
            }

            // Node count update
            if (options.showNodeCount) {
                selector.on('ready.jstree refresh.jstree', function () {
                    const nodeCount = selector.jstree(true).get_json('#', { flat: true }).length;
                    $('.node-count').text(nodeCount);
                });
            }

            // Breadcrumb update
            if (options.breadcrumb) {
                selector.on('select_node.jstree', function (e, data) {
                    self.updateBreadcrumb(selector, data.node);
                });
            }

            // Setup icons (không có level indicators)
            selector.on('after_open.jstree after_close.jstree ready.jstree search.jstree clear_search.jstree', function () {
                self.setupNodeDisplay(selector, options);
            });

            // Icon state management
            selector.on('open_node.jstree', function (e, data) {
                const $anchor = $('#' + data.node.id).find('> a.jstree-anchor');
                const $folderIcon = $anchor.find('.jstree-folder-icon');
                if ($folderIcon.length > 0 && !data.node.data.customIcon) {
                    $folderIcon.removeClass('fas fa-folder').addClass('fas fa-folder-open open');
                }
            });

            selector.on('close_node.jstree', function (e, data) {
                const $anchor = $('#' + data.node.id).find('> a.jstree-anchor');
                const $folderIcon = $anchor.find('.jstree-folder-icon');
                if ($folderIcon.length > 0 && !data.node.data.customIcon) {
                    $folderIcon.removeClass('fas fa-folder-open open').addClass('fas fa-folder');
                }
            });

            // Event handlers từ code cũ
            if (typeof options.onClickCallback === 'function') {
                selector.on('select_node.jstree', function (e, data) {
                    options.onClickCallback(data.node);
                });
            }

            // Legacy search input support (backward compatibility)
            if (options.searchInputSelector) {
                let searchTimeout = null;
                $(options.searchInputSelector).on('keyup', function () {
                    if (searchTimeout) clearTimeout(searchTimeout);
                    const searchString = $(this).val();
                    searchTimeout = setTimeout(function () {
                        selector.jstree('search', searchString);
                        // Đảm bảo icons được setup lại sau search
                        setTimeout(() => {
                            self.setupNodeDisplay(selector, options);
                        }, 100);
                    }, 250);
                });

                $(options.searchInputSelector).on('keydown', function (e) {
                    if (e.key === 'Escape') {
                        $(this).val('');
                        selector.jstree('clear_search');
                        // Đảm bảo icons được setup lại sau clear search
                        setTimeout(() => {
                            self.setupNodeDisplay(selector, options);
                        }, 100);
                    }
                });
            }

            if (typeof options.onDoubleClickCallback === 'function') {
                selector.on('dblclick.jstree', function (e) {
                    var node = $(e.target).closest('.jstree-node');
                    var nodeId = node.attr('id');
                    var nodeObj = selector.jstree(true).get_node(nodeId);
                    options.onDoubleClickCallback(nodeObj);
                });
            }

            if (typeof options.onRightClickCallback === 'function') {
                selector.on('contextmenu.jstree', function (e) {
                    e.preventDefault();
                    var node = $(e.target).closest('.jstree-node');
                    var nodeId = node.attr('id');
                    var nodeObj = selector.jstree(true).get_node(nodeId);
                    options.onRightClickCallback(nodeObj, e);
                });
            }

            if (typeof options.onHoverCallback === 'function') {
                selector.on('hover_node.jstree', function (e, data) {
                    options.onHoverCallback(data.node);
                });
            }
        },

        // Setup node display with icons (không có level indicators)
        setupNodeDisplay: function (selector, options) {
            selector.find('.jstree-node').each(function () {
                const nodeId = $(this).attr('id');
                const node = selector.jstree(true).get_node(nodeId);
                const $anchor = $(this).find('> a.jstree-anchor');

                // Clear existing icons
                $anchor.find('.jstree-themeicon, .custom-icon, .jstree-folder-icon, .jstree-file-icon').remove();

                // Add icons
                if (node.data && node.data.customIcon) {
                    $anchor.prepend(`<span class="custom-icon">${node.data.customIcon}</span>`);
                } else {
                    if (node.data && node.data.nodeType === 'folder') {
                        const isOpen = node.state && node.state.opened;
                        const folderIcon = isOpen ?
                            '<i class="fas fa-folder-open jstree-folder-icon open"></i>' :
                            '<i class="fas fa-folder jstree-folder-icon"></i>';
                        $anchor.prepend(folderIcon);
                    } else {
                        $anchor.prepend('<i class="fas fa-file jstree-file-icon"></i>');
                    }
                }
            });
        },

        // Expand to specific level
        expandToLevel: function (selector, level) {
            selector.jstree('close_all');
            selector.find('.jstree-node').each(function () {
                const nodeLevel = parseInt($(this).attr('data-level') || '1');
                if (nodeLevel <= level) {
                    const nodeId = $(this).attr('id');
                    selector.jstree('open_node', nodeId);
                }
            });
        },

        // Update breadcrumb
        updateBreadcrumb: function (selector, node) {
            const breadcrumbContainer = selector.next('.jstree-breadcrumb');
            if (!breadcrumbContainer.length) return;

            const path = [];
            let currentNode = node;

            while (currentNode && currentNode.id !== '#') {
                path.unshift(currentNode.text);
                currentNode = selector.jstree(true).get_node(currentNode.parent);
            }

            if (path.length > 0) {
                const breadcrumbHtml = path.map(text =>
                    `<span class="jstree-breadcrumb-item">${text}</span>`
                ).join('');

                breadcrumbContainer.html(`<i class="fas fa-map-marker-alt"></i> ${breadcrumbHtml}`).show();
            } else {
                breadcrumbContainer.hide();
            }
        }

    };
})()
