const BtnHelper = function (btn) {
    return {
        onLoad : function () {
            btn.attr('data-kt-indicator', 'on'),
                btn.prop('disabled', true)
        },
        offLoad : function () {
            btn.removeAttr('data-kt-indicator'),
            btn.prop('disabled', false)
        }
    }
}
