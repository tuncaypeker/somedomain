
// Setup module
// ------------------------------

var FixedSidebarCustomScroll = function() {


    //
    // Setup module components
    //

    // Perfect scrollbar
    var _componentPerfectScrollbar = function() {
        if (typeof PerfectScrollbar == 'undefined') {
            return;
        }

        // Initialize
        var ps = new PerfectScrollbar('.sidebar-fixed .sidebar-content', {
            wheelSpeed: 2,
            wheelPropagation: true
        });
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function() {
            _componentPerfectScrollbar();
        }
    }
}();


// Initialize module
// ------------------------------

document.addEventListener('DOMContentLoaded', function() {
    FixedSidebarCustomScroll.init();
});
