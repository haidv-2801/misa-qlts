/**
 * Class chứa các thao tác và trạng thái của sidebar 
 *  (sửa chưa xong, dùng code cũ dưới)
 * DVHAI 01/06/2021
 */
class Sidebar {
    constructor(sidebarId) {
        let me = this;
       
        me.sidebar = $(sidebarId);

        //lưu trạng thái của sidebar
        me.navCollapsed = false;

        //chứa các sự kiện
        me.initEvents();
    }

    initEvents() {
        let me = this;
        $(".navbar-item").on("click", function () {
            me.openDropdown($(this));
        });
    }

    openDropdown(navIteam) {
        let me = this,
            navItem = $(navIteam);
        
        // nếu có dropdown thì mở
        if(navIteam.next(".subitem-dropdown").hasClass("subitem-dropdown")) {
            navIteam.next(".subitem-dropdown").slideToggle();
            navIteam.find('.icon-right svg').toggleClass('rotate');  
            navIteam.toggleClass('blue-color');
        }

        //đóng những cái khác
        me.closeAllDropdown(navIteam);
    }

    closeAllDropdown(excItem = null) {
        let me = this,
            navIteam = me.sidebar.find(".navbar-item").not(excItem);
            
        // nếu có dropdown thì đóng
        if(navIteam.next(".subitem-dropdown").hasClass("subitem-dropdown")) {
            navIteam.next(".subitem-dropdown").slideUp();
            navIteam.find('.icon-right svg').removeClass('rotate');
        }
    }
}

// var sidebar = new Sidebar(".sidebar");


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
                thisDropData.slideToggle();
                thisDropData.toggleClass("nav-child-state");
            }
            //nếu item này có dropdown data
            else
             {
                
                //đóng các thằng đang mở dropdown trừ nó và xoay arrow
                $('.navbar .subitem-dropdown').not(thisDropData).slideUp();
                $('.navbar-item').not(me).find('.icon-right svg').removeClass('rotate');
                $('.navbar-item').not(me).removeClass('blue-color');
               
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



