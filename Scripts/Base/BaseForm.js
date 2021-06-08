class BaseForm {
    constructor(formId) {
        let me = this;

        me.Form = $(formId);

        me.initEvents();
    }

     /**
     * Hàm khởi tạo các sự kiện
     * DVHAI 02/06/2021
     */
    initEvents() {
        let me = this;

        //sự kiện button click trên form
        me.initEventButtonClick();

        //Hàm cho phép kéo thả, di chuyển form
        me.draggable();

        // sự kiện key up trên form
        me.initKeyupEvent();

    }

    /**
     * Hàm tùy chỉnh sự kiện trên form
     * DVHAI 04/06/2021
     */
     initKeyupEvent() {
        let me = this;

        me.keyupEnter();
     }

    /**
     * Sự kiện enter trên form thì sẽ save
     * DVHAI 04/06/2021
     */
    keyupEnter() {
        let me = this;

        me.Form.on("keyup", function(e){
            if(e.keyCode == Enumeration.Keyboard.Enter) {
                me.save();
            } else if(e.keyCode == Enumeration.Keyboard.Esc) {
                me.cancel();
            }
        });
       
    }

    /**
     * Hàm cho phép kéo thả, di chuyển form
     * DVHAI 04/06/2021
     */
    draggable() {
        let me = this;
        
        me.Form.draggable({ handle: ".form-head" });
    }
    
    
    /**
     * DVHAI 02/06/2021
     * 
     * @param {các field trong form} control 
     * @param {kiểu dữ liệu của nó} dataType 
     * @returns dữ liệu từ text về chuẩn lưu db
     */
    getValueControl(control, dataType) {
        let me = this,
            value = control.val();

        switch (dataType) {
            case Resource.DataTypeColumn.Date:
                value = new Date(value);
                break;
            case Resource.DataTypeColumn.Number:
                value = CommonFn.removeSymbol(value);
                value = parseInt(value);
                break;
            case Resource.DataTypeColumn.Enum:
                value = parseInt(value);
                break;
            default:
                break;
        }

        return value;
    }

    /**
     * 
     * Hàm binding data vào form
     * 
     * DVHAI 02/06/2021
     */
    bindingData(data) {
        let me = this;

        me.Form.find("[FieldName]").each(function(){
            let control = $(this),
                fieldName = control.attr("FieldName"),
                dataType = control.attr("DataType"),
                value = data[fieldName];
            
            me.setValueControl(control, value, dataType);
        });
    }

    /**
     * 
     * Hàm đưa dữ liệu về dạng chuẩn
     * 
     * DVHAI 02/06/2021
     */
     setValueControl(control, value, dataType) {
         let me = this;

         switch(dataType) {
            case Resource.DataTypeColumn.Date:
                value = CommonFn.convertDate(value);
            case Resource.DataTypeColumn.Number:
                value = CommonFn.formatMoneyVer2(value);
            break;
         }

         control.val(value);
     }


    /**
     * 
     * Hàm chứa các sự kiện click trên form
     * 
     * DVHAI 02/06/2021
     */
    initEventButtonClick() {
        let me = this;

        me.Form.find(".btnForm").on("click", function() {
            let command = $(this).attr("Command");

            switch(command) {
                case Resource.CommandForm.Save:
                    me.save();
                    break;
                case Resource.CommandForm.Cancel:
                    me.cancel();
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 
     * Hàm thực hiện các thao tác trước khi 
     * luu dữ liệu và lưu
     * 
     * DVHAI 02/06/2021
     */
    save() {
        let me = this,
            isValid = me.validateForm();
        
        if(isValid) {
            debugger
            var data = me.getDataForm();
            me.saveData(data);
        }
    }

    
    /**
     * 
     * Hàm lưu dữ liệu xuống db
     * 
     * DVHAI 02/06/2021
     */
    saveData(data) {
        let me = this,
            url = me.Parent.urlAdd,
            method = Resource.Method.Post,
            urlFull = `${Constant.urlPrefix}${url}`;
        
        if(me.FormMode == Enumeration.FormMode.Edit) {
            debugger
            url = me.Parent.urlEdit;
            method = Resource.Method.Put;
            urlFull = `${Constant.urlPrefix}${url}/${data[me.ItemId]}`;
        }
        debugger
        CommonFn.Ajax(urlFull, method, data, function(response){
            if(response) {
               
                //thông báo thành công
                swal({
                    title:`Thêm thành công ${me.Parent.entity}`,
                    text:'',
                    icon:'success'
                });

                //load lại data mới
                me.Parent.getDataServer();

                //đóng form
                me.cancel();
            } else {
                alert("loi");
            }
        });
        
    }


    /**
     * 
     * Hàm validate form
     * 
     * DVHAI 02/06/2021
     */
    validateForm() {
        let me = this,
            isValid = true;
        
        if(isValid) {
            isValid = me.validateRequierd();
        }

        if(isValid) {
            // isValid = me.validateNumber();
        }

        if(isValid) {
            isValid = me.validateFieldDate();
        }

        if(isValid) {
            isValid = me.validateCustom();
        }

        return isValid;
    }

    /**
     * 
     * Hàm validate trống
     * 
     * DVHAI 03/06/2021
     */
    validateRequierd() {
        let me = this,
            isValid = true;

        me.Form.find('[Required=true]').each(function(){
            let value = $(this).val();

            if(!value) {
                isValid = false;

                $(this).addClass('notValidControl');
                $(this).attr('title', 'Vui lòng không để trống');
            } else {
                $(this).removeClass('notValidControl');
            }
        })

        return isValid;
    }

    /**
     * 
     * Hàm validate number
     * 
     * DVHAI 03/06/2021
     */
    validateNumber() {
        let me = this,
        isValid = true;

        // Duyệt hết các trường require xem có trường nào bắt buộc mà ko có value ko
        me.Form.find("[DataType='Number']").each(function(){
            let value = $(this).val();

            // is not a number
            if(isNaN(value)){
                isValid = false;

                $(this).addClass("notValidControl");
                $(this).attr("title", "Vui lòng nhập đúng định dạng!");
            }else{
                $(this).removeClass("notValidControl");
            }
        });

        return isValid;
    }

    /**
     * 
     * Hàm validate validateFieldDate
     * 
     * DVHAI 03/06/2021
     */
    validateFieldDate() {
        let me = this,
        isValid = true;

        // Các trường đúng date
        me.Form.find("[DataType='Date']").each(function(){
            let value = $(this).val();

            if(!CommonFn.isDateFormat(value)){
                isValid = false;

                $(this).addClass("notValidControl");
                $(this).attr("title", "Vui lòng nhập đúng định dạng!");
            }else{
                $(this).removeClass("notValidControl");
            }
        });

        return isValid;
    }

    /**
     * Hàm validate dữ liệu riêng cho mỗi trang
     * 
     * DVHAI 02/06/2021
     */
    validateCustom() {
        return true;
    }

    /**
     * 
     * Hàm lấy dữ liệu từ form
     * 
     * DVHAI 02/06/2021
     */

    getDataForm() {
        let me = this,
            data = me.Record || {};
  
        me.Form.find("[FieldName]").each(function() {
            let field = $(this),
                fieldName = field.attr("FieldName"),
                dataType = field.attr("DataType"),
                value = me.getValueControl(field, dataType);

            data[fieldName] = value;
        });
        var test = data;
        debugger
        return data;
    }


    /**
     * 
     * Hàm ẩn form khi người dùn click cancel
     * 
     * DVHAI 02/06/2021
     */
    cancel() {
        let me = this;

        me.Form.hide();
    }
    
    /**
     * 
     * Hàm mở form thêm,sửa
     * DVHAI 02/06/2021
     *
     */
    open(param) {
        let me = this;

        Object.assign(me, param);

        me.show();

        //tự động focus ô đầu tiên
        me.autoFocus()
        
        if(me.FormMode == Enumeration.FormMode.Edit) {
            me.bindingData(me.Record);
        }
    }

    /**
     * 
     * Hàm tự động focus ô đầu tiên khi form được mở
     * DVHAI 04/06/2021
     *
     */
    autoFocus() {
        let me = this;

        me.Form.find("input[type!=hidden]:first").focus();
    }

    /**
     * 
     * Hàm hiển thị form
     * DVHAI 02/06/2021
     *
     */
    show() {
        let me = this;

        me.Form.show();

        //reset dữ liệu
        me.resetForm();
    }

    /**
     * 
     * Hàm xóa trắng dữ liệu trên các field
     * DVHAI 02/06/2021
     *
     */
    resetForm() {
        let me = this;

        me.Form.find("[FieldName]").val("");

        me.Form.find(".notValidControl").removeClass("notValidControl");
    }

}