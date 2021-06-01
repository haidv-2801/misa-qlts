$(document).ready(function () {
    $(document).tooltip();
});

// Hàm format tiền
function formatMoney(money){
    if(!isNaN(money)){
        return money.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");
    }else{
        return money;
    }
}


