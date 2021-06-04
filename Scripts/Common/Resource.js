//Resource dùng chung cho toàn chương trình
var Resource  = Resource || {};

Resource.DataTypeColumn = {
    Number: "Number",
    Date: "Date",
    Enum: "Enum",
};


//Các method khi gọi ajax
Resource.Method = {
    Get: "Get",
    Post: "Post",
    Put: "Put",
    Delete: "Delete",
}


//Giới tính
Resource.Gender = {
    Female: "Nữ",
    Male: "Nam",
    Other: "Khác",
};



//Các comandtype của toolbar
Resource.CommandType = {
    Add: "Add",
    Edit: "Edit",
    Delete: "Delete",
    Refresh: "Refresh",
    Import: "Import",
    Export: "Export",
    SlideToggle: "SlideToggle" 
};


//Các commandform của toolbar
Resource.CommandForm = {
    Save: "Save",
    Cancel: "Cancel"
};