function DeviceItem(ID, DeviceName, ChipsetID, License, LicenseStatus, Note) {
    var self = this;
    self.id = ko.observable(ID || 0);
    self.licenseItem = ko.observable(License || new LicenseItem());
    self.licenseStatus = ko.observable(LicenseStatus || 4);
    self.deviceName = ko.observable(DeviceName || '');
    self.chipsetID = ko.observable(ChipsetID || '');
    self.note = ko.observable(Note || '');
}
function LicenseItem(ID, LicenseName, LicenseValue, DeviceId, Status, CreatedTime, ExpiredTime) {
    var self = this;
    self.id = ko.observable(ID || 0);
    self.licenseName = ko.observable(LicenseName || '');
    self.licenseValue = ko.observable(LicenseValue || '');
    self.deviceId = ko.observable(DeviceId || 0);
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



var DeviceViewModel = function (helper) {
    var self = this;
    self.helper = helper;

    //
    self.statusOptions = [
        { id: 1, name: "Unassigned" },
        { id: 2, name: "Active" },
        { id: 3, name: "Expired" },
        { id: 4, name: "Revoked" },

    ];
  

    self.statusTypeList = ko.observableArray(window.typeList || []);
    self.listDeviceItem = ko.observableArray();
    self.selecteDeviceItem = ko.observable(new DeviceItem());
    self.selecteLicenseItem = ko.observable(new LicenseItem());

    self.Filter = {
        DeviceName: ko.observable(""),
        Status: ko.observable(0),
    }
    self.OnFilter = function (obj, event) {
        self.GetAllDeviceItem();
    }
    self.CloseAddModal = function () {
        $('#kt_modal_add_device').modal('hide');
    }
    self.CloseAttachLicenseModal = function () {
        $('#kt_modal_add_license').modal('hide');
    }


    self.OnInit = function () {
        self.GetAllDeviceItem();
    }

    self.clickDeviceItem = function (item, index) {

        window.open(`/device/chi-tiet/${item.id()}`, '_self');
    };

    self.GetAllDeviceItem = function () {

        const data = {
            DeviceName: self.Filter.DeviceName(),
            Status: self.Filter.Status(),
            PageIndex: self.PageIndex(),
            PageSize: self.PageSize()
        };

        $.ajax({
            'url': '/api/Device/Search',
            'method': 'GET',
            'dataType': 'json',
            'contentType': 'application/json',
            'data': data,
            'success': function (response) {
                self.listDeviceItem([]);
                if (response.code == 1) {
                    console.log("Get all module succes");
                    $.each(response.data.listing, function (ex, item) {
                        var device = new DeviceItem(
                            item.id,
                            item.deviceName,
                            item.chipsetID,
                            '',// License ban đầu
                            4,// License status ban đầu
                            item.note
                        );
                        self.listDeviceItem.push(device);
                        self.getAttachedLicense(device);
                    });
                    console.log("Get all module succes length " + self.listDeviceItem().length);


                    self.TotalCount(response.data.total);

                    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
                        new bootstrap.Tooltip(el);
                    });

                }
                else {
                    console.log("Get all module fail");
                }
            }
        });
    }

    self.OpenAddDeviceModal = function () {
        self.selecteDeviceItem(new DeviceItem());
        $('#kt_modal_add_device').modal('show');
    }
    self.InsertDevice = async function () {
        var chipsetID = self.selecteDeviceItem().chipsetID();
        var deviceName = self.selecteDeviceItem().deviceName();
        if (!chipsetID || !deviceName) {
            self.helper.showtoastError("Hãy nhập đủ các trường dữ liệu");
            return;
        }
        var result = await $.ajax({
            type: "POST",
            url: '/api/Device/Insert',
            dataType: 'json',
            contentType: 'application/json',
            data: ko.mapping.toJSON(self.selecteDeviceItem()),
        });

        if (result.code === 1) {
            var resId = result.data;
            console.log("resId" + resId);
            self.CloseAddModal();
            self.GetAllDeviceItem();
        } else if(result.code = -2) {
            self.helper.showtoastError('Thêm mới thất bại. Thiết bị đã được đăng ký');
        }
        else {
            self.helper.showtoastError('Thêm mới thất bại.');
        }
    }

    self.DeleteDevice = async function (deviceItem) {
        Swal.fire({
            title: 'Bạn có muốn xóa máy \"' + deviceItem.deviceName() + '\" ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    'url': "/api/Device/Delete",
                    'method': 'POST',
                    'dataType': 'json',
                    'contentType': 'application/json',
                    'data': ko.mapping.toJSON(deviceItem),
                    'success': function (response) {
                        if (response.code == 1) {
                            self.helper.showtoastState('Xóa thành công.');
                            self.DeleteLicense(deviceItem.licenseItem());
                            self.GetAllDeviceItem();
                        } else {
                            self.helper.showtoastError(result.message);
                        }
                    },

                });
            }
        })
    }

    self.OpenUpdateDeviceModal = function (deviceItem) {
        self.selecteDeviceItem(deviceItem);
        $('#kt_modal_update_device').modal('show');
    }
    self.CloseUpdateDeviceModal = function () {
        $('#kt_modal_update_device').modal('hide');
    }
    self.UpdateDevice = async function () {
            // Update existing poll
            var result = await $.ajax({
                type: "POST",
                url: "/api/Device/Update",
                dataType: 'json',
                contentType: 'application/json',
                data: ko.mapping.toJSON(self.selecteDeviceItem()),
            });

            if (result.code === 1) {
                self.helper.showtoastState('Cập nhật thành công.');
                var responseItem = self.helper.convertToKoObject(result.Message);
                self.CloseUpdateDeviceModal();
                self.GetAllDeviceItem();
            } else {
                self.helper.showtoastError('Cập nhật thất bại.');
            }      
    }

    //License
    self.getLicenseStatus = function (licenseItem) {
        // 1. Kiểm tra nếu đối tượng không tồn tại
        if (!licenseItem) {
            return "Unassigned";
        }
        var status = licenseItem.status;
        var expiredTime = licenseItem.expiredTime;
        var now = new Date();
        var expire = new Date(expiredTime);
        if (status === 2) {
            return "Revoked"
        }
        if (status === 3) {
            return "Deleted"
        }
        if (expire < now) {
            return "Expired";
        } else {
            return "Active";
        }
        if (!licenseItem) {
            return "Unassign";
        }
    }
    self.getLicenseStatusText = function (lic) {
        // lic có thể là observable hoặc object
        lic = (typeof lic === "function") ? lic() : lic;

        if (!lic) return "Unassigned";

        const status = typeof lic.status === "function" ? lic.status() : lic.status;
        const expiredTime = typeof lic.expiredTime === "function" ? lic.expiredTime() : lic.expiredTime;

        if (status === 2) return "Revoked";
        if (status === 3) return "Deleted";

        if (expiredTime) {
            const now = new Date();
            const exp = new Date(expiredTime);
            if (!isNaN(exp.getTime()) && exp < now) return "Expired";
        }

        return "Active";
    };

    self.getLicenseStatusClass = function (lic) {
        lic = (typeof lic === "function") ? lic() : lic;

        if (!lic) return "badge-secondary"; // Unassigned

        const status = typeof lic.status === "function" ? lic.status() : lic.status;
        const expiredTime = typeof lic.expiredTime === "function" ? lic.expiredTime() : lic.expiredTime;

        if (status === 2) return "badge-light-warning";  // Revoked (cam)
        if (status === 3) return "badge-light-dark";     // Deleted (đen/xám)

        if (expiredTime) {
            const now = new Date();
            const exp = new Date(expiredTime);
            if (!isNaN(exp.getTime()) && exp < now) return "badge-light-danger"; // Expired (đỏ)
        }

        return "badge-light-success"; // Active (xanh)
    };

    self.OpenAssignLicenseModal = function (deviceItem) {

        self.selecteDeviceItem(deviceItem);

        self.selecteLicenseItem().deviceId(deviceItem.id()); // nhớ id() vì observable

        // mở modal bằng Bootstrap 5 (không cần data-bs-toggle nữa)
        $('#kt_modal_add_license').modal('show');
    };

    self.getAttachedLicense = function (deviceItem) {
        console.log("getdetail", deviceItem.id());

        $.ajax({
            url: "/api/License/GetByDeviceId",
            method: "GET",
            dataType: "json",
            data: { DeviceId: deviceItem.id() },

            success: function (response) {
                const li = response && response.data;

                if (li && li.licenseValue && String(li.licenseValue).trim() !== "") {
                    // map JSON -> LicenseItem instance (observable fields)
                    const mapped = new LicenseItem(
                        li.id,
                        li.licenseName,
                        li.licenseValue,
                        li.deviceId,
                        li.status,
                        li.createdTime,
                        li.expiredTime
                    );
                    deviceItem.licenseItem(mapped);

                    // nếu getLicenseStatus nhận JSON thì truyền li, nếu nhận instance thì truyền mapped
                    deviceItem.licenseStatus(self.getLicenseStatus(li));
                } else {
                    deviceItem.licenseItem(null);
                    deviceItem.licenseStatus("Unassign"); // ví dụ 4 = Unassign (giữ kiểu số)
                }
            },

            error: function () {
                deviceItem.licenseItem(null);
                deviceItem.licenseStatus("Unassign"); // Unassign / Unknown tùy bạn
            }
        });
    };
   
    self.generateLicense = async function () {
        var licenseName = self.selecteLicenseItem().licenseName();
        const ct = self.selecteLicenseItem().createdTime();
        const et = self.selecteLicenseItem().expiredTime();
        if (!ct || !et || !licenseName) {
            self.helper.showtoastError("Hãy nhập đủ các trường dữ liệu");
            return;
        }
        if (!isExpiredAfterCreated(ct, et)) {
            self.helper.showtoastError('Thất bại. Ngày hết hạn phải sau ngày tạo!');
            return;
        }
        var formatCt = moment(self.selecteLicenseItem().createdTime(), "DD/MM/YYYY", true)
            .format("YYYY-MM-DD[T]00:00:00");
        var formatEt = moment(self.selecteLicenseItem().expiredTime(), "DD/MM/YYYY", true)
            .format("YYYY-MM-DD[T]00:00:00");
        const data = {
            ChipSetId: self.selecteDeviceItem().chipsetID(),
            StartTime: formatCt,
            ExpiredTime: formatEt,
        };
        return $.ajax({
            url: '/api/License/GenLicense',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: ko.mapping.toJSON(data)
        }).then(function (response) {
            const licenseValue = response?.message ?? '';
            self.selecteLicenseItem().licenseValue(licenseValue);
            return licenseValue;
        }).catch(function () {
            self.selecteLicenseItem().licenseValue('');
            throw new Error('Gen license failed');
        });
    }

    self.AttachedLicense = async function () {
      
        var license = await self.generateLicense();
        if (license) {
            var formatCt = moment(self.selecteLicenseItem().createdTime(), "DD/MM/YYYY", true)
                .format("YYYY-MM-DD[T]00:00:00");
            var formatEt = moment(self.selecteLicenseItem().expiredTime(), "DD/MM/YYYY", true)
                .format("YYYY-MM-DD[T]00:00:00");
            const data = {
                DeviceID: self.selecteLicenseItem().deviceId(),
                LicenseName: self.selecteLicenseItem().licenseName(),
                LicenseValue: self.selecteLicenseItem().licenseValue(),
                Status: 1,
                CreatedTime: formatCt,
                ExpiredTime: formatEt,
            };

            var result = await $.ajax({
                type: "POST",
                url: '/api/License/Insert',
                dataType: 'json',
                contentType: 'application/json',
                data: ko.mapping.toJSON(data),
            });

            if (result.code === 1) {
                self.CloseAttachLicenseModal();
                self.GetAllDeviceItem();
            } else {
                self.helper.showtoastError('Thêm mới thất bại.');
            }
        }
    }

    function isExpiredAfterCreated(createdStr, expiredStr) {
        const c = moment(createdStr, "DD/MM/YYYY", true);
        const e = moment(expiredStr, "DD/MM/YYYY", true);

        if (!c.isValid() || !e.isValid()) return false; // hoặc true tuỳ bạn xử lý
        return e.isAfter(c, "day"); // cho phép cùng ngày; đổi thành isAfter nếu bắt buộc sau hẳn
    }

    self.DeleteLicense = async function (licenseItem) {
         $.ajax({
                    'url': "/api/License/Delete",
                    'method': 'POST',
                    'dataType': 'json',
                    'contentType': 'application/json',
                    'data': ko.mapping.toJSON(licenseItem),
                    'success': function (response) {
                        if (response.code == 1) {
                        } else {
                            self.helper.showtoastError(result.message);
                        }
                    },

                });
    }

    self.CopyLicense = function (deviceItem, index) {
        const lic = deviceItem?.licenseItem?.()?.licenseValue?.() ?? "";

        const btns = document.querySelectorAll(".copy-icon");
        const btn = btns[index];

        if (!lic.trim()) {
            if (btn) showCopyTooltip(btn, "Không có license để copy", "warn"); // cam
            return;
        }

        navigator.clipboard.writeText(lic).then(function () {
            if (btn) showCopyTooltip(btn, "Sao chép thành công", "ok"); // xanh
        }).catch(function (err) {
            console.error("Copy failed:", err);
            if (btn) showCopyTooltip(btn, "Không sao chép được", "warn"); // cam
        });
    };

    function showCopyTooltip(targetEl, message, type) {
        const tooltip = document.createElement("div");
        tooltip.className = `copy-tooltip ${type || "ok"}`;
        tooltip.textContent = message;

        document.body.appendChild(tooltip);

        const rect = targetEl.getBoundingClientRect();
        const gap = 10;

        const left = rect.left + window.scrollX - tooltip.offsetWidth - gap;
        const top = rect.top + window.scrollY + (rect.height - tooltip.offsetHeight) / 2;

        tooltip.style.left = `${Math.max(8, left)}px`;
        tooltip.style.top = `${Math.max(8, top)}px`;

        setTimeout(() => tooltip.remove(), 1200);
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
        self.GetAllDeviceItem();
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