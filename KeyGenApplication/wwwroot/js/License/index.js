
function LicenseItem(ID, LicenseName, LicenseValue, DeviceId, DeviceName, Status, CreatedTime, ExpiredTime) {
    var self = this;
    self.id = ko.observable(ID || 0);
    self.licenseName = ko.observable(LicenseName || '');
    self.licenseValue = ko.observable(LicenseValue || '');
    self.deviceId = ko.observable(DeviceId || 0);
    self.deviceName = ko.observable(DeviceName || '');
    self.status = ko.observable(Status || 0);
    self.createdTime = ko.observable(CreatedTime || null);
    self.expiredTime = ko.observable(ExpiredTime || null);

}

ko.bindingHandlers.select2 = {
    init: function (element, valueAccessor, allBindings) {
        $(element).select2({
            width: '100%',
            placeholder: allBindings.get('optionsCaption') || 'Chọn...',
            allowClear: true,
            minimumResultsForSearch: Infinity,
            // Thêm class để đồng bộ giao diện như bạn muốn
            containerCssClass: $(element).attr('class'),
            selectionCssClass: $(element).attr('class')
        });

        $(element).on('change', function () {
            var value = $(element).val();
            var observable = valueAccessor();

            if (ko.isObservable(observable)) {
                // Nếu giá trị rỗng hoặc null, set về 0 để khớp với mặc định của bạn
                if (value === null || value === "" || value === undefined) {
                    observable(0);
                } else {
                    // Chuyển sang kiểu số vì id trong statusOptions là số 
                    observable(parseInt(value));
                }
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).select2('destroy');
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        // Đảm bảo đồng bộ giao diện khi giá trị là 0
        $(element).val(value).trigger('change.select2');
    }
};

var LicenseViewModel = function (helper) {
    var self = this;
    self.helper = helper;

    //
    self.statusOptions = [
        { id: 1, name: "Active" },
        { id: 2, name: "Revoked" },
    ];
    self.statusTypeList = ko.observableArray(window.typeList || []);
    self.listLicenseItem = ko.observableArray();
    self.selectedLicenseItem = ko.observable(new LicenseItem());
    self.Filter = {
        LicenseName: ko.observable(""),
        Status: ko.observable(0),
    }
    self.OnFilter = function (obj, event) {
        self.GetAllLicenseItem();
    }
    self.clickLicenseItem = function (item, index) {
        //window.open(`/module/chi-tiet/${item.id()}`, '_self');
    };

    self.OnInit = function () {
        self.GetAllLicenseItem(0);
    }
    
    self.GetAllLicenseItem = function () {
        const data = {
            LicenseName: self.Filter.LicenseName(),
            Status: self.Filter.Status(),
            PageIndex: self.PageIndex(),
            PageSize: self.PageSize()
        };
        $.ajax({
            'url': '/api/License/Search',
            'method': 'GET',
            'dataType': 'json',
            'contentType': 'application/json',
            'data': data,
            'success': function (response) {
                self.listLicenseItem([]);
                if (response.code == 1) {
                    console.log("Get all license succes");
                    $.each(response.data.listing, function (ex, item) {
                        var license = new LicenseItem(
                            item.id,
                            item.licenseName,
                            item.licenseValue,
                            item.deviceID,
                            '',
                            item.status,
                            item.createdTime,
                            item.expiredTime,

                        );
                        self.listLicenseItem.push(license);
                        self.getDeviceName(license);
                    });
                    console.log("Get all license succes length " + self.listLicenseItem().length);


                    self.TotalCount(response.data.total);

                }
                else {
                    console.log("Get all license fail");
                }
            }
        });
    }

    self.InsertLicense = async function () {
        var result = await $.ajax({
            type: "POST",
            url: '/api/License/Insert',
            dataType: 'json',
            contentType: 'application/json',
            data: ko.mapping.toJSON(self.selectedLicenseItem()),
        });

        if (result.code === 1) {
            var resId = result.data;
            console.log("resId" + resId);
            self.GetAllLicenseItem(0);
        } else {
            self.helper.showtoastError('Thêm mới thất bại.');
        }
    }

 

    self.DeleteLicense = async function (licenseItem) {
        Swal.fire({
            title: 'Bạn có muốn xóa lựa chọn \"' + licenseItem.licenseName() + '\" ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    'url': "/api/License/Delete",
                    'method': 'POST',
                    'dataType': 'json',
                    'contentType': 'application/json',
                    'data': ko.mapping.toJSON(licenseItem),
                    'success': function (response) {

                        if (response.code == 1) {
                            self.helper.showtoastState('Xóa thành công.');                           
                            self.GetAllLicenseItem();
                        } else {
                            self.helper.showtoastError(result.message);
                        }
                    },

                });
            }
        })
    }

    self.OpenUpdateLicenseModal = function (licenseItem) {

        const raw = ko.toJS(ko.unwrap(licenseItem));     
        const clone = ko.mapping.fromJS(raw);
        self.selectedLicenseItem(clone);
        // format cho input date
        const ct = self.selectedLicenseItem().createdTime?.();
        const et = self.selectedLicenseItem().expiredTime?.();

        if (ct) self.selectedLicenseItem().createdTime(ct.substring(0, 10));
        if (et) self.selectedLicenseItem().expiredTime(et.substring(0, 10));

        self.selectedLicenseItem().createdTime(moment(self.selectedLicenseItem().createdTime()).format('DD/MM/YYYY'))
        self.selectedLicenseItem().expiredTime(moment(self.selectedLicenseItem().expiredTime()).format('DD/MM/YYYY'))
        $('#kt_modal_update_license').modal('show');
    }

    self.UpdateLicense = async function () {
        var licenseName = self.selectedLicenseItem().licenseName();
        const ct = self.selectedLicenseItem().createdTime();
        const et = self.selectedLicenseItem().expiredTime();
        if (!ct || !et || !licenseName) {
            self.helper.showtoastError("Hãy nhập đủ các trường dữ liệu");
            return;
        }
        if (!isExpiredAfterCreated(ct, et)) {
            self.helper.showtoastError('Thất bại. Ngày hết hạn phải sau ngày tạo!');
            return;
        }
        self.selectedLicenseItem().createdTime(
            moment(self.selectedLicenseItem().createdTime(), "DD/MM/YYYY", true)
                .format("YYYY-MM-DD[T]00:00:00")
        );

        self.selectedLicenseItem().expiredTime(
            moment(self.selectedLicenseItem().expiredTime(), "DD/MM/YYYY", true)
                .format("YYYY-MM-DD[T]00:00:00")
        );
   

        if (self.selectedLicenseItem() !== -1) {
            var result = await $.ajax({
                type: "POST",
                url: "/api/License/Update",
                dataType: 'json',
                contentType: 'application/json',
                data: ko.mapping.toJSON(self.selectedLicenseItem()),
            });

            if (result.code === 1) {
                self.helper.showtoastState('Cập nhật thành công.');
                var responseItem = self.helper.convertToKoObject(result.Message);
                $('#kt_modal_update_license').modal('hide');
                self.GetAllLicenseItem();
            } else {
                self.helper.showtoastError('Cập nhật thất bại.');
            }
        }
    }

    self.getDeviceName = function (licenseItem) {
        console.log("getDeviceName" + licenseItem.deviceId());
        const data = {
            ID: licenseItem.deviceId(),
        };
        $.ajax({
            'url': '/api/Device/GetById',
            'method': 'GET',
            'dataType': 'json',
            'contentType': 'application/json',
            'data': data,
            success: function (response) {
                if (response.data) {
                    var deviceItem = response.data

                    licenseItem.deviceName(deviceItem.deviceName);
                }
                else {
                    licenseItem.deviceName("");
                }
            },
            error: function () {
                devilicenseItemceItem.deviceName("");
            }
        });
    }

    self.getStatusName = function (id) {

        var intId = typeof id === 'string' ? parseInt(id, 10) : id;

        var item = ko.utils.arrayFirst(self.statusTypeList(), function (x) {
            return x.id === intId;
        });

        return item ? item.name : "N/A";
    };
    function isExpiredAfterCreated(createdStr, expiredStr) {
        const c = moment(createdStr, "DD/MM/YYYY", true);
        const e = moment(expiredStr, "DD/MM/YYYY", true);

        if (!c.isValid() || !e.isValid()) return false; // hoặc true tuỳ bạn xử lý
        return e.isAfter(c, "day"); // cho phép cùng ngày; đổi thành isAfter nếu bắt buộc sau hẳn
    }

   
    // Paging
    self.TotalPage = ko.observable(5);
    self.TotalCount = ko.observable(0);
    self.PageIndex = ko.observable(1);
    self.PageSize = ko.observable(10);

    self.PageCount = ko.computed(function () {
        return Math.ceil(self.TotalCount() / self.PageSize());
    });
    self.SetCurrentPage = function (page) {
        if (page < self.FirstPage)
            page = self.FirstPage;

        if (page > self.LastPage())
            page = self.LastPage();

        self.PageIndex(page);
        self.GetAllLicenseItem(0);
    };
    self.FirstPage = 1;
    self.LastPage = ko.computed(function () {
        return self.PageCount();
    });

    self.NextPage = ko.computed(function () {
        var next = self.PageIndex() + 1;
        if (next > self.LastPage())
            return null;
        return next;
    });

    self.PreviousPage = ko.computed(function () {
        var previous = self.PageIndex() - 1;
        if (previous < self.FirstPage)
            return null;
        return previous;
    });

    self.NeedPaging = ko.computed(function () {
        return self.PageCount() > 1;
    });

    self.NextPageActive = ko.computed(function () {
        return self.NextPage() != null;
    });

    self.PreviousPageActive = ko.computed(function () {
        return self.PreviousPage() != null;
    });

    self.LastPageActive = ko.computed(function () {
        return (self.LastPage() != self.PageIndex());
    });

    self.FirstPageActive = ko.computed(function () {
        return (self.FirstPage != self.PageIndex());
    });

    self.GenerateAllPages = function () {
        var pages = [];
        for (var i = self.FirstPage; i <= self.LastPage(); i++)
            pages.push(i);

        return pages;
    };

    self.GenerateMaxPage = function () {
        var current = self.PageIndex();
        var pageCount = self.PageCount();
        var first = self.FirstPage;

        var upperLimit = current + parseInt((self.TotalPage() - 1) / 2);
        var downLimit = current - parseInt((self.TotalPage() - 1) / 2);

        while (upperLimit > pageCount) {
            upperLimit--;
            if (downLimit > first)
                downLimit--;
        }

        while (downLimit < first) {
            downLimit++;
            if (upperLimit < pageCount)
                upperLimit++;
        }

        var pages = [];
        for (var i = downLimit; i <= upperLimit; i++) {
            pages.push(i);
        }
        return pages;
    };

    self.GetPages = ko.computed(function () {
        self.PageIndex();
        self.TotalCount();
        if (self.PageCount() <= self.TotalPage()) {
            return ko.observableArray(self.GenerateAllPages());
        } else {
            return ko.observableArray(self.GenerateMaxPage());
        }
    });

    self.GoToPage = function (page) {
        if (page >= self.FirstPage && page <= self.LastPage())
            self.SetCurrentPage(page);
    }

    self.GoToPrevious = function () {
        var previous = self.PreviousPage();
        if (previous != null)
            self.SetCurrentPage(previous);
    };

    self.GoToNext = function () {
        var next = self.NextPage();
        if (next != null)
            self.SetCurrentPage(next);
    };

    self.GoToFirst = function () {
        self.SetCurrentPage(self.FirstPage);
    };

    self.GoToLast = function () {
        var lastPage = self.LastPage()
        self.SetCurrentPage(lastPage);
    };
}