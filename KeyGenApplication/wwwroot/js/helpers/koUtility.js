(function ($) {
    // Định nghĩa namespace cho tiện ích
    $.fn.koUtility = $.fn.koUtility || {};

    // Hàm helper để chuyển đổi giá trị thành observable
    function convertValue(value) {
        if (ko.isObservable(value)) {
            return value;
        } else if (Array.isArray(value)) {
            return ko.observableArray(value.map(convertValue));
        } else if (typeof value === 'object' && value !== null) {
            var result = {};
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    result[key] = convertValue(value[key]);
                }
            }
            return result;
        } else {
            return ko.observable(value);
        }
    }

    // Định nghĩa hàm convertToKoObject
    $.fn.koUtility.convertToKoObject = function (data, options) {
        options = $.extend({
            additionalProperties: {},
            customMapping: {},
            beforeMapping: function (data) { return data; },
            afterMapping: function (koObject) { return koObject; }
        }, options);

        // Áp dụng xử lý trước khi mapping
        data = options.beforeMapping(data);

        // Tạo đối tượng Knockout từ dữ liệu
        var koObject = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                koObject[key] = convertValue(data[key]);
            }
        }

        // Thêm các thuộc tính bổ sung
        $.each(options.additionalProperties, function (key, value) {
            koObject[key] = convertValue(value);
            if (typeof value === 'function') {
                koObject[key] = value(koObject);
            }
        });

        // Áp dụng xử lý sau khi mapping
        return options.afterMapping(koObject);
    };

    // Hàm tiện ích để chuyển đổi một mảng dữ liệu
    $.fn.koUtility.convertArrayToKoArray = function (dataArray, options) {
        return ko.observableArray(dataArray.map(function (item) {
            return $.fn.koUtility.convertToKoObject(item, options);
        }));
    };

})(jQuery);