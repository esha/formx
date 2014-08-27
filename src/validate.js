// validate
var validate = FORMx.validate = {
    // natural extension points
    type: {
        number: /^\-?\d*(\.\d+)?$/,
        email: /^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        url: /^http.[^\s]+$/i
    },
    constraints: {
        required: function(value) {
            return !(value && value.trim());
        },
        pattern: function(value, pattern) {
            return value && !value.match(new RegExp('^'+pattern+'$'));
        },
        'equal-to': function(value, other) {
            return value !== validate.valueOf(other);
        },
        'not-equal': function(value, other) {
            return value === validate.valueOf(other);
        },
        maxlength: function(value, maxlength) {
            return value.length > parseInt(maxlength, 10);
        },
        minlength: function(value, minlength) {
            return value && value.length < parseInt(minlength, 10);
        },
        min: function(value, min) {
            return validate.parse(value) < validate.parse(min);
        },
        max: function(value, max) {
            return validate.parse(value) > validate.parse(max);
        },
        step: function(value, step) {
            // % operator is inconsistent with floats, convert to ints first
            var decimal = step.indexOf('.'),
                factor = 1;
            if (decimal >= 0) {
                var power = step.length - decimal - 1;
                factor = Math.pow(10, power);
            }
            step = Math.round(parseFloat(step) * factor);
            var remainder = Math.round(value * factor) % step;
            return !isNaN(remainder) && remainder !== 0;
        }
    },
    classes: {
        required: 'valueMissing',
        pattern: 'patternMismatch',
        'equal-to': 'notEqual',
        'not-equal': 'notDifferent',
        maxlength: 'tooLong',
        minlength: 'tooShort',
        min: 'rangeUnderflow',
        max: 'rangeOverflow',
        step: 'stepMismatch'
    },
    field: '[type=number],[type=email],[type=url],'+//types
           '[required],[pattern],[maxlength],[min],[max],[step],'+// standards
           '[equal-to],[not-equal],[minlength]',// extensions
    toggle: function(el, valid) {
        el.classList.toggle('invalid', !valid);
        el.setCustomValidity(valid ? '' : 'This value is not valid.');
    },

    // internal functions
    valueOf: function(string) {
        if (string) {
            var el = D.query('[name="'+string+'"]');
            string = el && el.value;
        }
        return string;
    },
    parse: function(string) {
        return parseFloat(validate.valueOf(string));
    },
    check: function(el, event) {
        var no = el.getAttribute('novalidate');
        if (!no) {
            return true;
        }
        if (no === 'true' || no === 'novalidate') {
            return false;
        }
        if (no.indexOf('!') === 0) {
            return no.substring(1).split().indexOf(event) !== -1;
        }
        return no.split(' ').indexOf(event) === -1;
    },
    one: function(el, event) {
        if (!validate.check(el, event)) {
            return true;
        }

        var typeRE = validate.type[el.getAttribute('type')],
            value = el.value,
            valid = true;
        if (typeRE) {
            valid = !value || !!value.match(typeRE);
            el.classList.toggle('typeMismatch', !valid);
        }
        for (var name in validate.constraints) {
            var constraint = el.getAttribute(name);
            if (constraint) {
                var _class = validate.classes[name],
                    failed = validate.constraints[name](value, constraint);
                if (failed) {
                    valid = false;
                }
                el.classList.toggle(_class, failed);
            }
        }
        validate.toggle(el, valid);
        if (valid) {
            el.lastValidValue = value;
        }
        return valid;
    },
    all: function(form, event) {
        if (!validate.check(form, event)) {
            return true;
        }

        var valid = true;
        form.queryAll(validate.field).each(function(field) {
            if (!validate.one(field, event)) {
                valid = false;
            }
        });
        form.classList.toggle('invalid', !valid);
        Eventi.fire(form, valid ? 'valid' : 'invalid');
        if (!valid) {
            var el = form.query('.invalid');
            if (el) {
                el.focus();
            }
        }
        return valid;
    }
};

Eventi.on('^ready', function() {
    D.queryAll('form').each(function(){ validate.all(this, 'ready'); });
    D.queryAll('[required]').each('aria-required', true);
});
Eventi.on('keyup submit validate', function(e, event) {
    if (e.keyCode === 9) {
        return;// don't validate when tabbing
    }
    var el = e.target,
        valid = true;
    event = event && typeof event === "string" ? event : e.type;
    if (el.matches(validate.field)) {
        valid = validate.one(el, event);
    } else if (event === 'submit' || event === 'validate') {
        valid = validate.all(Eventi._.closest(el, 'form'), event);
    }
    return valid;
});
Eventi.on('focusout<[restrict]>', function(e) {
    var el = e.target;
    if (el.matches('.invalid')) {
        var is = el.value;
        el.value = el.lastValidValue || el.getAttribute('value') || '';
        Eventi.fire(el, 'restricted', is);
        setTimeout(function(){ el.focus(); }, 0);
        return false;
    }
});
// end validate