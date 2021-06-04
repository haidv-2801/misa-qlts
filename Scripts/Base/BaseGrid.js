class BaseGrid {
    constructor(gridId) {
        let me = this;

        //Lưu lại grid của trang
        me.grid = $(gridId);

        //hàm thực hiện các sự kiện
        me.initEvents();

        //hàm loaddata từ server
        me.getDataServer();

        //thuộc tính formdetail
        me.formDetail = null;

    }

    /**
     * 
     * Hàm tạo base form
     * 
     * DVHAI 03/06/2021
     */
    initFormDetail(formId) {
        let me = this;

        me.formDetail = new BaseForm(formId);
    }

    initEvents() {
        let me = this;

        //sự kiện trên toolbar
        me.initEventsToolbar();

        //sự kiện click row trên bảng
        me.eventClickRow();

        //sự kiện check box trên row
        me.eventCheckRow();

        //hàm cho phép multiselect trên table
        me.multiSelect();
        
    }

    /**
     * hàm cho phép multiselect trên table
     * 
     * DVHAI 04/06/2021
     */
    multiSelect() {
        let me = this;

        me.grid.find('table tbody').selectable();
    }

    /**
     * 
     * Hàm chứa các sự kiện của toolbar
     * 
     * DVHAI 02/06/2021
     */
     initEventsToolbar() {
    
        let me = this,
            toolbarId = me.grid.attr("Toolbar"),
            toolbar = $(`#${toolbarId}`);
        
        if(toolbar.length > 0) {
            toolbar.find(".buttonItem").on("click", function () {
                let CommandType = $(this).attr("CommandType"),
                    fireEvent = null;
                 
                switch(CommandType) {
                    case Resource.CommandType.Add:
                       fireEvent = me.add;
                        break;
                    case Resource.CommandType.Edit:
                       fireEvent = me.edit;
                        break;
                    case Resource.CommandType.Delete:
                       fireEvent = me.delete;
                        break;
                    case Resource.CommandType.Refresh:
                       fireEvent = me.refresh;
                        break;
                    case Resource.CommandType.Export:
                       fireEvent = me.export;
                        break;
                    case Resource.CommandType.Import:
                       fireEvent = me.import;
                        break;
                    case Resource.CommandType.SlideToggle:
                        fireEvent = me.slideToggle;
                            break;
                    default:
                        break;
                };
    
                if(typeof fireEvent == "function") {
                    fireEvent = fireEvent.bind(me);
                    fireEvent();
                }
    
            });
        }
    }

    /**
     * Hàm cho phép ẩn hiện toolbar
     * 
     * DVHAI 04/06/2021 
     */
    slideToggle() {
        let me = this,
            toolbarId = me.grid.attr("Toolbar"),
            toolbar = $(`#${toolbarId}`);

        toolbar.find('.toggle-area').animate({width:'toggle'}, 350);
    }
    
    /**
     * 
     * Hàm thêm mới bản ghi
     * 
     * DVHAI 02/06/2021
     */
    add() {
       
        let me = this,
            param = {
                Parent: me,
                FormMode: Enumeration.FormMode.Add,
                Record: {}
            };
           
        if(me.formDetail) {
            me.formDetail.open(param);
        }
    }

    
    /**
     * 
     * Hàm sửa bản ghi
     * 
     * DVHAI 02/06/2021
     */
     edit() {
        let me = this,
            param = {
                Parent: me,
                FormMode: Resource.FormMode.edit,
                Record: {...me.getSelectedRecord()},
                ItemId: me.ItemId,
            };
        
        if(me.formDetail) {
            me.formDetail.open(param);
        }
    }

    /**
     * 
     * Hàm lấy ra bản ghi được select
     * 
     * DVHAI 02/06/2021
     */
    getSelectedRecord() {
        let me = this,
            data = {},
            selectedList = me.grid.find(".selected-row");

        //nếu có nhiều hơn 1 bản ghi trả về thằng đầu
        if(selectedList.length > 1) {
            data = selectedList.eq(0).data("value");
        }

        return data;
    }

    /**
     * 
     * Refresh lại dữ liệu trên bảng
     * 
     * DVHAI 02/06/2021
     */

    refresh() {
        let me = this;
        me.getDataServer();
    }
 

    /**
     * 
     * Hàm sự kiện click row trong bảng
     * 
     * DVHAI 02/06/2021
     */
    eventClickRow() {
        let me = this;
        me.grid.on("click", "tbody tr", function() {
            me.grid.find(".selected-row").removeClass("selected-row");
            
            $(this).toggleClass("selected-row");
            // $(this).find("input:checkbox").prop("checked", !$(this).is(":checked"));
        });
     }

     /**
     * 
     * Hàm sự kiện check row trong bảng
     * 
     * DVHAI 03/06/2021
     */
    eventCheckRow() {
        let me = this;
            
            me.grid.on("click", "input:checkbox", function() {  
                
                let isHead = $(this).data("head"),
                    tbodyCheckbox = me.grid.find('tbody input:checkbox');
               
                //nếu thằng đầu được check thì sẽ gọi toggle check những 
                //thằng còn lại
                if(isHead) {
                    let cur = $(this);

                    me.toggleCheck(cur);
                   
                    if(cur.is(':checked')) {
                        // debugger
                        // me.grid.find("tbody input:checkbox").addClass('selected-row');
                    } else {
                        
                        me.grid.find("tbody input:checkbox").removeClass("selected-row");
                    }
                    

                } else {
                    let checked = me.grid.find("tbody input:checked").length;
                    // nếu check hết thằng dưới->checkhead
                    if(checked == tbodyCheckbox.length) {
                        me.grid.find('thead input:checkbox').prop('checked', true);
                    } else {
                        me.grid.find('thead input:checkbox').prop('checked', false);
                    }
                }
            }); 
     }

    /**
     * 
     * Hàm sự kiện check tất cả các dòng nếu head
     * được check
     * 
     * DVHAI 03/06/2021
     */

     toggleCheck(head) {
        let me = this;

        me.grid.find("input:checkbox").not(head).prop('checked', head.is(':checked'));
    }


    /**
     * 
     * Hàm lấy data từ server
     * 
     * DVHAI 02/06/2021
     */

    getDataServer() {
        let me = this,
            url = me.grid.attr("Url"),
            fullUrl = `${Constant.urlPrefix}${url}`;

        CommonFn.Ajax(fullUrl, Resource.Method.Get, {}, (response) => {
            if(response) {
                me.loadData(response);
            } else {
                alert("loi server");
            }
        });
    }


    /**
     * 
     * Hàm load bảng
     * 
     * DVHAI 30/05/2021
     */
    loadData(data) {
        let me = this,
            table = $("<table></table>"),
            thead = me.loadThead(),
            tbody = me.loadTbody(data);
        
        // Đặt lại bảng
        me.grid.find("table").html("");
        
        //truyền dữ liệu vào bảng
        table.append(thead);
        table.append(tbody);
        me.grid.append(table);

        //làm một số thứ sau khi binding dữ liệu xong
        me.afterBinding();
    }


    
    /**
     * 
     * Hàm làm một số thứ sau khi binding dữ liệu xong
     * 
     * DVHAI 02/06/2021
     */
    afterBinding() {
        let me = this;

        //lấy id phân biệt các bản ghi
        me.ItemId = me.grid.attr("ItemId");

        //đặt selected dòng đầu
        me.grid.find("tbody tr").eq(0).addClass("selected-row");
    }


    /**
     * 
     * Hàm load các tên cột
     * 
     * DVHAI 30/05/2021
     */
    loadThead() {
        let me = this,
            thead = $("<thead></thead>"),
            tr = $('<tr><td><input data-head="true" type="checkbox"></td></tr>'),
            cols = me.grid.find(".col");
        
        cols.filter(function(){
            let fieldName = $(this).text(),
                dataType = $(this).attr("DataType"),
                className = me.getClassName(dataType),
                td = $("<td></td>");

            td.append(fieldName);
            if(className) {
                td.addClass(className);
            }
            tr.append(td);
        });
        
        thead.append(tr);
        return thead;
    }


     /**
     * 
     * Hàm load phần thân bảng
     * 
     * DVHAI 30/05/2021
     */
    loadTbody(data) {
        let me = this,
            tbody = $("<tbody></tbody>");
        
        if(data && data.length > 0) {
            data.filter(function(item){
                let tr = $('<tr><td><input type="checkbox"></td></tr>');
               
                //duyệt trên các cột ảo đề map value tương ứng
                me.grid.find(".col").each(function() {
                    let fieldName = $(this).attr("FieldName"),
                        data = item[fieldName],
                        cell = $("<td></td>"),
                        dataType = $(this).attr("DataType"),
                        className = me.getClassName(dataType),
                        value = me.formatValue(data, dataType, $(this));

                    cell.text(value);
                    cell.addClass(className);
                    tr.append(cell);
                });

                tbody.append(tr);
            });
        }

        return tbody;
    }

    /**
     * 
     * Hàm lấy class name theo kiểu dữ liệu
     * 
     * DVHAI 30/05/2021
     */
    getClassName(dataType) {
        let me = this,
            className = "";
        
        switch(dataType) {
            case Resource.DataTypeColumn.Number:
                className = "align-right";
                break;
            case Resource.DataTypeColumn.Date:
                className = "align-center";
                break;
        }

        return className;
    }

    formatValue(data, dataType, column) {
        let me = this;
        
        if(dataType) {
            switch(dataType) {
                case Resource.DataTypeColumn.Number:
                    data = CommonFn.formatMoney(data);
                    break;
                case Resource.DataTypeColumn.Date:
                    data = CommonFn.formatDate(data);
                    break;
                case Resource.DataTypeColumn.Enum:
                    let enumName = column.attr("EnumName");
                    data = CommonFn.getValueEnum(data, enumName);
                    break;
            }
        }
        return data;
    }
}
