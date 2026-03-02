function DeviceItem(ID, DeviceName, ChipsetID, License, LicenseStatus, Note) {
    var self = this;
    self.id = ko.observable(ID || 0);
    self.licenseItem = ko.observable(License || new LicenseItem());
    self.licenseStatus = ko.observable(LicenseStatus || 4);
    self.deviceName = ko.observable(DeviceName || '');
    self.chipsetID = ko.observable(ChipsetID || '');
    self.note = ko.observable(Note || '');
}
function LicenseItem(ID, LicenseName, LicenseValue, DeviceID, Status, CreatedTime, ExpiredTime) {
    var self = this;
    self.id = ko.observable(ID || 0);
    self.licenseName = ko.observable(LicenseName || '');
    self.licenseValue = ko.observable(LicenseValue || '');
    self.deviceID = ko.observable(DeviceID || 0);
    self.status = ko.observable(Status || 0);
    self.createdTime = ko.observable(CreatedTime || null);
    self.expiredTime = ko.observable(ExpiredTime || null);
}

var DetailDeviceViewModel = function (deviceID,helper) {
    var self = this;
    self.helper = helper;

    //
    self.statusOptions = [
        { id: 1, name: "Unassigned" },
        { id: 2, name: "Active" },
        { id: 3, name: "Expired" },
        { id: 4, name: "Revoked" },

    ];
  
    self.selectedDeviceItem = ko.observable(new DeviceItem());
    self.selectedLicenseItem = ko.observable(new LicenseItem());

    self.OnInit = function () {
        self.GetDetailDevice();
    }
    //Device
    self.GetDetailDevice = async function () {
        self.selectedDeviceItem(new DeviceItem());
        self.selectedLicenseItem(new LicenseItem());
        console.log("GetDetailDevice " + deviceID);
        $.ajax({
            url: "/api/Device/GetById",
            method: "GET",
            dataType: "json",
            data: { ID: deviceID },

            success: function (response) {
                const item = response && response.data;

                if (item) {
                    // map JSON -> LicenseItem instance (observable fields)
                    const deviceItem = new DeviceItem(
                        item.id,
                        item.deviceName,
                        item.chipsetID,
                        "",
                        4,
                        item.note,
                  
                    );
                    self.selectedDeviceItem(deviceItem);
                    self.getAttachedLicense();
                } else {
                    self.selectedDeviceItem(new DeviceItem());
                }
            },

            error: function () {
                self.selectedDeviceItem(new DeviceItem());
            }
        });
    }

    self.DeleteDevice = async function () {
        Swal.fire({
            title: 'Bạn có muốn xóa máy \"' + self.selectedDeviceItem().deviceName() + '\" ?',
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
                    'data': ko.mapping.toJSON(self.selectedDeviceItem()),
                    'success': function (response) {
                        if (response.code == 1) {
                            self.helper.showtoastState('Xóa thành công.');
                            self.DeleteLicense(self.selectedDeviceItem().licenseItem());
                        } else {
                            self.helper.showtoastError(result.message);
                        }
                    },

                });
            }
        })
    }

    self.UpdateDevice = async function () {
            // Update existing poll
            var result = await $.ajax({
                type: "POST",
                url: "/api/Device/Update",
                dataType: 'json',
                contentType: 'application/json',
                data: ko.mapping.toJSON(self.selectedDeviceItem()),
            });

            if (result.code === 1) {
                self.helper.showtoastState('Cập nhật thành công.');
                self.GetDetailDevice();
            } else {
                self.helper.showtoastError('Cập nhật thất bại.');
            }      
    }

    //License

    self.OpenAssignLicenseModal = function () {

     
        self.selectedLicenseItem().deviceId(deviceItem.id()); // nhớ id() vì observable

        // mở modal bằng Bootstrap 5 (không cần data-bs-toggle nữa)
        $('#kt_modal_add_license').modal('show');
    };

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

    self.getLicenseStatusText = function () {
        var lic = self.selectedLicenseItem();
        if (!lic.licenseValue()) return "Unassigned";
        
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
        var lic = self.selectedLicenseItem();

        if (!lic.licenseValue()) return "badge-secondary"; // Unassigned

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

    self.OpenAssignLicenseModal = function () {


        self.selectedLicenseItem().deviceID(self.selectedDeviceItem().id()); // nhớ id() vì observable

        // mở modal bằng Bootstrap 5 (không cần data-bs-toggle nữa)
        $('#kt_modal_add_license').modal('show');
    };
    self.CloseAttachLicenseModal = function () {
        $('#kt_modal_add_license').modal('hide');
    }

    self.getAttachedLicense = function () {
        console.log("getAttachedLicense ", self.selectedDeviceItem().id());
        $.ajax({
            url: "/api/License/GetByDeviceId",
            method: "GET",
            dataType: "json",
            data: { DeviceId: self.selectedDeviceItem().id() },

            success: function (response) {
                const li = response && response.data;

                if (li && li.licenseValue && String(li.licenseValue).trim() !== "") {
                    // map JSON -> LicenseItem instance (observable fields)
                    const mapped = new LicenseItem(
                        li.id,
                        li.licenseName,
                        li.licenseValue,
                        li.deviceID,
                        li.status,
                        li.createdTime,
                        li.expiredTime
                    );

                    self.selectedLicenseItem(mapped);
                    // format cho input date
                    const ct = self.selectedLicenseItem().createdTime?.();
                    const et = self.selectedLicenseItem().expiredTime?.();

                    if (ct) self.selectedLicenseItem().createdTime(ct.substring(0, 10));
                    if (et) self.selectedLicenseItem().expiredTime(et.substring(0, 10));

                    self.selectedLicenseItem().createdTime(moment(self.selectedLicenseItem().createdTime()).format('DD/MM/YYYY'))
                    self.selectedLicenseItem().expiredTime(moment(self.selectedLicenseItem().expiredTime()).format('DD/MM/YYYY'))

                    self.selectedDeviceItem().licenseItem(mapped);


                    // nếu getLicenseStatus nhận JSON thì truyền li, nếu nhận instance thì truyền mapped
                    self.selectedDeviceItem().licenseStatus(self.getLicenseStatus(li));
                } else {
                    self.selectedDeviceItem().licenseItem(null);
                    self.selectedDeviceItem().licenseStatus("Unassign"); // ví dụ 4 = Unassign (giữ kiểu số)
                }
            },

            error: function () {
                self.selectedDeviceItem().licenseItem(null);
                self.selectedDeviceItem().licenseStatus("Unassign"); // Unassign / Unknown tùy bạn
            }
        });
    };
   
    self.generateLicense = async function () {
        var licenseName = self.selectedLicenseItem().licenseName();
        var startTime = self.selectedLicenseItem().createdTime();
        var expiredTime = self.selectedLicenseItem().expiredTime();
        if (!startTime || !expiredTime || !licenseName) {
            self.helper.showtoastError("Hãy nhập đủ các trường dữ liệu");
            return;
        }
        const data = {
            ChipSetId: self.selectedDeviceItem().chipsetID(),
            StartTime: startTime,
            ExpiredTime: expiredTime,
        };
        return $.ajax({
            url: '/api/License/GenLicense',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).then(function (response) {
            const licenseValue = response?.message ?? '';
            self.selectedLicenseItem().licenseValue(licenseValue);
            return licenseValue;
        }).catch(function () {
            self.selectedLicenseItem().licenseValue('');
            throw new Error('Gen license failed');
        });
    }

    self.AttachedLicense = async function () {
        //var chipsetID = self.selecteDeviceItem().chipsetID();
        //var deviceName = self.selecteDeviceItem().deviceName();
        //if (!chipsetID || !deviceName) {
        //    self.helper.showtoastError("Hãy nhập đủ các trường dữ liệu");
        //    return;
        //}
        await self.generateLicense();
        const data = {        
            DeviceID: self.selectedLicenseItem().deviceID(),
            LicenseName: self.selectedLicenseItem().licenseName(),
            LicenseValue: self.selectedLicenseItem().licenseValue(),
            Status: 1,
            CreatedTime: self.selectedLicenseItem().createdTime(),
            ExpiredTime: self.selectedLicenseItem().expiredTime(),
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
            self.GetDetailDevice();
        } else {
            self.helper.showtoastError('Thêm mới thất bại.');
        }
    }

    self.DeleteLicense = async function () {
        Swal.fire({
            title: 'Bạn có muốn xóa \"' + self.selectedLicenseItem().licenseName() + '\" ?',
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
                    'data': ko.mapping.toJSON(self.selectedLicenseItem()),
                    'success': function (response) {
                        if (response.code == 1) {
                            self.helper.showtoastState('Cập nhật thành công.');
                            self.GetDetailDevice();
                        } else {
                            self.helper.showtoastError(result.message);
                        }
                    },

                });
            }
        })
        
    }
      
    self.UpdateLicense = async function () {


        const ct = self.selectedLicenseItem().createdTime();
        const et = self.selectedLicenseItem().expiredTime();

        if (!isExpiredAfterCreated(ct, et)) {
            self.helper.showtoastError('Cập nhật thất bại. Ngày hết hạn phải sau ngày tạo!');
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
            // Update existing poll
            var result = await $.ajax({
                type: "POST",
                url: "/api/License/Update",
                dataType: 'json',
                contentType: 'application/json',
                data: ko.mapping.toJSON(self.selectedLicenseItem()),
            });

            if (result.code === 1) {
                self.helper.showtoastState('Cập nhật thành công.');         
                self.GetDetailDevice();
            } else {
                self.helper.showtoastError('Cập nhật thất bại.');
            }
        }
    }
    self.RevokeLicense = async function () {
        Swal.fire({
            title: 'Bạn có muốn thu hồi \"' + self.selectedLicenseItem().licenseName() + '\" ?',
            showCancelButton: true,
            confirmButtonText: 'Thu hồi',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    'url': "/api/License/Revoke",
                    'method': 'POST',
                    'dataType': 'json',
                    'contentType': 'application/json',
                    'data': ko.mapping.toJSON(self.selectedLicenseItem()),
                    'success': function (response) {
                        if (response.code == 1) {
                            self.helper.showtoastState('Thu hồi thành công.');
                            self.GetDetailDevice();
                        } else {
                            self.helper.showtoastError(result.message);
                        }
                    },

                });
            }
        })

    }
    function isExpiredAfterCreated(createdStr, expiredStr) {
        const c = moment(createdStr, "DD/MM/YYYY", true);
        const e = moment(expiredStr, "DD/MM/YYYY", true);

        if (!c.isValid() || !e.isValid()) return false; // hoặc true tuỳ bạn xử lý
        return e.isAfter(c, "day"); // cho phép cùng ngày; đổi thành isAfter nếu bắt buộc sau hẳn
    }
   
   
}