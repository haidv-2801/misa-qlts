/**
 * Class chứa các thao tác và trạng thái của sidebar 
 *  (sửa chưa xong, dùng code cũ dưới)
 * DVHAI 01/06/2021
 */
// class Sidebar {
//     constructor(sidebarId) {
//         let me = this;
       
//         me.sidebar = $(sidebarId);

//         //lưu trạng thái của sidebar
//         me.navCollapsed = false;

//         //chứa các sự kiện
//         me.initEvents();
//     }

//     initEvents() {
//         let me = this;
//         $(".navbar-item").on("click", function () {
//             me.openDropdown($(this));
//         });
//     }

//     openDropdown(navIteam) {
//         let me = this,
//             navItem = $(navIteam);
        
//         // nếu có dropdown thì mở
//         if(navIteam.next(".subitem-dropdown").hasClass("subitem-dropdown")) {
//             navIteam.next(".subitem-dropdown").slideToggle();
//             navIteam.find('.icon-right svg').toggleClass('rotate');  
//             navIteam.toggleClass('blue-color');
//         }

//         //đóng những cái khác
//         me.closeAllDropdown(navIteam);
//     }

//     closeAllDropdown(excItem = null) {
//         let me = this,
//             navIteam = me.sidebar.find(".navbar-item").not(excItem);
            
//         // nếu có dropdown thì đóng
//         if(navIteam.next(".subitem-dropdown").hasClass("subitem-dropdown")) {
//             navIteam.next(".subitem-dropdown").slideUp();
//             navIteam.find('.icon-right svg').removeClass('rotate');
//         }
//     }
// }


var navCollapsed = false;
/**
 * Hàm dùng hiển slide up và slide down các dropdown
 * trong sidebar khi chưa collape
 * 
 * DVHAI 30/05/2021
 */
 $(document).ready(function () {

    $('.navbar-item').on('click', function () {
        let me = $(this),
            thisDropData = me.next('.subitem-dropdown');
        
        // kiểm tra trạng thái sidebar
        // alert(navCollapsed);
       
        if(thisDropData.hasClass('subitem-dropdown')) {
            if(navCollapsed == true) {
                thisDropData.toggleClass("nav-child-state");
                me.toggleClass("nav-parent-state");
            }
            //nếu item này có dropdown data
            else
             {
                
                //đóng các thằng đang mở dropdown trừ nó và xoay arrow
                $('.navbar .subitem-dropdown').not(thisDropData).slideUp();
                $('.navbar-item').not(me).find('.icon-right svg').removeClass('rotate');
                $('.navbar-item').not(me).removeClass('blue-color');
               debugger
                //mở thằng hiện tại
                thisDropData.slideToggle();
                me.find('.icon-right svg').toggleClass('rotate');  
                me.toggleClass('blue-color');
            }
        }
        else
        {
            //collapsed all
        }

    });
});

/**
 * Co dãn sidebar
 * DVHAI 01/06/2021
 */

$(document).ready(function () {
    $('#app-logo .app-font svg,.sidebar .navbar-item:last-child').on('click', function () {
        let className = "nav--collappsed";
        
        $(".sidebar").toggleClass(className);
        navCollapsed = !navCollapsed;
    });
});



/**
 * Lớp asset
 * DVHAI 31/05/2021
 */

class Asset {
    constructor(gridId) {
        let me = this;

        //Lưu lại grid của trang
        me.grid = $(gridId);

        //hàm thực hiện các sự kiện
        me.initEvents();
    }

    initEvents() {

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
            tr = $('<tr><td><input type="checkbox"></td></tr>'),
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
                me.grid.find(".col").each(function() {
                    let fieldName = $(this).attr("FieldName"),
                        data = item[fieldName],
                        cell = $("<td></td>"),
                        dataType = $(this).attr("DataType"),
                        className = me.getClassName(dataType),
                        value = me.formatValue(data, dataType);

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
            case "Number":
                className = "align-right";
                break;
            case "Date":
                className = "align-center";
                break;
        }

        return className;
    }

    formatValue(data, dataType) {
        let me = this;

        switch(dataType) {
            case "Number":
                data = formatMoney(data);
                break;
            case "Date":
                break;
        }

        return data;
    }
}

var asset = new Asset("#grid-data");
asset.loadData(assets);

