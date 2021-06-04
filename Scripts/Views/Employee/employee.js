class Employee extends BaseGrid {
    constructor(gridId) {
        super(gridId);

        this.config();
    }

    config() {
        let me = this,
            config = {
                urlAdd: 'v1/Employees',
                urlEdit: '/v1/Employees',
                urlDelete: '/v1/Employees',
            };

        Object.assign(me, config);
    }

    initFormDetail(formId) {
        let me = this;

        me.formDetail  = new EmployeeDetail(formId);
    }
}

//khởi tạo ra 1 đói tượng employee
var employee = new Employee('#grid-data');

//khởi tạo ra 1 đói tượng employee
employee.initFormDetail('#formEmployeeDetail');