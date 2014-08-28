// flex
var flex = FORMx.flex = {
    selector: 'textarea[flex]',
    events: 'input propertychange change',
    adjust: function(el, shrunk) {
        var height = el.scrollHeight,
            style = el.style;
        if (height > el.offsetHeight - 2) {
            style.height = height + 'px';
        } else if (!shrunk) {
            style.height = '';
            flex.adjust(el, true);
        }

        var width = el.scrollWidth;
        if (width > el.offsetWidth) {
            style.width = width + 'px';
        } else if (!shrunk) {
            style.width = '';
            flex.adjust(el, true);
        }
    }
};
flex.events.split(' ').forEach(function(type) {
    Eventi.on(D.body, type+'<'+flex.selector+'>', function() {
        flex.adjust(this);
    });
});
// end flex
