const AjaxHelpers = function () {
    return {
        ajaxForm: function (f, action, options, errorAction) {
            options = options || {};
            var sendAsBody = options.sendAsBody === true;

            // Đảm bảo f là một phần tử DOM form
            var formElement = (typeof f === 'string') ? document.querySelector(f) : (f instanceof jQuery ? f[0] : f);

            if (!(formElement instanceof HTMLFormElement)) {
                console.error('Invalid form element');
                return;
            }

            var formData = new FormData();
            var bodyData = {};
            var checkboxNames = {};

            // Đếm số lượng checkbox cho mỗi name
            $(formElement).find('input[type="checkbox"]').each(function () {
                if (this.name) {
                    checkboxNames[this.name] = (checkboxNames[this.name] || 0) + 1;
                }
            });

            $(formElement).find('input, select, textarea').each(function () {
                if (this.name) {
                    let value;
                    if (this.type === 'checkbox') {
                        if (checkboxNames[this.name] > 1) {
                            // Nếu có nhiều checkbox cùng name, luôn xử lý như mảng
                            if (!bodyData[this.name]) {
                                bodyData[this.name] = [];
                            }
                            if (this.checked) {
                                bodyData[this.name].push(this.value);
                            }
                            if (!sendAsBody) {
                                if (this.checked) {
                                    formData.append(this.name + '[]', this.value);
                                }
                            }
                        } else {
                            // Nếu chỉ có một checkbox với name này, xử lý như boolean
                            value = this.checked;
                            if (sendAsBody) {
                                bodyData[this.name] = value;
                            } else {
                                formData.append(this.name, value);
                            }
                        }
                    } else if (this.type === 'radio') {
                        value = this.checked ? this.value : null;
                    } else if (this.tagName === 'SELECT' && this.multiple) {
                        const selectName = this.name;
                        value = [];
                        $(this).find('option:selected').each(function () {
                            value.push(this.value);
                            if (!sendAsBody) {
                                formData.append(selectName, this.value);
                            }
                        });
                        if (sendAsBody && value.length === 0) value = null;
                    } else {
                        value = this.value.trim();
                    }

                    if (this.type !== 'checkbox' && value !== "" && value !== false && value != null) {
                        if (sendAsBody) {
                            bodyData[this.name] = value;
                        } else {
                            if (!this.multiple) {
                                formData.append(this.name, value);
                            }
                        }
                    }
                }
            });

            var flagFields = {};
            $(formElement).find('input[type="checkbox"][data-is-flag="true"]').each(function () {
                var flagName = this.name;
                if (!flagFields[flagName]) {
                    flagFields[flagName] = 0;
                }
                if (this.checked) {
                    flagFields[flagName] |= parseInt(this.value);
                }
            });

            // Thêm các giá trị flag vào data
            for (var flagName in flagFields) {
                if (sendAsBody) {
                    bodyData[flagName] = flagFields[flagName];
                } else {
                    formData.append(flagName, flagFields[flagName]);
                }
            }

            // Đảm bảo rằng các checkbox có nhiều phần tử luôn được gửi dưới dạng mảng
            for (let name in checkboxNames) {
                if (checkboxNames[name] > 1 && !bodyData[name]) {
                    bodyData[name] = [];
                }
            }

            var data = sendAsBody ? JSON.stringify(bodyData) : formData;

            $.ajax({
                type: $(formElement).attr("method"),
                url: $(formElement).attr("action"),
                data: data,
                processData: false,
                contentType: sendAsBody ? 'application/json' : false,
                success: function (response) {
                    if (typeof action === 'function') {
                        action(response);
                    }
                },
                error: function (xhr, status, error) {
                    if (typeof errorAction === 'function') {
                        errorAction(xhr, status, error);
                    } else {
                        console.log("Yêu cầu AJAX thất bại");
                        console.log("Trạng thái: " + status);
                        console.log("Lỗi: " + error);
                    }
                }
            });
        },
        deleteItem: function (title, deleteUrl, onSuccess, data) {
            Swal.fire({
                title: title,
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    var ajaxOptions = {
                        'url': deleteUrl,
                        'method': 'POST',
                        'dataType': 'json',
                        'contentType': 'application/json',
                        'success': function (response) {
                            if (response.code < 0) {
                                console.error('Có lỗi khi xóa item');
                            } else {
                                if (typeof onSuccess === 'function') {
                                    onSuccess(response);
                                }
                            }
                        },
                        'error': function (xhr, status, error) {
                            console.error("Yêu cầu AJAX thất bại", status, error);
                        }
                    };

                    if (data && Object.keys(data).length > 0) {
                        ajaxOptions.data = JSON.stringify(data);
                    }

                    $.ajax(ajaxOptions);
                }
            });
        },
        get: function (url, params = {}) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: url,
                    method: 'GET',
                    data: params,
                    success: resolve,
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.error('Lỗi AJAX:', textStatus, errorThrown);
                        reject(errorThrown);
                    }
                });
            }).catch(error => {
                console.error('Lỗi:', error);
            });
        },
        postJson: function (url, data, onSuccess, options = {}) {
            let ajaxOptions = {
                url: url,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Lỗi AJAX:", textStatus, errorThrown);
                }
            };

            if (options.AntiForgeryToken) {
                ajaxOptions.headers = {
                    'RequestVerificationToken': options.AntiForgeryToken
                };
            }

            $.ajax(ajaxOptions);
        },

        uploadFile: function (url, file, property, onSuccess, onError) {
            var formData = new FormData();
            formData.append(property, file);

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (typeof onSuccess === 'function') {
                        onSuccess(response);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Lỗi khi tải file lên:", status, error);
                    if (typeof onError === 'function') {
                        onError(xhr, status, error);
                    }
                }
            });
        }
    }
}();
