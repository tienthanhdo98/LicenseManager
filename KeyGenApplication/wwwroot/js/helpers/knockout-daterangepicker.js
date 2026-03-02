ko.bindingHandlers.dateRangePicker = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var initialValue = ko.unwrap(value); // Lấy giá trị ban đầu nếu có

        // Nếu chưa có giá trị, gán mặc định là từ đầu đến cuối tháng hiện tại
        if (!initialValue) {
            var startOfMonth = moment().startOf('month');
            var endOfMonth = moment().endOf('month');
            initialValue = startOfMonth.format('DD/MM/YYYY') + ' - ' + endOfMonth.format('DD/MM/YYYY');
            value(initialValue); // Gán giá trị vào observable
        }

        $(element).daterangepicker({
            autoUpdateInput: true,
            startDate: moment(initialValue.split(' - ')[0], 'DD/MM/YYYY'),
            endDate: moment(initialValue.split(' - ')[1], 'DD/MM/YYYY'),
            locale: {
                cancelLabel: 'Xóa',
                applyLabel: 'Chọn',
                format: 'DD/MM/YYYY',
                daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
            },
            opens: 'left'
        }).on('apply.daterangepicker', function (ev, picker) {
            var formattedDate = picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY');
            value(formattedDate);
            $(element).trigger("change");
        }).on('cancel.daterangepicker', function () {
            value(""); // Xóa giá trị khi nhấn "Xóa"
            $(element).val("").trigger("change");
        });

        // Đảm bảo hiển thị đúng ban đầu
        $(element).val(initialValue);

        value.subscribe(function (newValue) {
            $(element).val(newValue);
        });
    }
};
