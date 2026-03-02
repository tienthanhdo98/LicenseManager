const Mapping = function () {
    return {
        mapObjectToForm: function (obj, form) {
            Object.keys(obj).forEach(key => {
                const input = form.find(`[name="${key}"]`);
                if (input.length) {
                    if (input.is('select')) { 
                        input.val(obj[key] || '').trigger('change');
                    } else if (input.attr('type') === 'checkbox') {
                        input.prop('checked', !!obj[key]);
                    } else {
                        input.val(obj[key] || '');
                    }
                }
            });
        }
    }
}()
