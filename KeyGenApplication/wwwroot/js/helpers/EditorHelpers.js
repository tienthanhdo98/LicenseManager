//const EditorHelpers = (function () {
//    let editors = {};
//    let currentContent = {};

//    // Hàm deep merge
//    function deepMerge(target, source) {
//        if (Array.isArray(source)) {
//            return source.map((item, index) => {
//                if (typeof item === 'object' && item !== null) {
//                    return deepMerge(Array.isArray(target) ? target[index] || {} : {}, item);
//                }
//                return item;
//            });
//        }

//        if (source && typeof source === 'object' && !Array.isArray(source)) {
//            for (const key in source) {
//                if (source.hasOwnProperty(key)) {
//                    if (source[key] instanceof Object && !(source[key] instanceof Function) && key in target) {
//                        target[key] = deepMerge(target[key], source[key]);
//                    } else {
//                        target[key] = source[key];
//                    }
//                }
//            }
//        } else {
//            return source;
//        }

//        return target;
//    }

//    // Hàm khởi tạo editor đã được cập nhật
//    function initializeEditor(config) {
//        const { id, imageUploadUrl, fileUploadUrl, ...customConfig } = config;

//        if (!editors[id]) {
//            const editorConfig = { ...defaultConfig, ...customConfig, holder: id };

//            const uploadByFile = function (file) {
//                return new Promise((resolve, reject) => {
//                    AjaxHelpers.uploadFile(
//                        imageUploadUrl,
//                        file,
//                        'file',
//                        function (response) {
//                            if (response.Code === 1) {
//                                console.log(response.FilePath);
//                                resolve({
//                                    success: 1,
//                                    file: {
//                                        url: response.FilePath
//                                    }
//                                });
//                            } else {
//                                reject(new Error(response.Message || 'Upload failed'));
//                            }
//                        },
//                        function (xhr, status, error) {
//                            console.error('Error:', error);
//                            reject(error);
//                        }
//                    );
//                });
//            };

//            editorConfig.tools.image.config.uploader.uploadByFile = uploadByFile;
//            editorConfig.tools.carousel.config.uploader.uploadByFile = uploadByFile;

//            editorConfig.tools.attaches.config.endpoint = fileUploadUrl;

//            const originalOnReady = editorConfig.onReady || (() => { });
//            editorConfig.onReady = () => {
//                new DragDrop(editors[id]);
//                new Undo({ editor: editors[id] });
//                originalOnReady();
//            };

//            editors[id] = new EditorJS(editorConfig);
//        }
//        return editors[id];
//    }

//    // Cấu hình mặc định
//    const defaultConfig = {
//        tools: {
//            Color: {
//                class: window.ColorPlugin,
//                config: {
//                    colorCollections: ['#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF'],
//                    defaultColor: '#FF1300',
//                    type: 'text',
//                    customPicker: true
//                }
//            },
//            Marker: {
//                class: window.ColorPlugin,
//                config: {
//                    defaultColor: '#FFBF00',
//                    type: 'marker',
//                    icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
//                }
//            },
//            strikethrough: Strikethrough,
//            header: {
//                class: Header,
//                tunes: ['alignmentTune'],
//            },
//            list: {
//                class: List,
//                inlineToolbar: true,
//                tunes: ['alignmentTune']
//            },
//            checklist: {
//                class: Checklist,
//                inlineToolbar: true
//            },
//            quote: {
//                class: Quote,
//                inlineToolbar: true,
//                config: {
//                    quotePlaceholder: 'Enter a quote',
//                    captionPlaceholder: 'Quote\'s author'
//                },
//                tunes: ['alignmentTune']
//            },
//            embed: {
//                class: Embed,
//                config: {
//                    services: {
//                        youtube: true,
//                        coub: true
//                    }
//                }
//            },
//            table: {
//                class: Table,
//                inlineToolbar: true,
//                tunes: ['alignmentTune']
//            },
//            warning: {
//                class: Warning,
//                inlineToolbar: true,
//                shortcut: 'CMD+SHIFT+W',
//                config: {
//                    titlePlaceholder: 'Title',
//                    messagePlaceholder: 'Message'
//                },
//            },
//            marker: {
//                class: Marker,
//                shortcut: 'CMD+SHIFT+M'
//            },
//            inlineCode: {
//                class: InlineCode,
//                shortcut: 'CMD+SHIFT+C'
//            },
//            delimiter: {
//                class: Delimiter,
//                config: {
//                    styleOptions: ['star', 'dash', 'line'],
//                    defaultStyle: 'star',
//                    lineWidthOptions: [8, 15, 25, 35, 50, 60, 100],
//                    defaultLineWidth: 25,
//                    lineThicknessOptions: [1, 2, 3, 4, 5, 6],
//                    defaultLineThickness: 2,
//                }
//            },
//            underline: Underline,
//            image: {
//                class: ImageTool,
//                config: {
//                    uploader: {
//                        uploadByFile(file) {
//                            return new Promise((resolve, reject) => {
//                                AjaxHelpers.uploadFile(
//                                    '/api/Upload/image',
//                                    file,
//                                    'file',
//                                    function (response) {
//                                        if (response.Code === 1) {
//                                            console.log(response.FilePath);
//                                            resolve({
//                                                success: 1,
//                                                file: {
//                                                    url: response.FilePath
//                                                }
//                                            });
//                                        } else {
//                                            reject(new Error(response.Message || 'Upload failed'));
//                                        }
//                                    },
//                                    function (xhr, status, error) {
//                                        console.error('Error:', error);
//                                        reject(error);
//                                    }
//                                );
//                            });
//                        },
//                        uploadByUrl(url) {
//                            return Promise.resolve({
//                                success: 1,
//                                file: {
//                                    url: url
//                                }
//                            });
//                        }
//                    },
//                    rendered: function () {
//                        console.log('Image Tool is ready');
//                    }
//                }
//            },
//            //imageGallery: ImageGallery,
//            alignmentTune: {
//                class: AlignmentBlockTune,
//                config: {
//                    default: 'left',
//                    blocks: {
//                        header: 'left',
//                        list: 'left'
//                    }
//                }
//            },
//            style: EditorJSStyle.StyleInlineTool,
//            alert: {
//                class: Alert,
//                inlineToolbar: true,
//                shortcut: 'CMD+SHIFT+A',
//                config: {
//                    alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
//                    defaultType: 'primary',
//                    messagePlaceholder: 'Enter something',
//                },
//            },
//            attaches: {
//                class: AttachesTool,
//                config: {
//                    endpoint: '/api/Upload/attaches'
//                }
//            },
//            carousel: {
//                class: Carousel,
//                config: {
//                    uploader: {
//                        uploadByFile(file) {
//                            return new Promise((resolve, reject) => {
//                                AjaxHelpers.uploadFile(
//                                    '/api/Upload/image',
//                                    file,
//                                    'file',
//                                    function (response) {
//                                        if (response.Code === 1) {
//                                            console.log(response.FilePath);
//                                            resolve({
//                                                success: 1,
//                                                file: {
//                                                    url: response.FilePath
//                                                }
//                                            });
//                                        } else {
//                                            reject(new Error(response.Message || 'Upload failed'));
//                                        }
//                                    },
//                                    function (xhr, status, error) {
//                                        console.error('Error:', error);
//                                        reject(error);
//                                    }
//                                );
//                            });
//                        },
//                        uploadByUrl(url) {
//                            return Promise.resolve({
//                                success: 1,
//                                file: {
//                                    url: url
//                                }
//                            });
//                        }
//                    }
//                }
//            },
//            paragraph: {
//                class: Paragraph,
//                inlineToolbar: false,
//                tunes: ['alignmentTune'],
//            },
//            linkTool: {
//                class: LinkTool,
//            },
//            Math: {
//                class: EJLaTeX,
//                shortcut: 'CMD+SHIFT+M'
//            },
//            mermaid: MermaidTool,
//            gallery: {
//                class: ImageGallery,
//                config: {
//                    sortableJs: Sortable,
//                    actions: [
//                        {
//                            name: 'selectFromLibrary',
//                            icon: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1zm-3 4l-2.5 3.01L8 10.5l-3 3.5V15h10v-2l-3-3z"/></svg>',
//                            title: 'Chọn từ thư viện',
//                        }
//                    ],
//                    types: 'image/*, video/*',
//                    uploader: {
//                        uploadByFile(file) {
//                            return new Promise((resolve, reject) => {
//                                AjaxHelpers.uploadFile(
//                                    '/api/Upload/image',
//                                    file,
//                                    'file',
//                                    function (response) {
//                                        if (response.Code === 1) {
//                                            console.log(response.FilePath);
//                                            resolve({
//                                                success: 1,
//                                                file: {
//                                                    url: response.FilePath
//                                                }
//                                            });
//                                        } else {
//                                            reject(new Error(response.Message || 'Upload failed'));
//                                        }
//                                    },
//                                    function (xhr, status, error) {
//                                        console.error('Error:', error);
//                                        reject(error);
//                                    }
//                                );
//                            });
//                        },
//                        uploadByUrl(url) {
//                            return Promise.resolve({
//                                success: 1,
//                                file: {
//                                    url: url
//                                }
//                            });
//                        }
//                    },
//                },
//            },
//        },
//        onReady: () => {
//            MermaidTool.config({ 'theme': 'neutral' })
//        },
//        onReady: function () {
//            console.log('Editor.js is ready to work!');
//        },
//        onChange: function (api, event) {
//            console.log('Now I know that Editor\'s content changed!', event);
//        },
//        data: {
//            blocks: [
//            ]
//        }
//    };

//    async function updateToolConfig(editorId, toolName, newConfig, path = '') {
//        if (!editors[editorId]) {
//            throw new Error(`Editor with id ${editorId} not found`);
//        }

//        const editor = editors[editorId];

//        // Đợi cho đến khi editor sẵn sàng
//        await editor.isReady;

//        // Lấy cấu hình hiện tại của công cụ
//        const currentToolConfig = editor.configuration.tools[toolName] || {};

//        let updatedToolConfig;
//        if (path) {
//            // Nếu có đường dẫn cụ thể, cập nhật phần đó
//            updatedToolConfig = { ...currentToolConfig };
//            let target = updatedToolConfig;
//            const pathParts = path.split('.');
//            for (let i = 0; i < pathParts.length - 1; i++) {
//                if (!(pathParts[i] in target)) {
//                    target[pathParts[i]] = {};
//                }
//                target = target[pathParts[i]];
//            }
//            const lastPart = pathParts[pathParts.length - 1];
//            target[lastPart] = deepMerge(target[lastPart] || {}, newConfig);
//        } else {
//            // Nếu không có đường dẫn, cập nhật toàn bộ cấu hình công cụ
//            updatedToolConfig = deepMerge(currentToolConfig, newConfig);
//        }

//        // Cập nhật cấu hình công cụ
//        editor.configuration.tools[toolName] = updatedToolConfig;

//        var tools = editor.configuration.tools;
//        // Lưu nội dung hiện tại
//        const savedData = await editor.save();

//        // Tạo lại editor với cấu hình mới
//        editor.destroy();
//        editors[editorId] = new EditorJS({
//            holder: editorId,
//            tools: tools,
//            onReady: () => {
//                MermaidTool.config({ 'theme': 'neutral' })
//            },
//            onReady: function () {
//                console.log('Editor.js is ready to work!');
//            },
//            onChange: function (api, event) {
//                console.log('Now I know that Editor\'s content changed!', event);
//            },
//        });

//        // Đợi cho đến khi editor mới sẵn sàng
//        await editors[editorId].isReady;

//        return editors[editorId];
//    }


//    const customParser = {
//        imageGallery: (block) => {
//            const { data, tunes } = block;

//            let gallery;
//            const galleryConfig = {
//                withGap: {
//                    id: 'gap',
//                    style: '--gap-length: 10px;'
//                },
//                horizontal: {
//                    id: 'horizontal',
//                    'data-layout': 'horizontal'
//                },
//                square: {
//                    id: 'square',
//                    'data-layout': 'square'
//                },
//                default: {}
//            };

//            const config = data.layoutWithGap ? galleryConfig.withGap :
//                data.layoutHorizontal ? galleryConfig.horizontal :
//                    data.layoutSquare ? galleryConfig.square :
//                        galleryConfig.default;

//            gallery = $('<div>', { class: 'image-gallery' })
//                .append(
//                    $('<div>', { class: 'gg-container' })
//                        .append(
//                            $('<div>', {
//                                class: 'gg-box',
//                                ...config
//                            })
//                                .append(
//                                    data.urls.map((src, i) =>
//                                        $('<img>', { id: `gg-img-${i}`, src: src })
//                                    )
//                                )
//                        )
//                );

//            return block.data.urls.length > 0 ? gallery.prop('outerHTML') : null;
//        },
//        image: (block) => {
//            const { file, caption, withBorder, withBackground, stretched } = block.data;
//            let classes = ['image-tool'];

//            if (withBorder) classes.push('image-tool--with-border');
//            if (withBackground) classes.push('image-tool--with-background');
//            if (stretched) classes.push('image-tool--stretched');

//            let imageHtml = `
//                                                                                                                <div class="${classes.join(' ')}">
//                                                                                                                    <div class="image-tool__image">
//                                                                                                                        <img src="${file.url}" alt="${caption || ''}" style="width: 100%; height: auto;">
//                                                                                                                    </div>
//                                                                                                                `;

//            if (caption) {
//                imageHtml += `
//                                                                                                                    <div class="image-tool__caption">
//                                                                                                                        ${caption}
//                                                                                                                    </div>
//                                                                                                                    `;
//            }

//            imageHtml += `</div>`;
//            return imageHtml;
//        },
//        table: (block) => {
//            const { content } = block.data;
//            if (!content || content.length === 0) {
//                return '';
//            }

//            let tableHtml = `<div class="custom-table-wrapper">`;
//            tableHtml += `<table class="custom-table">`;

//            content.forEach((row, rowIndex) => {
//                tableHtml += `<tr>`;
//                row.forEach((cell, cellIndex) => {
//                    const cellTag = rowIndex === 0 ? 'th' : 'td';
//                    const cellClass = `custom-table__cell${rowIndex === 0 ? ' custom-table__cell--header' : ''}`;
//                    tableHtml += `<${cellTag} class="${cellClass}">${escapeHtml(cell)}</${cellTag}>`;
//                });
//                tableHtml += '</tr>';
//            });

//            tableHtml += '</table></div>';

//            return tableHtml;
//        },
//        header: (block) => {
//            const { text, level } = block.data;
//            const { alignmentTune } = block.tunes;

//            if (!text) return null;

//            const styles = [];

//            if (alignmentTune && alignmentTune.alignment) {
//                styles.push(`text-align: ${alignmentTune.alignment}`);
//            }

//            return `<h${level} style="${styles.join('; ')}">${text}</h${level}>`;
//        },
//        alert: (block) => {
//            const { type, message } = block.data;
//            let alertClass = '';

//            switch (type) {
//                case 'primary':
//                    alertClass = 'alert-primary';
//                    break;
//                case 'secondary':
//                    alertClass = 'alert-secondary';
//                    break;
//                case 'info':
//                    alertClass = 'alert-info';
//                    break;
//                case 'success':
//                    alertClass = 'alert-success';
//                    break;
//                case 'warning':
//                    alertClass = 'alert-warning';
//                    break;
//                case 'danger':
//                    alertClass = 'alert-danger';
//                    break;
//                default:
//                    alertClass = 'alert-primary';
//            }

//            return `<div class="alert ${alertClass}" role="alert">${message}</div>`;
//        },
//        toggle: (block) => {
//            const { text, heading } = block.data;

//            return `
//                                                                            <details class="custom-toggle">
//                                                                                <summary>${heading}</summary>
//                                                                                <div class="custom-toggle-content">
//                                                                                    ${text}
//                                                                                </div>
//                                                                            </details>
//                                                                        `;
//        },
//        attaches: (block) => {
//            const { file } = block.data;
//            const { url, name, size } = file;

//            const formatFileSize = (bytes) => {
//                if (bytes < 1024) return bytes + ' bytes';
//                else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
//                else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
//                else return (bytes / 1073741824).toFixed(1) + ' GB';
//            };

//            const formattedSize = formatFileSize(size);

//            return `
//        <div class="attachment-block">
//            <a href="${url}" target="_blank" class="attachment-link">
//                <i class="fas fa-paperclip attachment-icon"></i>
//                <span class="attachment-filename">${name}</span>
//            </a>
//            <span class="attachment-size">(${formattedSize})</span>
//        </div>
//    `;
//        },
//        carousel: (block) => {
//            const items = block.data;
//            const { alignment } = block.tunes?.alignmentTune || { alignment: 'left' };

//            if (!items || items.length === 0) {
//                return '';
//            }

//            const slideshowId = 'custom-slideshow-' + block.id;

//            let slideshowHtml = `<div class="custom-slideshow-container ${alignment}" id="${slideshowId}">`;

//            items.forEach((item, index) => {
//                slideshowHtml += `
//                                                <div class="custom-slide custom-fade">
//                                                    <div class="custom-slide-number">${index + 1} / ${items.length}</div>
//                                                    <img src="${item.url}" class="custom-slide-image">
//                                                    <div class="custom-slide-caption">${item.caption || ''}</div>
//                                                </div>
//                                            `;
//            });

//            slideshowHtml += `
//                                            <a class="custom-prev">&#10094;</a>
//                                            <a class="custom-next">&#10095;</a>
//                                        `;

//            slideshowHtml += '<div class="custom-dot-container">';
//            items.forEach((_, index) => {
//                slideshowHtml += `<span class="custom-dot"></span>`;
//            });
//            slideshowHtml += '</div>';

//            slideshowHtml += '</div>';

//            return slideshowHtml;
//        },
//        checklist: (block) => {
//            const { data } = block;

//            let checklist = $('<div>', { class: 'cdx-checklist' });

//            data.items.forEach((item) => {
//                let checklistItem = $('<div>', { class: 'cdx-checklist__item' })
//                    .append(
//                        $('<input>', {
//                            type: 'checkbox',
//                            class: 'cdx-checklist__item-checkbox',
//                            checked: item.checked
//                        })
//                    )
//                    .append(
//                        $('<div>', {
//                            class: 'cdx-checklist__item-text',
//                            text: item.text
//                        })
//                    );

//                checklist.append(checklistItem);
//            });

//            return data.items.length > 0 ? checklist.prop('outerHTML') : null;
//        },
//        warning: (block) => {
//            const { data } = block;
//            if (!data.message) return null;

//            return `
//                  <div class="custom-warning">
//                    <div class="custom-warning__icon">
//                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
//                        <line x1="12" y1="9" x2="12" y2="13"></line>
//                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
//                      </svg>
//                    </div>
//                    <div class="custom-warning__content">
//                      ${data.title ? `<div class="custom-warning__title">${data.title}</div>` : ''}
//                      <div class="custom-warning__message">${data.message}</div>
//                    </div>
//                  </div>
//                `;
//        },
//        quote: (block) => {
//            const { data } = block;
//            if (!data.text) return null;

//            return `
//                      <div class="custom-quote">
//                        <div class="custom-quote__mark">"</div>
//                        <p class="custom-quote__text">
//                          ${data.text}
//                        </p>
//                        ${data.caption ? `
//                          <p class="custom-quote__caption">
//                            ${data.caption}
//                          </p>
//                        ` : ''}
//                      </div>
//                    `;
//        },
//        mermaid: (block) => {
//            const { data } = block;

//            if (!data.code) {
//                return null;
//            }

//            const mermaidContainer = $('<div>', {
//                class: 'mermaid-container'
//            });

//            const mermaidDiv = $('<div>', {
//                class: 'mermaid',
//                text: data.code
//            });

//            mermaidContainer.append(mermaidDiv);

//            if (data.caption && data.caption.trim() !== '') {
//                mermaidContainer.append(
//                    $('<div>', {
//                        class: 'mermaid-caption',
//                        text: data.caption
//                    })
//                );
//            }

//            return mermaidContainer.prop('outerHTML');
//        },
//    };

//    function escapeHtml(unsafe) {
//        return unsafe
//            .replace(/&/g, "&amp;")
//            .replace(/</g, "&lt;")
//            .replace(/>/g, "&gt;")
//            .replace(/"/g, "&quot;")
//            .replace(/'/g, "&#039;");
//    }

//    const edjsParser = edjsHTML({
//        imageGallery: customParser.imageGallery,
//        image: customParser.image,
//        table: customParser.table,
//        header: customParser.header,
//        raw: customParser.raw,
//        alert: customParser.alert,
//        toggle: customParser.toggle,
//        attaches: customParser.attaches,
//        carousel: customParser.carousel,
//        checklist: customParser.checklist,
//        warning: customParser.warning,
//        quote: customParser.quote,
//        mermaid: customParser.mermaid,
//    });

//    return {
//        initialize: function (config) {
//            if (!config.id || !config.imageUploadUrl || !config.fileUploadUrl) {
//                throw new Error("ID, image upload URL, and file upload URL are required to initialize the editor");
//            }
//            return initializeEditor(config);
//        },
//        getEditor: function (id) {
//            if (!id) {
//                throw new Error("ID is required to get the editor");
//            }
//            return editors[id];
//        },
//        getHtml: async function (id) {
//            if (!id) {
//                throw new Error("ID is required to get the editor");
//            }
//            try {
//                const editor = editors[id];
//                if (!editor) {
//                    throw new Error("Editor not found for the given ID");
//                }

//                const outputData = await editor.save();

//                console.log(outputData);

//                const html = edjsParser.parse(outputData);
//                return html;
//            } catch (error) {
//                console.error('Error getting HTML:', error);
//                throw error;
//            }
//        },
//        getAllEditors: function () {
//            return editors;
//        },

//        // Thêm phương thức mới để cập nhật cấu hình công cụ
//        updateToolConfig: async function (editorId, toolName, newConfig, path = '') {
//            return await updateToolConfig(editorId, toolName, newConfig, path);
//        }
//    }
//})();
