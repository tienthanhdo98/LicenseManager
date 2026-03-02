const FormHelper = (function () {
    function findField(form, fieldName) {
        // Tìm chính xác
        var field = form.find('[name="' + fieldName + '"]');
        if (field.length > 0) return field;

        // Tìm không phân biệt hoa thường
        field = form.find('[name]').filter(function () {
            return this.name.toLowerCase() === fieldName.toLowerCase();
        });
        if (field.length > 0) return field;

        // Tìm với dấu chấm (cho trường hợp như "User.Name")
        var parts = fieldName.split('.');
        if (parts.length > 1) {
            return findField(form, parts[parts.length - 1]);
        }

        return $(); // Trả về jQuery object rỗng nếu không tìm thấy
    }

    function validForm(form, arrInValid) {
        $('.error-message').remove();
        if (arrInValid) {
            arrInValid.forEach(function (error) {
                var field = findField(form, error.Field); 
                if (field.length === 0) {
                    console.warn('Không tìm thấy trường:', error.Field);
                    return;
                }
                var errorSpan = $(`<span class="error-message text-danger">${error.Messages}</span>`);
                field.after(errorSpan);
            });
        }
    }

    function mapData(form, data) {
        try {
            if (!data || typeof data !== 'object') {
                throw new Error('Data is undefined or not an object');
            }
            if (Object.keys(data).length === 0) {
                form[0].reset();
                form.find('select').val('').trigger('change');
                return;
            }

            Object.keys(data).forEach(key => {
                const input = form.find(`[name="${key}"]`);
                if (input.length) {
                    if (input.is('select')) {
                        input.val(data[key]).trigger('change');
                    } else if (input.attr('type') === 'checkbox') {
                        if (input.attr('data-is-flag') === 'true') {
                            // Xử lý checkbox flags
                            const flagValue = parseInt(data[key]) || 0;
                            input.each(function () {
                                const checkboxValue = parseInt($(this).val());
                                $(this).prop('checked', (flagValue & checkboxValue) === checkboxValue);
                            });
                        } else {
                            // Xử lý checkbox thông thường
                            input.prop('checked', !!data[key]);
                        }
                    } else if (input.attr('type') === 'radio') {
                        input.filter(`[value="${data[key]}"]`).prop('checked', true);
                    } else {
                        input.val(data[key] || '');
                    }
                }
            });
        } catch (error) {
            console.error('Error in mapData function:', error.message);
        }
    }

    function setMaxLengthForTextArea(element, maxLength) {
        element.maxlength({
            warningClass: "badge badge-primary",
            limitReachedClass: "badge badge-success",
            threshold: maxLength,
            placement: 'top-right',
            validate: true,
            alwaysShow: true
        });
    }

    function checkBoxesBasedOnIds(ids, checkboxes) {
        $.each(checkboxes, function (index, checkbox) {
            var $checkbox = $(checkbox);
            var checkboxValue = $checkbox.val();

            // Chuyển đổi giá trị checkbox thành số nếu có thể
            var numericValue = parseInt(checkboxValue, 10);
            if (!isNaN(numericValue)) {
                checkboxValue = numericValue;
            }

            if ($.inArray(checkboxValue, ids) !== -1) {
                $checkbox.prop('checked', true);
            } else {
                $checkbox.prop('checked', false);
            }
        });
    }

    function initCheckAll($checkAll, $childCheckboxes) {
        // Destroy các event cũ
        $checkAll.off('change');
        $childCheckboxes.off('change');

        // Kiểm tra ban đầu: nếu tất cả checkbox con được check
        // thì checkbox "check all" sẽ được check
        const allChecked = $childCheckboxes.length === $childCheckboxes.filter(':checked').length;
        $checkAll.prop('checked', allChecked);

        // Xử lý sự kiện khi click vào checkbox "check all"
        $checkAll.on('change', function () {
            const isChecked = $(this).prop('checked');
            $childCheckboxes.prop('checked', isChecked);
        });

        // Xử lý sự kiện khi click vào các checkbox con
        $childCheckboxes.on('change', function () {
            const allChecked = $childCheckboxes.length === $childCheckboxes.filter(':checked').length;
            $checkAll.prop('checked', allChecked);
        });
    }

    return {
        validForm: validForm,
        mapData: mapData,
        handleSubmit: function (form, action) {
            form.off('submit');
            form.on('submit', function (e) {
                e.preventDefault();
                if (typeof action === 'function') {
                    action($(this)); 
                } else {
                    console.error('Action is not a function');
                }
            });
            form.trigger('submit');
        },
        reset: function (form) {
            $('.error-message').remove(); 
            form[0].reset();

            form.find('select').each(function () {
                if ($(this).prop('multiple')) {
                    $(this).val([]).trigger('change');
                } else {
                    //$(this).val($(this).find('option:first').val()).trigger('change');
                    $(this).val(null).trigger('change');
                }
            });
        },
        setMaxLengthForTextArea: setMaxLengthForTextArea,
        getDataJsonFromForm: function (eForm) {
            var formData = {};
            eForm.find('input[name]').each(function () {
                var $input = $(this);
                var name = $input.attr('name');
                var value = $input.val();
                formData[name] = value;
            });

            return JSON.stringify(formData);
        },
        mapCheckboxs: checkBoxesBasedOnIds,
        initCheckAll: initCheckAll
    };
})();
