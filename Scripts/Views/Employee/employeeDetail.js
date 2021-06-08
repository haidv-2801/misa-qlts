/**
 * Lớp employee sử lí màn hình add hoặc edit
 * DVHAI 04/06/2021
 */
class EmployeeDetail extends BaseForm {
    constructor(formId) {
        super(formId);
        let me = this;

        me.initCustomEvent();
    }

     /**
     * Hàm validate tùy chỉnh theo từng màn hình
     * DVHAI 04/06/2021
     */
    validateCustom() {
        let me = this,
            isValid = true;

        if(isValid) {
            isValid = me.validateDuplicateCode();
        }

        if(isValid) {
            isValid = me.validateEmail();
        }

        if(isValid) {
            isValid = me.validatePhone();
        }
        
        return isValid;
    }

    /**
     * Hàm này có chức năng kiểm tra 
     * xem sdt có hợp lệ
     * DVHAI 05/06/2021
     */
    validatePhone() {
        let me = this,
            control = me.Form.find("[FieldName=PhoneNumber]"),
            value = control.val(),
            isValid = true;

        if(!CommonFn.validatePhone(value)) {
            isValid = false;
        }
        
        if(!isValid) {
            control.addClass("notValidControl");
            alert("Số điện thoại phải đúng định dạng");
            control.focus();
        } else {
            control.removeClass("notValidControl");
        }

        return isValid;
    }

    /**
     * Hàm này có chức năng kiểm tra 
     * xem code này có chưa
     * DVHAI 05/06/2021
     */
    validateDuplicateCode() {
        let me = this,
            control = me.Form.find("[FieldName=EmployeeCode]"),
            value = control.val(),
            isValid = true,
            record = me.getEmployeeByCode(value);

        if (me.FormMode === Enumeration.FormMode.Add) {
            if (record.length > 0) {
                isValid = false;
            }
        } else {
            if(record.length > 0 && me.Record['EmployeeId'] !== record[0]['EmployeeId']) {
                isValid = false;
            } else {
                //
            }
        }

        if(!isValid) {
            control.addClass("notValidControl");
            alert("Mã nhân viên bị trùng");
            control.focus();
        } else {
            control.removeClass("notValidControl");
        }

        return isValid;
    }

     /**
     * Hàm có chức năng validate email
     * DVHAI 05/06/2021
     */
    validateEmail() {
        let me = this,
            control = me.Form.find("[FieldName=Email]"),
            value = control.val(),
            isValid = true;

        if(!CommonFn.validateEmail(value)) {
            alert("Nhập đúng định dạng email");
            isValid = false;
            control.focus();
        }

        debugger
        return isValid;
    }

    /**
     * Hàm lấy danh sách nhân viên theo code
     * DVHAI 05/06/2021
     */
    getEmployeeByCode(code) {
        let me = this,
            record = me.AllRecord,
            result = [];

        if(record.length > 0) {
            result = record.filter(x=>x.EmployeeCode == code);
        }

        //nếu không có thằng nào thì null
        return result;
    }

    /**
     * Hàm custom event trong màn hình riêng
     * DVHAI 04/06/2021
     */
     initCustomEvent() {
        let me = this;
        
        me.formatName();

        me.formatMoney();
    }

     /**
     * Hàm format lại tên
     * viết hoa chữ đầu, xóa khoảng trắng thừa
     * DVHAI 04/06/2021
     */
    formatName() {
        let me = this;

        me.Form.on("focusout", "[FieldName=FullName]", function(){
            let text = $(this).val();
            $(this).val(CommonFn.formatName(text));
        });
    }

     /**
     * Hàm format lại tiền
     * sinh dấu , ngăn cách 
     * DVHAI 04/06/2021
     */
    formatMoney() {
        let me = this;

        me.Form.on("keyup", "[FieldName=Salary]", function(){
            let text = $(this).val(),
                noSymbol = CommonFn.onlyNumber(text);
           
            $(this).val(CommonFn.formatMoneyVer2(noSymbol));
        });
    }
}