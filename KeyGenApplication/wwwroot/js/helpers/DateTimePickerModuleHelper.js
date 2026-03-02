const DateTimePickerModule = function () {
    const defaultConfig = {
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: true,
        buttonClasses: ' btn',
        applyClass: 'btn-primary',
        cancelClass: 'btn-secondary',
        locale: {
            format: 'DD/MM/YYYY HH:mm:ss',
            separator: ' - ',
            applyLabel: 'Áp dụng',
            cancelLabel: 'Hủy',
            fromLabel: 'Từ',
            toLabel: 'Đến',
            customRangeLabel: 'Tùy chỉnh',
            daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            firstDay: 1
        },
        alwaysShowCalendars: true,
        showCustomRangeLabel: false,
        ranges: {
            'Hôm nay': [moment().startOf('day'), moment().endOf('day')],
            'Ngày mai': [moment().add(1, 'days').startOf('day'), moment().add(1, 'days').endOf('day')],
            '7 ngày tiếp theo': [moment().add(1, 'days').startOf('day'), moment().add(7, 'days').endOf('day')],
            '30 ngày tiếp theo': [moment().add(1, 'days').startOf('day'), moment().add(30, 'days').endOf('day')]
        }
    };

    const instances = new Map();

    function createInstance(elementId, config) {
        const element = $(`#${elementId}`);
        if (!element.length) {
            console.error(`Element with id '${elementId}' not found`);
            return null;
        }

        const mergedConfig = $.extend(true, {}, defaultConfig, config);

        if (mergedConfig.startDate === null || mergedConfig.startDate === undefined) {
            delete mergedConfig.startDate;
        }
        if (mergedConfig.endDate === null || mergedConfig.endDate === undefined) {
            delete mergedConfig.endDate;
        }

        if (!mergedConfig.startDate && !mergedConfig.endDate) {
            mergedConfig.autoUpdateInput = false;
        }

        const instance = element.daterangepicker(mergedConfig, function (start, end, label) {
            if (typeof mergedConfig.callback === 'function') {
                mergedConfig.callback(start, end, label);
            }
        });

        element.on('click', function (e) {
            e.stopPropagation();
        });

        element.on('show.daterangepicker', function (ev, picker) {
            picker.container.on('click', function (e) {
                e.stopPropagation();
            });
        });

        element.on('apply.daterangepicker', function (ev, picker) {
            if (typeof mergedConfig.onApply === 'function') {
                mergedConfig.onApply(picker.startDate, picker.endDate, picker);
            }
            $(this).val(picker.startDate.format(mergedConfig.locale.format) + mergedConfig.locale.separator + picker.endDate.format(mergedConfig.locale.format));
        });

        element.on('cancel.daterangepicker', function (ev, picker) {
            if (typeof mergedConfig.onCancel === 'function') {
                mergedConfig.onCancel(picker);
            }
            $(this).val('');
        });

        instances.set(elementId, instance);
        return instance;
    }

    return {
        init: function (elementId, config = {}) {
            return createInstance(elementId, config);
        },
        update: function (elementId, startDate, endDate) {
            const instance = instances.get(elementId);
            if (instance) {
                const picker = instance.data('daterangepicker');
                if (startDate === null && endDate === null) {
                    instance.val('');
                    picker.setStartDate(moment());
                    picker.setEndDate(moment());
                } else {
                    const tgStart = startDate ? (moment.isMoment(startDate) ? startDate : moment(startDate)) : moment();
                    const tgEnd = endDate ? (moment.isMoment(endDate) ? endDate : moment(endDate)) : moment();
                    picker.setStartDate(tgStart);
                    picker.setEndDate(tgEnd);
                    instance.val(tgStart.format(picker.locale.format) + picker.locale.separator + tgEnd.format(picker.locale.format));
                }
            } else {
                console.error(`DateRangePicker instance for '${elementId}' not found`);
            }
        },
        getInstance: function (elementId) {
            return instances.get(elementId);
        }
    };
}();