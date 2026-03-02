jQuery(document).ready($ => {
    const formAction = $('#action');

    const loadMenuTree = () => {
        AjaxHelpers.postJson('/api/Menu/FindAll', { ApplicationId: 1 }, res => {
            console.log("loadMenuTree findall" + res.data);
            const flatData = TreeHelper.getFlatV2(res.data, 'id', 'parentId', 'name', 'icon', 'isActive');
            console.log(flatData);
            TreeHelper.initializeJSTreeV3($("#jstree-container"), flatData, {
                plugins: ['types', 'search'],
                core: { check_callback: true, multiple: false },
                types: { 'default': { 'icon': 'fas fa-folder' } },
                search: { case_sensitive: false, show_only_matches: true },
                onClickCallback: async node => {
                    try {
                        const { data: menu } = await (await fetch(`/api/menu/${node.id}`)).json();
                        if (!menu) return;
                        $('#title').text(menu.name);
                        setTimeout(() => {
                            FormHelper.mapData(formAction, menu);
                            //FormHelper.mapCheckboxs(menu.RoleIds, $('[name="RoleIds"]'));
                            //FormHelper.initCheckAll($('[name="checkall"]'), $('[name="RoleIds"]'));
                        }, 100);
                    } catch (err) { console.error('Fetch error:', err); }
                },
                searchInputSelector: '#search-input'
            });
        });
    };

    const loadParentId = () => {
            AjaxHelpers.postJson('/api/Menu/FindAll',
                { ApplicationId: 1 },
                res => {
                    console.log("loadParentId findall" + res.data);
                    TreeHelper.initializeSelect2(formAction.find('[name="parentId"]'),
                        TreeHelper.getFlat(res.data, 'id', 'parentId', 'name'),
                        'id', 'text', 0);
                }
            );
    }

    const iniForm = () => {
        FormHelper.reset(formAction);
        formAction.find('[name="id"]').val(0);
        //FormHelper.initCheckAll($('[name="checkall"]'), $('[name="RoleIds"]'));
        $('#title').text('Thêm mới');
    }




    iniForm();
    SelectIconHelper.init($('.selec2-icon'));
    loadMenuTree();
    loadParentId();
});

var menuViewModal = (function () {
    const fUpdate = $('#action');
    const iniForm = () => {
        FormHelper.reset(fUpdate);
        fUpdate.find('[name="id"]').val(0);
        //FormHelper.initCheckAll($('[name="checkall"]'), $('[name="RoleIds"]'));
        $('#title').text('Thêm mới');
    }
    function submit(f) {
        FormHelper.handleSubmit(f, function (form) {
            AjaxHelpers.ajaxForm(form, function (response) {
                if (response.code === 1) {
                    showtoastState(response.message, 'Thông báo');
                    //if (fUpdate.find('[name="id"]').val() == 0) {
                    //    setTimeout(function () {
                    //        location.reload();
                    //    }, 1000);
                    //}
                    location.reload();
                } else {
                    FormHelper.validForm(form, response.errorInfo),
                        showtoastError(response.message, 'Thông báo');
                }
            })
        })
    }
    return {
        Add: {
            show: function () {
                iniForm();
            },
        },
        Update: {
            submit: function () {
                submit(fUpdate);
            }
        },
        Delete: function () {
            if (fUpdate.find('[name="id"]').val()==0) {
                showtoastError('Vui lòng chọn phần tử để tiến hành xóa', 'Thông báo');
            } else {
                AjaxHelpers.deleteItem('Bạn có muốn xóa menu này?', `/api/Menu/Delete?Id=` + fUpdate.find('[name="id"]').val(), function () {
                    showtoastState("Đã xóa thành công", 'Thông báo'),
                        location.reload();
                })
            }
        }
    };
})();