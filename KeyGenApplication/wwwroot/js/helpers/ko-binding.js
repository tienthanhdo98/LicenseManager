// checkbox trong table (checkbox all)
ko.bindingHandlers.indeterminate = {
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        element.indeterminate = value;
    }
};
ko.bindingHandlers.uiSortableList = {
    init: function (element, valueAccessor, allBindingsAccesor, context) {
        var list = valueAccessor();
        $(element).sortable({
            axis: 'x',
            update: function (event, ui) {
                var item = ko.dataFor(ui.item[0]);
                var newIndex = ui.item.index();
                var oldIndex = list.indexOf(item);

                if (oldIndex != newIndex) {
                    var c = list();
                    list([]);
                    c.splice(oldIndex, 1);
                    c.splice(newIndex, 0, item);
                    list(c);
                }
            }
        });
    }
};

// select2 chọn 1 hoặc chọn nhiều
ko.bindingHandlers.select2 = {
    after: ["options", "value", "selectedOptions"],
    init: function (el, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();

        // Initialize Select2
        $(el).select2(ko.unwrap(valueAccessor()));

        // Dispose Select2 when element is removed
        ko.utils.domNodeDisposal.addDisposeCallback(el, function () {
            $(el).select2('destroy');
        });

        // Handle changes from the UI
        $(el).on('change', function () {
            if (allBindings.selectedOptions) {
                var selectedValues = $(el).val();
                allBindings.selectedOptions(selectedValues ? selectedValues : []);
            }
        });
    },
    update: function (el, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();
        var select2 = $(el).data("select2");

        // Update selectedOptions if bound
        if (allBindings.selectedOptions) {
            var newValues = ko.unwrap(allBindings.selectedOptions);
            $(el).val(newValues).trigger('change.select2');
        }

        // Update value if bound
        if (allBindings.value) {
            var newValue = ko.unwrap(allBindings.value);
            if ($(el).val() !== newValue) {
                $(el).val(newValue).trigger('change.select2');
            }
        }
    }
};
// delay khi click
ko.bindingHandlers.singleClick = {
    init: function (element, valueAccessor) {
        var handler = valueAccessor(),
            delay = 250,
            clickTimeout = false;

        $(element).click(function (event) {
            var context = ko.contextFor(element);
            var data = context.$data;

            if (clickTimeout !== false) {
                clearTimeout(clickTimeout);
                clickTimeout = false;
            } else {
                clickTimeout = setTimeout(function () {
                    clickTimeout = false;
                    handler.call(element, data, event);
                }, delay);
            }
        });
    }
};
ko.bindingHandlers.flatpickr = {
    after: ["value"],
    init: function (element, valueAccessor, allBindingsAccessor) {
        const options = ko.unwrap(valueAccessor());
        const allBindings = allBindingsAccessor();
        
        const fp = $(element).flatpickr({
            ...options,
            onChange: function (selectedDates, dateStr) {
                console.log(dateStr)
                if (ko.isObservable(allBindings.value)) {
                    allBindings.value(dateStr);
                }
            }
        });
        
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            fp.destroy();
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();
        if (allBindings.value) {
            const value = ko.unwrap(allBindings.value);
            const fpInstance = element._flatpickr;
            if (fpInstance) {
                fpInstance.setDate(value, false);
            }
        }
    }
};

ko.bindingHandlers.uniqueId = {
    init: function (element, valueAccessor) {
        const options = ko.unwrap(valueAccessor());
        element.id = (options.prefix || ko.bindingHandlers.uniqueId.prefix) + "-" + (++ko.bindingHandlers.uniqueId.counter);
    },
    counter: 0,
    prefix: "unique"
};

ko.bindingHandlers.uniqueFor = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        value.id = value.id || ko.bindingHandlers.uniqueId.prefix + (++ko.bindingHandlers.uniqueId.counter);

        element.setAttribute("for", value.id);
    }
};