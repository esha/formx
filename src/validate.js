// validate
var validate = FORMx.validate = {
    // natural extension points
    type: {
        number: /^\-?\d*(\.\d+)?$/,
        email: /^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        url: /^http.[^\s]+$/i
    },
    test: {
        required: function(value) {
            return !value;
        },
        pattern: function(value, pattern) {
            return value && !value.match(new RegExp('^'+pattern+'$'));
        },
        'equal-to': function(value, reference, referenceValue) {
            return value !== referenceValue;
        },
        'not-equal': function(value, reference, referenceValue) {
            return value === referenceValue;
        },
        'required-if': function(value, reference, referenceValue) {
            return !!referenceValue && !value;
        },
        'required-unless': function(value, reference, referenceValue) {
            return !referenceValue && !value;
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
        'required-if': 'valueMissing',
        'required-unless': 'valueMissing',
        maxlength: 'tooLong',
        minlength: 'tooShort',
        min: 'rangeUnderflow',
        max: 'rangeOverflow',
        step: 'stepMismatch'
    },
    field: '[type=number],[type=email],[type=url],'+//types
           '[required],[pattern],[maxlength],[min],[max],[step],'+// standards
           '[equal-to],[not-equal],[required-if],[required-unless],[minlength]',// extensions
    toggle: function(el, valid) {
        el.classList.toggle('invalid', !valid);
        el.setCustomValidity(valid ? '' : 'This value is not valid.');
    },

    // internal functions
    parse: function(string) {
        return parseFloat(string);
    },
    valueOf: function(name, form) {
        var el = form.query('[name="'+name+'"]');
        return el && el.xValue;
    },
    check: function(el, event) {
        var no = el.getAttribute('novalidate');
        if (!el.hasAttribute('novalidate') || no === 'false') {
            return true;
        }
        if (no === 'true' || !no) {
            return false;
        }
        if (no.indexOf('!') === 0) {
            return no.substring(1).split().indexOf(event) !== -1;
        }
        return no.split(' ').indexOf(event) === -1;
    },
    one: function(el, event, form) {
        if (!validate.check(el, event)) {
            return true;
        }

        var typeRE = validate.type[el.getAttribute('type')],
            value = el.value,
            valid = true;
        form = form || validate.getForm(el);
        if (typeRE) {
            valid = !value || !!value.match(typeRE);
            el.classList.toggle('typeMismatch', !valid);
        }
        for (var name in validate.test) {
            var constraint = el.getAttribute(name) || el.hasAttribute(name);
            if (constraint) {
                var _class = validate.classes[name],
                    referenceValue = validate.valueOf(constraint, form),
                    failed = validate.test[name](value, referenceValue || constraint, referenceValue);
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
            if (!validate.one(field, event, form)) {
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
    },
    getForm: function(el) {
        return el.closest('form,body');
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
        valid = validate.all(validate.getForm(el), event);
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
var errors = Object.keys(validate.classes)
                   .map(function(key){ return validate.classes[key]; })
                   .filter(function(error, i, self){ return self.indexOf(error) === i; });
D.head.append('style').textContent =
    '.error { display: none; }\n' +
    errors.map(function(error) {
        return '.invalid.'+error+' ~ .error.'+error;
    }).join(',\n') +
    ' { display: inline-block; }';
// end validate