class Department extends BaseGrid {
    constructor(gridId) {
        super(gridId);

        this.config();
    }

    //config các cấu hình
    config() {
        let me = this,
            config = {
                urlAdd:'api/Department',
                urlEdit: 'api/Department',
                urlDelete: 'api/Department'
            };
        
        Object.assign(me, config);
    }

    /**
     * DVHAI
     * 03/06/2021
     */
    initFormDetail(formId) {
        let me = this;

        me.formDetail = new DepartmentDetail(formId);
    }
}

var department = new Department("#grid-data");
department.initFormDetail("#formDepartmentDetail");