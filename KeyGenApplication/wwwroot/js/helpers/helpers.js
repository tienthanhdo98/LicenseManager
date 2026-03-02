var Helpers = function () {
    var self = this;


    let comboTree;

    self.getGroupModelLoad = (data, parentid) => {
        let SampleJSONData2 = getNestedGroupLoad(0, data);
        //<remove duplicates, for infinity nesting only>   
        for (var i = 0; i < SampleJSONData2.length; i++) {
            if (SampleJSONData2[i].used) {
                SampleJSONData2.splice(i, 1);
                i--;
            }
        }
        var selected = []
        var obj = {
            source: SampleJSONData2,
            isMultiple: false,

        }
        if (parentid != null) {
            selected.push(parentid);
            obj.selected = selected
        }
        $("#InputSelect").remove();
        $("#combo-home").append('<input type="text" id="InputSelect" placeholder="Chọn vị trí địa bàn" autocomplete="off" />');
        comboTree = $('#InputSelect').comboTree(obj);
        $('.comboTreeArrowBtnImg').html(`<i class="fa-solid fa-chevron-down"></i>`)
        $('.comboTreeInputWrapper input').addClass(`form-control form-control-lg `)
        // $('.comboTreeInputWrapper div').removeClass('comboTreeArrowBtn')
        return comboTree;
    }

    let comboTreeModal;
    self.getGroupModelModalLoad = (data, parentid) => {
        let SampleJSONData2 = getNestedGroupLoad(0, data);
        //<remove duplicates, for infinity nesting only>   
        for (var i = 0; i < SampleJSONData2.length; i++) {
            if (SampleJSONData2[i].used) {
                SampleJSONData2.splice(i, 1);
                i--;
            }
        }
        var selected = []
        var obj = {
            source: SampleJSONData2,
            isMultiple: false,

        }
        if (parentid != null) {
            selected.push(parentid);
            obj.selected = selected
        }
        $("#InputSelectModal").remove();
        $("#combo-home-modal").append('<input type="text" id="InputSelectModal" placeholder="Chọn vị trí địa bàn" autocomplete="off" />');
        comboTreeModal = $('#InputSelectModal').comboTree(obj);
        $('.comboTreeInputWrapper input').addClass(`form-control form-control-lg form-control-solid`)
        $('.comboTreeInputWrapper div').removeClass('comboTreeArrowBtn')
        return comboTreeModal;
    }

    function getNestedGroupLoad(index, all) {
        var root = all[index];
        if (!root) {
            return all;
        }
        if (!all[index].subs) {
            all[index].subs = [];
        }

        for (var i = 0; i < all.length; i++) {
            //<infinity nesting?>
            //put subs inside it's parent
            if (all[index].id == all[i].parentId) {
                all[index].subs.push(all[i]);
                all[i].used = true;
            }
            //</infinity nesting?>
        }
        if (all[index].subs.length == 0) {
            delete all[index].subs;
        }
        //all[index].order = index;F
        return getNestedGroupLoad(++index, all);
    };


    self.handleCheckAll = function () {
        $('#check-all').change(function () {
            var checkboxes1 = $('input[name="checked[]"]');
            checkboxes1.prop('checked', $(this).is(':checked'));
        });
    }
    self.convertToKoObject = function (data) {
        var newObj = ko.mapping.fromJS(data);
        newObj.Selected = ko.observable(false);
        return newObj;
    }
    self.convertToJSObject = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return ko.mapping.toJS(item);
        }
    }
    self.convertToJson = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return JSON.parse(item);
        }
    };
    self.convertToJsonString = function (data) {
        return JSON.stringify(data)
    }

    self.showtoastError = function (msg, title) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "3000",
            "hideDuration": "3000",
            "timeOut": "3000",
            "extendedTimeOut": "3000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr['error'](msg, "Thất bại");
    };
    self.showtoastState = function (msg, title) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "3000",
            "hideDuration": "3000",
            "timeOut": "3000",
            "extendedTimeOut": "3000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr['success'](msg, "Thành công");
    };

    self.apiHeplerPost = function () {

    }



    self.convertToSeconds = function (hms) {
        var time = hms;
        var actualTime = time.split(':');
        var totalSeconds = (+actualTime[0]) * 60 * 60 + (+actualTime[1]) * 60 + (+actualTime[2]);
        return totalSeconds
    }

    self.convertScondsToHms = function (seconds) {
        try {
            const result = new Date(seconds * 1000).toISOString().slice(11, 19);
            return result
        }
        catch {
            return "00:00:00";
        }

    }
    self.convertDateToEpoch = function (date) {
        try {
            let dateArray = date.split('-');

            return moment(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`).unix();
        }
        catch {
            return 0;
        }

    }
    self.convertSecondsToHms = function (seconds) {
        try {
            const result = new Date(seconds * 1000).toISOString().slice(11, 19);
            return result
        }
        catch {
            return "00:00:00";
        }

    }

    self.showLoading = function () {
        $('.loader').css('display', 'block');
    }

    self.hiddenLoading = function () {
        $('.loader').css('display', 'none');
    }


    self.programFrameStatus = function (status, name) {
        if (status == 0 || status == 1 || status == 2 || status == 5 || status == 6) {
            return ({
                color: "#F1C40F",
                name: name
            })
        }
        if (status == 3) {
            return ({
                color: "#26C281",
                name: name
            })
        }
        if (status == 4) {
            return ({
                color: "#ed6b75",
                name: name
            })
        }
    };

    self.broadcastScheduleStatus = function (status, name) {
        if (status == 0 || status == 1 || status == 2 || status == 5 || status == 6) {
            return ({
                color: "#F1C40F",
                name: name
            })
        }
        if (status == 3) {
            return ({
                color: "#26C281",
                name: name
            })
        }
        if (status == 4) {
            return ({
                color: "#ed6b75",
                name: name
            })
        }
    }

    self.productionRegistrationStatus = function (status, name) {
        if (status == 0 || status == 1 || status == 2 || status == 5 || status == 6) {
            return ({
                color: "#F1C40F",
                name: name
            })
        }
        if (status == 3) {
            return ({
                color: "#26C281",
                name: name
            })
        }
        if (status == 4) {
            return ({
                color: "#ed6b75",
                name: name
            })
        }
    }

    self.scriptProgramStatus = function (status, name) {
        if (status == 0) {
            return ({
                background: "#eff5fd",
                color: "#009ef7",
                name: name
            })
        }
        if (status == 1 || status == 2) {
            return ({
                background: "#FFFBE9",
                color: "#F90",
                name: name
            })
        }
        if (status == 3) {
            return ({
                background: "#E3FAE1",
                color: "#119143",
                name: name
            })
        }
        if (status == 4) {
            return ({
                background: "#FFF1F0",
                color: "#D64236",
                name: name
            })
        }
        if (status == 5) {
            return ({
                background: "#F4EDF9",
                color: "#721EA9",
                name: name
            })
        }
        if (status == 6) {
            return ({
                background: "#F0F0F0",
                color: "#222222",
                name: name
            })
        }
    }

    self.postProductionStatus = function (status, name) {
        if (status == 0 || status == 1 || status == 2 || status == 5 || status == 6) {
            return ({
                color: "#F1C40F",
                name: name
            })
        }
        if (status == 3) {
            return ({
                color: "#26C281",
                name: name
            })
        }
        if (status == 4) {
            return ({
                color: "#ed6b75",
                name: name
            })
        }
    }

    self.ideaTopicStatus = function (status, name) {
        if (status == 0 || status == 1 || status == 2 || status == 5 || status == 6) {
            return ({
                color: "#F1C40F",
                name: name
            })
        }
        if (status == 3) {
            return ({
                color: "#26C281",
                name: name
            })
        }
        if (status == 4) {
            return ({
                color: "#ed6b75",
                name: name
            })
        }
    }


    self.broadcastTransmissionStatus = function (status, name) {
        if (status == 0 || status == 1 || status == 2 || status == 5 || status == 6) {
            return ({
                color: "#F1C40F",
                name: name
            })
        }
        if (status == 3) {
            return ({
                color: "#26C281",
                name: name
            })
        }
        if (status == 4) {
            return ({
                color: "#ed6b75",
                name: name
            })
        }
    }

    self.taskStatus = function (status, name) {
        if (status == 0 || status == 1 || status == 2 || status == 5 || status == 6) {
            return ({
                color: "#F1C40F",
                name: name
            })
        }
        if (status == 3) {
            return ({
                color: "#26C281",
                name: name
            })
        }
        if (status == 4) {
            return ({
                color: "#ed6b75",
                name: name
            })
        }
    }

    self.productionPlanStatus = function (status, name) {
        if (status == 0 || status == 1 || status == 2 || status == 5 || status == 6) {
            return ({
                color: "#F1C40F",
                name: name
            })
        }
        if (status == 3) {
            return ({
                color: "#26C281",
                name: name
            })
        }
        if (status == 4) {
            return ({
                color: "#ed6b75",
                name: name
            })
        }
    }


    self.formatDatetime = function (datetime) {
        return moment(datetime).format("HH:mm, DD-MM-YYYY")
    }

    self.getTotalDaysInMonth = function (year, month) {
        return new Date(year, month, 0).getDate();
    }

    self.getDaysInMonth = function (month, year) {
        var total = self.getTotalDaysInMonth(year, month);
        var array = []
        if (month < 10) {
            month = '0' + month
        }

        for (var i = 1; i <= total; i++) {
            if (i < 10) {
                i = '0' + i
            }

            array.push(`${i}-${month}-${year}`)
        }
        return array
    }


    self.alertSuccess = function (message) {
        $('#alert-success-message').html(message);
        $('#alert-success').show();
        //setTimeout(function () {
        //    $('#alert-success').hide();
        //}, 10000)
    };

    self.alertInfo = function (message) {
        $('#alert-info-message').html(message);
        $('#alert-info').show();
        //var timer = setTimeout(function () {
        //    $('#alert-info').hide();
        //    clearTimeout(timer);
        //}, 10000)
    };

    self.alertWarning = function (message) {
        $('#alert-warning-message').html(message);
        $('#alert-warning').show();
        //setTimeout(function () {
        //    $('#alert-warning').hide();
        //}, 10000)
    };

    self.alertDanger = function (message) {
        $('#alert-danger-message').html(message);
        $('#alert-danger').show();
        //setTimeout(function () {
        //    $('#alert-danger').hide();
        //}, 10000)
    };

    self.showSpinLoading = function (showed) {
        if (showed) {
            $('#spin-running').show();
        }
        else {
            $('#spin-running').hide();
        }

    }

    self.convertSecondsToHHmmss = function (numberSeconds) {

        try {
            return new Date(numberSeconds * 1000).toISOString().slice(11, 19);
        }
        catch {
            return 0;
        }

    }


    //lịch
    self.periodpicker = function (id) {
        jQuery(id).periodpicker({
            norange: true,
            lang: 'vi',
            i18n: {
                'vi': {
                    'Select week #': 'Chọn tuần #',
                    'Select period': 'Chọn khoảng thời gian',
                    'Open fullscreen': 'Mở toàn màn hình',
                    'Close': 'Đóng',
                    'OK': 'Đồng ý',
                    'Choose period': 'Chọn khoảng thời gian',
                    'Choose date': 'Chọn ngày phát sóng',
                    'Select date': 'Chọn ngày phát sóng'
                }
            },
            formatDate: 'DD-MM-YYYY',
            cells: [1, 2],
            okButton: false,
        });
    }

    self.periodpickerInMonth = function (id) {
        jQuery(id).periodpicker({
            norange: true,
            lang: 'vi',
            i18n: {
                'vi': {
                    'Select week #': 'Chọn tuần #',
                    'Select period': 'Chọn khoảng thời gian',
                    'Open fullscreen': 'Mở toàn màn hình',
                    'Close': 'Đóng',
                    'OK': 'Đồng ý',
                    'Choose period': 'Chọn khoảng thời gian',
                    'Choose date': 'Chọn ngày phát sóng',
                    'Select date': 'Chọn ngày phát sóng'
                }
            },
            formatDate: 'DD-MM-YYYY',
            cells: [1, 1],
            okButton: false,
            withoutBottomPanel: true,
            yearsLine: false,
            title: false,
            closeButton: false,
            fullsizeButton: false
        });
    }


    // input format hh:mm:ss
    self.getFielDuration = function () {
        $(".fieldDuration").inputmask(
            "99:59:59",
            {
                placeholder: "00:00:00",
                insertMode: false,
                showMaskOnHover: false,
                definitions: {
                    '5': {
                        validator: "[0-5]",
                        cardinality: 1
                    }
                }
            });
    }


    self.scrollToBottom = (id) => {
        const element = document.getElementById(id);
        element.scrollTop = element.scrollHeight + 5500000;
    }



    self.searchingTable = (inputId, tag) => {
        $("#" + inputId).on("keyup", function () {
            var value = $(this).val().toLowerCase();
            removeHighlighting($(`#table-modal tbody tr em`));

            $(`#table-modal tbody tr`).each(function (index) {
                if (index !== 0) {
                    $row = $(this);
                    if (tag == "a") {
                        var $tdElement = $row.find("td.search").find('a');

                    }
                    else if (tag == "span") {
                        var $tdElement = $row.find("td.search").find('span');
                    }
                    else {
                        var $tdElement = $row.find("td.search");
                    }
                    var id = $tdElement.text().toLowerCase();
                    var matchedIndex = id.indexOf(value);

                    if (matchedIndex != 0) {
                        $row.hide();
                    }
                    else {
                        addHighlighting($tdElement, value);
                        $row.show();
                    }
                }
            });
        });

    }

    self.searchingTableWithInput = (inputId, tag) => {
        $("#" + inputId).on("keyup", function () {
            var value = $(this).val().toLowerCase();

            removeHighlighting($(`#table-modal tbody tr em`));

            $(`#table-modal tbody tr`).each(function (index) {
                if (index !== 0) {
                    $row = $(this);
                    if (tag == "input") {
                        var $tdElement = $row.find("td.search").find('input');

                    } else {
                        var $tdElement = $row.find("td.search");
                    }
                    var id = $tdElement.val().toLowerCase();
                    var matchedIndex = id.indexOf(value);

                    if (matchedIndex != 0) {
                        $row.hide();
                    }
                    else {
                        addHighlighting($tdElement, value);
                        $row.show();
                    }
                }
            });
        });

    }

    function removeHighlighting(highlightedElements) {
        highlightedElements.each(function () {
            var element = $(this);
            element.replaceWith(element.html());
        })
    }

    function addHighlighting(element, textToHighlight) {
        var text = element.text();
        var highlightedText = '<em>' + textToHighlight + '</em>';
        var newText = text.replace(textToHighlight, highlightedText);

        element.html(newText);
    }

    //Đếm từ 
    self.countText = function (content) {
        if (content != null) {
            return content.split(' ').length == 1 ? 0 : content.split(' ').length;
        }
        else {
            return 0;
        }
    }

    self.FileExtension = function (fileName) {
        return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : "";
    }

    const sizeSuffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    self.ByteSizeToString = function (size) {
        if (size === 0) {
            return `0 ${sizeSuffixes[0]}`;
        }

        const absSize = Math.abs(size);
        const fpPower = Math.log10(absSize) / 3;
        const intPower = Math.floor(fpPower);
        const iUnit = intPower >= sizeSuffixes.length ? sizeSuffixes.length - 1 : intPower;
        const normSize = absSize / Math.pow(1000, iUnit);

        return `${size < 0 ? "-" : ""}${normSize.toFixed(1)} ${sizeSuffixes[iUnit]}`;
    }

    self.nonAccentVietnamese = function (str) {
        str = str.toLowerCase();
        str = str.replaceAll('"', '');
        str = str.replaceAll(':', '');
        str = str.replaceAll(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replaceAll(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replaceAll(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replaceAll(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replaceAll(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replaceAll(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replaceAll(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replaceAll(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replaceAll(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        // remove accents, swap ñ for n, etc
        var from = "áàảãạăẵẳằắặâẫẩầấậđéẽèẻèêễếềểệíìỉĩịóòõỏọôỗồổốộơỡởờớợúũùủụưữửừứựýỹỷỳỵ·/_,:;";
        var to = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '_') // collapse whitespace and replace by -
            .replace(/-+/g, '_'); // collapse dashes

        return str.toUpperCase().replace(/\s+/g, "_");
    }

    self.copyStringToClipboard = function (string) {
        var textarea;
        var result;
        try {
            textarea = document.createElement('textarea');
            textarea.setAttribute('readonly', true);
            textarea.setAttribute('contenteditable', true);
            textarea.style.position = 'fixed';
            textarea.value = string;

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            var range = document.createRange();
            range.selectNodeContents(textarea);

            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            textarea.setSelectionRange(0, textarea.value.length);
            result = document.execCommand('copy');
        } catch (err) {
            console.error(err);
            result = null;
        } finally {
            document.body.removeChild(textarea);
        }

        if (!result) {
            var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            var copyHotkey = isMac ? '⌘C' : 'CTRL+C';
            result = prompt('Press ' + copyHotkey, string);
            if (!result) {
                return false;
            }
        }
        return true;
    }

    self.formatBytes = function (bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    self.convertDuration = function (seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    //Điều khiển thiết bị
    let modelCommand = {
        "NguonID": "H24",
        "TenNguon": "THÀNH PHỐ HẢI PHÒNG",
        "DanhSachDiaBanNhan": [
            {
                "DichID": "H24",
                "TenDich": "Hải Phòng"
            }
        ],
        "DanhSachThietBi": {
            "CumLoaID": []
        },
        "DieuKhienThietBi": {
            "MaLenh": "0",
            "ThamSo": "80"
        }
    }

    self.getComboTreeSelect = function () {

        let obj = {
            SiteMapId: Number(comboTree._selectedItem.id),
            Status: true,
            Imeis: []
        }
        if (comboTree._selectedItem.id == null) {
            obj.Status = false
            self.showtoastError("Bạn chưa chọn địa bàn điều khiển")
        }

        var array = [];
        var checkboxes = $('input[name="checked[]"]');
        checkboxes.filter(":checked").map(function () {
            array.push(this.value)
        }).get();
        obj.Imeis = array


        return obj

    }

    self.setVolumn = function () {
        var array = [];
        var checkboxes = $('input[name="checked[]"]');
        checkboxes.filter(":checked").map(function () {
            array.push(this.value)
        }).get();

        bootbox.confirm({
            message: "Bạn có muốn cập nhật âm thanh không?",
            buttons: {
                confirm: {
                    label: 'Đồng ý',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Hủy bỏ',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    if (self.getComboTreeSelect().Status == true) {
                        let obj = {
                            SiteId: Number(CurrentSiteId),
                            SiteMapId: self.getComboTreeSelect().SiteMapId,
                            CumLoaID: array,
                            MaLenh: "0",
                            ThamSo: $('.set-volumn').val().toString()
                        }

                        $.ajax({
                            url: '/api/ControlDevice/ip/command',
                            type: 'post',
                            contentType: 'application/json',
                            dataType: 'json',
                            data: JSON.stringify(obj),
                        }).done(function (result) {
                            console.log(result)
                            if (result == null) {
                                self.showtoastError("Lệnh điều khiển thất bại")
                            }
                            else {
                                if (result.TrangThaiGui == 1) {
                                    self.showtoastError("Lệnh điều khiển thất bại! " + result.MoTa)
                                } else {
                                    self.showtoastState("Đã cập nhật lệnh điều khiển")
                                }
                            }

                        })
                    }
                }
            }
        });
        // var list1 = [];     
    }


    self.fieldTypes = ko.observableArray([
        { Value: "0", Name: "Chọn loại lĩnh vực" },
        { Value: "1", Name: "Thông tin chung" },
        { Value: "2", Name: "Thông tin đột xuất" },
        { Value: "3", Name: "Thông tin về đường lối, chủ trương của Đảng, chính sách, pháp luật của Nhà nước" },
        { Value: "4", Name: "Thông tin chỉ đạo, điều hành của cấp ủy, chính quyền cơ sở" },
        { Value: "5", Name: "Thông tin về kiến thức khoa học, kỹ thuật, kinh tế, văn hóa, xã hội" },
        { Value: "6", Name: "Thông tin về gương người tốt, việc tốt, điển hình tiên tiến" },
    ])


    self.fieldType = function (FieldType) {
        let value = "";
        switch (FieldType) {
            case "1":
                value = "Thông tin chung";
                break;
            case "2":
                value = "Thông tin đột xuất";
                break;
            case "3":
                value = "Thông tin về đường lối, chủ trương của Đảng, chính sách, pháp luật của Nhà nước";
                break;
            case "4":
                value = " Thông tin chỉ đạo, điều hành của cấp ủy, chính quyền cơ sở";
                break;
            case "5":
                value = "Thông tin về kiến thức khoa học, kỹ thuật, kinh tế, văn hóa, xã hội";
                break;
            case "6":
                value = "Thông tin về gương người tốt, việc tốt, điển hình tiên tiến";
                break;
            default:
                value = "";
                break;
        }
        return value;
    }

    self.contentTypes = ko.observableArray([
        { Value: "0", Name: "Chọn loại bản tin" },
        { Value: "1", Name: "Bản tin ký tự" },
        { Value: "2", Name: "Bản tin hình ảnh" },
        { Value: "3", Name: "Bản tin âm thanh" },
        { Value: "4", Name: "Bản tin Video" },
        { Value: "5", Name: "Bản tin Trực tiếp" },
    ])

    self.contentType = function (ContentType) {
        let value = "";
        switch (ContentType) {
            case "1":
                value = "Bản tin ký tự";
                break;
            case "2":
                value = "Bản tin hình ảnh";
                break;
            case "3":
                value = "Bản tin âm thanh";
                break;
            case "4":
                value = "Bản tin Video";
                break;
            case "5":
                value = "Bản tin Trực tiếp";
                break;
            case "6":
                value = "Bản tin FM";
                break;
            case "":
                value = "Streaming";
                break;
            default:
                value = "";
                break;
        }
        return value;
    }


    self.priorityLevels = ko.observableArray([
        { Value: "0", Name: "Chọn loại mức độ ưu tiên" },
        { Value: "1", Name: "Bản tin khẩn cấp" },
        { Value: "2", Name: "Bản tin  ưu tiên" },
        { Value: "3", Name: "Bản tin thông thường" },
    ])
    self.priorityLevel = function (PriorityLevel) {
        let value = "";
        switch (PriorityLevel) {
            case "1":
                value = "Bản tin khẩn cấp";
                break;
            case "2":
                value = "Bản tin ưu tiên";
                break;
            case "3":
                value = "Bản tin thông thường";
                break;
            default:
                value = "";
                break;
        }
        return value;
    }
    const inputs = document.querySelectorAll('.otp-input input');

    self.openModalOtp = function () {
        $('#otp').modal('show')
    }
    self.hideModalOtp = function () {
        $('#otp').modal('hide')
    }
    self.resetOtp = function () {
        self.otp("")
        const otp = Array.from(inputs).map(input => {
            input.value = ""
            console.log(input.value)
        })
    }
    self.otp = ko.observable("");
    self.verifyOTP = function () {
        const otp = Array.from(inputs).map(input => input.value).join('');

        if (otp.length === 6) {
            self.otp(otp)
        } else {
            self.showtoastError('Vui lòng nhập đủ 6 số OTP');
        }
    }

    self.officeToHtml = function (model, data) {
        $("#view-contaniner").officeToHtml({
            url: data.Data.FilePath,
            pdfSetting: {
                setLang: "vi",
                thumbnailViewBtn: false,
                searchBtn: false,
                nextPreviousBtn: false,
                pageNumberTxt: true,
                totalPagesLabel: true,
                zoomBtns: false,
                scaleSelector: false,
                presantationModeBtn: true,
                openFileBtn: false,
                printBtn: false,
                downloadBtn: false,
                bookmarkBtn: false,
                secondaryToolbarBtn: false,
                firstPageBtn: false,
                lastPageBtn: false,
                pageRotateCwBtn: false,
                pageRotateCcwBtn: false,
                cursorSelectTextToolbarBtn: false,
                cursorHandToolbarBtn: false,
                comments: true
            },
            sheetSetting: {
                jqueryui: false,
                activeHeaderClassName: "",
                allowEmpty: true,
                autoColumnSize: true,
                autoRowSize: false,
                columns: false,
                columnSorting: true,
                contextMenu: false,
                copyable: true,
                customBorders: false,
                fixedColumnsLeft: 0,
                fixedRowsTop: 0,
                language: 'en-US',
                search: false,
                selectionMode: 'single',
                sortIndicator: false,
                readOnly: false,
                startRows: 1,
                startCols: 1,
                rowHeaders: true,
                colHeaders: true,
                width: false,
                height: false
            },
            docxSetting: {
                styleMap: null,
                includeEmbeddedStyleMap: true,
                includeDefaultStyleMap: true,
                convertImage: null,
                ignoreEmptyParagraphs: false,
                idPrefix: "",
                isRtl: "auto"
            },
            pptxSetting: {
                slidesScale: "50%",
                slideMode: true,
                slideType: "revealjs",
                revealjsPath: "./revealjs/reveal.js",
                keyBoardShortCut: true,
                mediaProcess: true,
                jsZipV2: false,
                slideModeConfig: {
                    first: 1,
                    nav: true,
                    navTxtColor: "black",
                    keyBoardShortCut: false,
                    showSlideNum: true,
                    showTotalSlideNum: true,
                    autoSlide: 1,
                    randomAutoSlide: false,
                    loop: true,
                    background: false,
                    transition: "default",
                    transitionTime: 1
                },
                revealjsConfig: {}
            },
            sheetSetting: {
                jqueryui: false,
                activeHeaderClassName: "",
                allowEmpty: true,
                autoColumnSize: true,
                autoRowSize: false,
                columns: false,
                columnSorting: true,
                contextMenu: false,
                copyable: true,
                customBorders: false,
                fixedColumnsLeft: 0,
                fixedRowsTop: 0,
                language: 'en-US',
                search: false,
                selectionMode: 'single',
                sortIndicator: false,
                readOnly: false,
                startRows: 1,
                startCols: 1,
                rowHeaders: true,
                colHeaders: true,
                width: false,
                height: false
            },
            imageSetting: {
                frame: ['100%', '100%', false],
                maxZoom: '900%',
                zoomFactor: '10%',
                mouse: true,
                keyboard: true,
                toolbar: true,
                rotateToolbar: false
            }
        });
    }

    //ratio

    self.formatNumber = function (value, format) {
        const num = parseFloat(value);
        if (isNaN(num)) return '';

        const [intPart, decPart] = format.split('.');
        const maxDecimals = decPart ? decPart.length : 0;
        const minDecimals = decPart ? decPart.replace(/#/g, '').length : 0;

        let fixed = num.toFixed(maxDecimals);

        if (maxDecimals > 0) {
            // Bỏ các số 0 không cần thiết ở cuối nếu dùng ký tự `#`
            if (decPart.includes('#')) {
                fixed = fixed.replace(/\.?0+$/, ''); // remove trailing .00 etc
            }
        }

        // Nếu yêu cầu giữ ít nhất `minDecimals`, ta cần thêm lại số 0 nếu thiếu
        if (minDecimals > 0) {
            let [fInt, fDec = ''] = fixed.split('.');
            while (fDec.length < minDecimals) {
                fDec += '0';
            }
            fixed = fInt + (fDec ? '.' + fDec : '');
        }

        return fixed;
    }

}



