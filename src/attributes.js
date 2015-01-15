// attributes
var attributes = FORMx.attributes = {
    selector: 'form[attributes]',
    init: function() {
        D.queryAll(attributes.selector).each(function(form) {
            attributes.list(form).forEach(function(name) {
                form.setAttribute(name, form.queryName(name).xValue);
            });
            Eventi.on(form, 'change input propertychange', attributes.change);
        });
    },
    list: function(form) {
        return (form.getAttribute('attributes') || '').split(',');
    },
    change: function(e) {
        var el = e.target,
            name = el.name;
        if (attributes.list(this).indexOf(name) >= 0) {
            this.setAttribute(name, el.xValue);
        }
    }
};
attributes.init();// early availability
D.addEventListener('DOMContentLoaded', attributes.init);// eventual consistency
// end attributes