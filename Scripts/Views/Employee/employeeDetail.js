class EmployeeDetail extends BaseForm {
    constructor(formId) {
        super(formId);
    }

    show() {
        let me = this;

        me.Form.slideToggle();
    }
}