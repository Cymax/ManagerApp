// workbee.js
(function(window) {
    "use strict";
    var WB = window.Workbee || (window.Workbee = {});
    WB.page = {}; // place to store temporary globals, see: "googleCallback"

    WB.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    WB.Entity = function(elm) {
        this.elm = $(elm);
        this.id = this.elm.data('id');
        this.type = this.elm.data('entity');
        this.entity = this.type;
        this.actionUrl = this.elm.data('action-url');

        var entity = this;

        $(this.elm).find('[data-action]').on('click', function(event) {
            //e.preventDefault();

            var button = $(this);
            var action = button.data('action');

            // todo remove this. we want to be able to add
            //      new actions on demand
            // if ($.inArray(action, ['delete']) == -1) {
            //     console.log('unrecognised action '. action);
            //     return;
            // }

            // todo check if action exists and trigger it. if not fail
            entity[action](event);
        });
    }

    WB.Entity.prototype.callAction = function(action, options) {
        options = $.extend(true, {
            url: this.actionUrl,
            type: 'post',
            data: {
               csrf_token :$('html').data('csrf')
            }
        }, options);

        return $.ajax(options)
            .fail(function() {
                this.elm.trigger('Workbee:entity:failed-action', [this, action]);
            }.bind(this))
            .done(function() {
                this.elm.trigger('Workbee:entity:'+ action, [this]);
            }.bind(this));
    }

    WB.Entity.prototype.delete = function(event) {
        event.preventDefault();

        console.log('want to delete '+ this.entity +' with id '+ this.id);
        this.callAction('delete', {
            type: 'delete',
            url: this.actionUrl +'/'+this.id
        });
    }

    WB.HelpBlock = function(elm) {
        this.elm = $(elm);
        this.span = $(elm.find('span').get(0) || $('<span>').appendTo(elm));
    };

    WB.HelpBlock.prototype.show = function(text, className) {
        this.span.text(text).addClass(className).show();
        clearTimeout(this.to);
        this.to = setTimeout(function() {
            this.span.fadeOut(400, function(){
                this.hide();
            }.bind(this));
        }.bind(this), 5000);
    };

    WB.HelpBlock.prototype.hide = function() {
        this.span.text('').removeClass().hide();
    }

    WB.helpers = {};
    WB.helpers.matchSelection = function(selectFrom, selectInTo) {

        selectFrom.on('change', function(e) {
            if (selectInTo.data('is_modified')) return;
            selectInTo.val($(this).val());
        });

        selectInTo.on('change', function(e) {
            $(this).data('is_modified', true);
        });
    }

    WB.helpers.alert = function(msg, timeout) {
        var alert = $('<div class="alert" role="alert"></div>');
        alert.addClass('alert-danger');
        // do I really need the inner div? Seems not.
        //alert.append($('<div class=""></div>').text(msg));
        alert.text(msg);

        var header = $('div .container.header');
        if (!header) {
            console.log(msg);
            return;
        }

        if (timeout) {
            var t = setTimeout(function() {
                this.fadeOut(400, function() {
                    this.remove();
                });
            }.bind(alert), timeout * 1000);
        }

        header.after(alert);
        window.scrollTo(0,0);
        return alert;
    }

    WB.helpers.info = function(msg, timeout) {
        return WB.helpers.alert(msg, timeout)
            .removeClass('alert-danger')
            .addClass('alert-info');
    }

    WB.helpers.deferredSubmit = function (callback) {
        return function(e) {
            if (e.isDefaultPrevented()) return;
            e.preventDefault();

            var button = $(this).find('button[type="submit"]');
            button.prop('disabled', true);

            callback.bind(this)(e).fail(function() {
                button.prop('disabled', false);
            });
        }
    }

    WB.helpers.previewToggle = function(toggleElm, inputElm, outputElm) {
        toggleElm.on('click', function() {
            var t = $(this);

            if (!outputElm.is(":visible")) {
                WB.helpers.fetchJson(t.data('action-url'), {
                    preview: true,
                    input: inputElm.val()
                }).done(function(response) {
                    outputElm.width(inputElm.width());
                    outputElm.height('auto');
                    outputElm.html(response.result);
                    inputElm.hide();
                    outputElm.show();
                });
            } else {
                outputElm.hide();
                inputElm.show();
            }
        });
    }

    WB.helpers.entityList = function(target, actions) {
        var target = $(target);
        if (!target.length) {
            console.log('no such target');
            return false;
        }

        actions = actions || {}

        target.on('Workbee:entity:delete', function(event, entity) {
            entity.elm.fadeOut('slow', function() {
                $(this).remove();
            });
        }).on('Workbee:entity:failed-action', function(event, entity, action) {
            console.log('failed :( '+ entity.id);
        });

        target.find('[data-entity][data-id]').each(function() {
            var entity = new WB.Entity(this);

            // add new actions if we have any
            if (!actions.hasOwnProperty(entity.type)) return;
            for (var action in actions[entity.type]) {
                if (!actions[entity.type].hasOwnProperty(action)) continue;
                entity[action] = actions[entity.type][action].bind(entity);
            }
        });

        return target;
    }

    // this name is pretty bad
    WB.helpers.fetchJson = function(url, parameters, method) {
        method = typeof method !== 'undefined' ? method : 'post';
        return $.ajax({
            url: url,
            type: method,
            data: $.extend({
               csrf_token :$('html').data('csrf')
            }, parameters)
        });
    }

    WB.money = {};
    WB.money.updateField = function(elm) {
        elm.text("€"+ WB.money.format(elm.data('value')));
    }

    WB.money.format = function(cents) {
        if (!(cents = parseInt(cents))) return 0;
        return (cents/100.0).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    WB.money.add = function(cents, elm) {
        var currentVal;
        if (!(cents = parseInt(cents))) return;
        if (!(currentVal = parseInt(elm.data('value')))) return;

        elm.data('value', currentVal + cents);
        WB.money.updateField(elm);
    }

    WB.money.parseString = function(str) {
        var pattern = /^(\d+)(?:[.,])?(\d{1,2})?$/g;
        var matches = pattern.exec(str);
        if (!matches) return 0;

        var cents = parseInt(matches[1]) * 100;
        if (matches[2]) {
            cents = cents + parseInt(matches[2]);
        }

        return cents;
    }

    // MangoPay
    WB.mangoPay = {};
    WB.mangoPay.charge = function(chargeUrl, chargeData) {
        return $.ajax({
            url: chargeUrl,
            type: 'post',
            data: $.extend({
                csrf_token :$('html').data('csrf')
            }, chargeData)
        }).fail(function(xhr) {
            if (xhr.status == 400) {
                var response = xhr.responseJSON;
                if (response.paymentError) {
                    // paymentError is an error code
                    // that we could use to match the
                    // error to an element
                    WB.helpers.alert(response.message, 30);
                    return;
                }
            }

            WB.helpers.alert("Something went wrong, please try again later.", 60);
        });
    }

    WB.mangoPay.chargeCard = function(url, data) {

        var charge = WB.mangoPay.charge(url, data).done(function(response) {
            // check for Secure Mode
            if (response.secure_mode && !response.paid) {
                console.log(response.secure_mode);
                // should use redirectUrl
                location.href = response.secure_mode;
                return;
            }

            $('#paymentContainer').slideUp(500, function() {

                // todo we should have ONE instance of
                //      the wallet on which we do
                //      calculations and then multiple
                //      elements to represent it visually
                $('[data-entity="wallet"]').each(function() {
                    window.Workbee.money.add(response.credited, $(this));
                });

                WB.helpers.info(
                    'Success! €'+ WB.money.format(response.credited) +
                    ' just transferred to your account.'
                );
            });
        });

        // if not a new card
        if (data['card_id']) {
            charge.fail(function(xhr) {
                if (xhr.status == 400) {
                    var response = xhr.responseJSON;
                    if (response.paymentError == 101410) {
                        $('#'+data['card_id']).closest('.form-group').remove();
                        $('#new_card').prop('checked', true).change();
                    }
                }
            });
        }

        return charge;
    }

    // todo handle errors/failure for this call
    WB.mangoPay.registerCard = function(paymentUrl, cardData) {
        return $.get(paymentUrl).then(function(regData) {
            console.log(regData);

            // register the card using CORS
            return $.ajax({
                url: regData.url,
                type: "post",
                crossDomain: true,
                data: {
                    data: regData.data,
                    accessKeyRef: regData.accessKey,

                    cardNumber: cardData.number,
                    cardExpirationDate: cardData.expire,
                    cardCvx: cardData.cvc
                }
            })
            .fail(function(xhr, status, errorMsg) {
                // most likely a Payline service failure
                // or connection issues.
                WB.helpers.alert("Experiencing connection issues, please try again in a few minutes.", 30);
            })
            .then(function(response) {
                console.log("from registerCard::success");
                console.log(response);

                // Payline returns http status 200 on certain errors
                // so we need to check that the response payload
                // matches a certain pattern.
                //   expected response: "data=abc123"
                //   or in case of error "errorCode=123"
                // todo mock this so we can test without making external calls
                if (response.indexOf("errorCode=") === 0) {
                    var code = response.replace('errorCode=', '');
                    var paylineErrors = {
                        // todo use real hash map after move to babel

                        // codes starting with 105 can't happen at this stage,
                        // todo move these errors to chargeCard
                        /*
                        '105101': {field: '', msg: 'Card number is invalid'},

                        // We don't supply card holder name
                        //105102: '', // The card holder name given doesn’t match the real owner of the card

                        '105202': {field: '', msg: 'Card number is invalid.'},
                        '105203': {field: '', msg: 'The expiry date is invalid.'},
                        '105204': {field: '', msg: 'The CVV code is invalid.'},
                        '105206': {field: '', msg: 'This card is invalid, please try using another one.'},
                        */

                         '01902': {field: '', msg: 'This card is invalid, please try using another one.'},
                         '02624': {field: '', msg: 'The expiry date is invalid.'},
                         '02625': {field: '', msg: 'Card number is invalid.'},
                         '02626': {field: '', msg: 'The expiry date is invalid.'},
                         '02627': {field: '', msg: 'The CVV code is invalid.'},
                         '02628': {field: '', msg: 'The Card was rejected, please try using another one.'},

                         '00000': {field: '', msg: 'Experiencing some unexpected issues, please try again in a few minutes.'}
                    }

                    if (!paylineErrors.hasOwnProperty(code)) {
                        // todo send this error to server side log
                        //WB.helpers.rlog('payline error: [' +code+ ']');

                        code = '00000';
                    }

                    var paylineError = paylineErrors[code];
                    WB.helpers.alert(paylineError.msg, 30);
                    // todo mark the field that triggered the error using the paylineError.field
                    return $.Deferred().reject(paylineError).promise();
                }

                return $.Deferred().resolve(regData.id, response).promise();
            });
        });
    }

    WB.mangoPay.registerThenChargeCard = function(paymentUrl, cardData) {
        return WB.mangoPay.registerCard(paymentUrl, cardData)
        .then(function(regId, response) {
            // create payment; calls Workbee
            return WB.mangoPay.chargeCard(paymentUrl, {
                id       :regId,
                card     :response,
                amount   :cardData.amount,
                remember :cardData.remember,
                refill   :cardData.refill
            });
        });
    }

    // Pages

    WB.pages = {};
    WB.pages.Workbeesgiven = function() {
        var setMonthly = Workbee.debounce(function(that, oldValue, newValue) {
            var data = { monthly: newValue, csrf_token: $('#csrf_token').val() };
            $.post("/monthly", data).fail(function() {
                that.slider('setValue', oldValue);
                that.data('value', oldValue);
            });
        }, 500);

        // slider
        $('#total').slider({
            formater: function(value) {
                return '€' + value;
            }
        }).on('slideStop', function(ev) {
            console.log("slideStop");
            var t = $(this);
            setMonthly(t, t.data('previous_value'), t.slider('getValue'));
        }).on('slideStart', function(ev) {
            var t = $(this);
            var cVal = t.data('value') || t.data('slider-value');
            console.log('slideStart '+ cVal);
            t.data('previous_value', cVal);
        });

        // subscriptions
        var subscriptionTexts = $('div.Workbees-table').eq(0).data('text-subscriptions') || ["", ""];
        $('.subscription-toggle').each(function() {
            var t = $(this);

            $('span', t)
                .attr('title', subscriptionTexts[t.data('subscribed')])
                .addClass("text-muted")
                .toggleClass('text-success', !!t.data('subscribed'));

            t.on('click', function(e) {
                e.preventDefault();
                var url = t.attr('href'), thing = t.data('thing'),
                    subscribed = t.data('subscribed');

                $.ajax({
                    url: t.attr('href'),
                    method: (!!subscribed ? "delete" : "post"),
                    data: {
                        thing: thing,
                        csrf_token: $('html').data('csrf')
                    }
                }).done(function() {
                    t.data('subscribed', (!!subscribed ? 0 : 1));
                    $('span', t)
                        .toggleClass('text-success')
                        .attr('title', subscriptionTexts[t.data('subscribed')]).tooltip('fixTitle').tooltip('show');
                });

            }); // on('click')
        }); // subscriptions

        $(".Workbees-table a[data-action='delete']").on('click', function(e) {
            e.preventDefault();

            var t = $(this),
                main = t.closest('.Workbees-table >.row'),
                line = main.next(),
                thing = main.data('thing');

            $.ajax({
                url: t.attr('href'),
                method: "delete",
                data: {
                    thing: thing,
                    csrf_token: $('html').data('csrf')
                }
            }).done(function() {
                main.fadeOut('slow');
                line.fadeOut('slow');
            });
        }); // delete
    }; // Workbees given

    WB.pages.collectors = function() {
        var pane = $('#collectors-tab'),
        vis = function(state) {
            pane.children().each(function() {
                var t = $(this);
                if (!t.hasClass('row')) {
                    return (t.prev().is(':hidden') ? t.hide() : t.show());
                }

                t.find('a[type="button"]').each(function(){
                    var b = $(this);
                    return (t.data('enabled') == b.data('action-state') ? b.show() : b.hide());
                });

                if (t.data('enabled') != state) {
                    t.hide();
                } else {
                    t.show();
                }
            });
        };

        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            e.preventDefault();
            var tab = $(e.target); // newly activated tab
            // e.relatedTarget // previous active tab
            vis(tab.data('state'));
        });

        pane.find('a[data-app]').on('click', function(e){
            e.preventDefault();
            var t = $(this);

            $.ajax({
                url: t.attr('href'),
                method: "delete",
                data: {
                    app: t.data('app'),
                    csrf_token: $('html').data('csrf')
                }
            }).done(function() {
                var main = t.closest('.collector-row'),
                    hr = main.next();

                main.data('enabled', 0).hide();
                hr.hide();
            });
        });

        vis($('li.active a').data('state'));
    }; // collectors

    WB.pages.subscriptions = function() {

        $('.subscription-toggle').each(function() {
            var t = $(this);

            t.on('click', function(e) {
                var thing = t.data('thing'),
                    subscribed = t.is(':checked');

                if (t.data('locked') == 1) {
                    e.preventDefault();
                    return;
                }

                t.data('locked', 1);
                $.ajax({
                    url: "/recurring",
                    method: "put",
                    data: {
                        thing: thing,
                        csrf_token: $('html').data('csrf')
                    }
                }).complete(function(x, s) {
                    if (s != "success") {
                        t.prop('checked', (subscribed ? false : true));
                    }
                    t.data('locked', 0);
                });
            }); // on('change')
        }); // toggle

        $(".recurring-table a[data-action='delete']").on('click', function(e) {
            e.preventDefault();

            var t = $(this),
                main = t.closest('.recurring-table >.row'),
                line = main.next(),
                thing = main.data('thing');

            $.ajax({
                url: t.attr('href'),
                method: "delete",
                data: {
                    thing: thing,
                    csrf_token: $('html').data('csrf')
                }
            }).done(function() {
                main.fadeOut('slow');
                line.fadeOut('slow');
            });
        }); // delete
    };

    WB.pages.settings_notifications = function() {
        $(".notifications-table [role='switch']").on('click', function(e) {
            var t = $(this), id = t.val(),
                enabled = t.is(':checked');

            $.ajax({
                url: "/settings/notifications",
                method: "put",
                data: {
                    id: id,
                    enabled: enabled,
                    csrf_token: $('html').data('csrf')
                }
            }).complete(function(x, s) {
                if (s != "success") {
                    t.prop('checked', (enabled ? false : true));
                }
            });
        });
    };

    WB.pages.settings_profile = function() {
        $('#useRealname').on('click', function(e) {
            var t = $(this), enabled = t.is(':checked');

            $.ajax({
                url: "/settings/profile",
                method: "put",
                data: {
                    useRealname: enabled,
                    csrf_token: $('html').data('csrf')
                }
            }).complete(function(x, s) {
                if (s != "success") {
                    t.prop('checked', (enabled ? false : true));
                }
            });
        });

        $("button[role='submit']").on('click', function(e) {
            e.preventDefault();
            var t = $(this), h = $('#headline'), b = $('#bio'), p = t.next();
            t.addClass('saving', true);

            $.ajax({
                url: "/settings/profile",
                method: "put",
                data: {
                    csrf_token: $('html').data('csrf'),
                    headline: h.val(),
                    bio: b.val()
                }
            }).complete(function(x, s) {
                if (s != "success") {
                    p.text('Failed to save changes. Please try again.').removeClass().addClass('text-warning');
                }
                t.addClass('saved', true);
            });
        });

        $('a[role="button delete"]').each(function() {
            var t = $(this), r = t.closest('.row'), i = r.find('img'),
                help = new WB.HelpBlock(r.find('.help-block'));

            if (i.data('is-default')) {
                t.hide();
            }

            t.on('click', function(e) {
                e.preventDefault();
                t.prop('disabled', true);

                $.ajax({
                    url: "/settings/files",
                    method: "delete",
                    data: {
                        csrf_token: $('html').data('csrf'),
                        file_key: t.data('file-key')
                    }
                }).complete(function(x, s) {
                    t.prop('disabled', false);

                    if (s == "success") {
                        t.hide();
                        i.data('is-default', 1)
                        .attr('src', i.data('default-src'));
                        return;
                    }

                    help.show('Failed to delete image, try again later.', 'text-error');
                });
            });
        });

        $('a[role="button upload"]').each(function() {
            var t = $(this), r = t.closest('.row'), i = r.find('img'),
                help = new WB.HelpBlock(r.find('.help-block'));

            var uploader = new ss.SimpleUpload({
                button: t.get(),            // HTML element used as upload button
                url: '/settings/files',     // URL of server-side upload handler
                data: {
                    file_key: t.data('file-key'),
                    csrf_token: $('html').data('csrf')
                },
                name: 'file_name',
                maxSize: t.data('file-maxsize') || 700,
                allowedExtensions: ["jpg", "jpeg", "png", "gif"],
                hoverClass: 'btn-default-hover',
                focusClass: 'btn-default-focus',
                responseType: "json",
                onSubmit: function() {
                    help.show('Uploading...', 'text-info');
                },
                onSizeError: function(filename, size) {
                    help.show('File must not be larger than '+ this._opts.maxSize +'kb.', 'text-warning');
                },
                onExtError: function(filename, ext) {
                    help.show('Accepted file types are: jpg, png and gif.', 'text-warning');
                },
                onError: function(filename) {
                    help.show("Your image can't be uploaded right now, please try again later.", 'text-warning');
                },
                onComplete: function(filename, response, btn) {
                    help.hide();
                    i.attr('src', response.url).data('is-default', 0);
                    t.prev().show();
                }
            });
        });

    } // end settings-profile

    WB.pages.settings_account = function() {
        $("button[role='submit']").on('click', function(e) {
            var t = $(this);
            t.addClass('saving', true);
        });
        if ($('#account-type').length) {
            var userType = $('select[id="account-type"]'),
                orgname = $('input[id=orgname]'),
                visBiz = function() {
                    var personal = userType.val() == 'personal';
                    orgname.closest('.visible-business').toggle(!personal);
                    if (personal) {
                        return orgname.val('');
                    }

                    orgname.closest('.row').find('label').text(userType.val() + " name")
                    // camelCase == hack to get ucfirst()
                    orgname.attr('placeholder', $.camelCase("-"+ userType.val()) + " name");
                    orgname.closest('.row').next().find('span').text(userType.val());
                };

            visBiz();
            userType.on('change', visBiz);
        }
        WB.helpers.matchSelection($('select[id="nationality"]'), $('select[id="country"]'));

        var validatorOptions = {
            custom: {
                birthdate: function($el) {
                    var d = $('#day').val(),
                        m = $('#month').val(),
                        y = $('#year').val();

                    m--;
                    var date = new Date(y, m, d);
                    return (date && date.getMonth() == m);
                }
            },
            errors: {
                birthdate: 'Please enter a valid date'
            }
        };

        $('#accountFrm').validator(validatorOptions)
        .on('submit', WB.helpers.deferredSubmit(function(e) {
            var f = $(this), zeroPad = function(x) {
                    return ('00'+x).substring(x.length);
                },
                field = function(x) {
                    var y = this.find(x);
                    if (!y.length) return '';
                    return y.val();
                }.bind(f),
                data = {
                    csrf_token: $('html').data('csrf'),
                    type: field('[name="type"]'),
                    companyname: field('[name="companyname"]'),
                    firstname: field('[name="firstname"]'),
                    lastname: field('[name="lastname"]'),
                    nationality: field('[name="nationality"]'),
                    country: field('[name="country"]'),
                    birth_date: [field('#year'), zeroPad(field('#month')), zeroPad(field('#day'))].join('-')
                };

            return WB.helpers.fetchJson("/settings/account", data, 'put').fail(function() {
                WB.helpers.alert("Failed to save changes. Please try again later.", 30);
            }).done(function(response) {
                $("button[role='submit']").addClass('saved', true);
                $('#account-type').prop('disabled', true);
                WB.find('button[type="submit"]').prop('disabled', false);
            });
        }));

    } // end settings-account
    
    

    WB.pages.signin = function() {
        $("button[role='submit']").on('click', function(e) {
            var t = $(this);
            if (!t.hasClass("disabled")) {
                t.addClass('saving', true);
            }
        });
    }

    WB.pages.signup = function() {
        var userType = $('select[id="account-type"]'),
            orgname = $('input[id=orgname]'),
            visBiz = function() {
                var personal = userType.val() == 'personal';
                orgname.closest('.visible-business').toggle(!personal);
                if (personal) {
                    return orgname.val('');
                }

                orgname.closest('.row').find('label').text(userType.val() + " name")
                // camelCase == hack to get ucfirst()
                orgname.attr('placeholder', $.camelCase("-"+ userType.val()) + " name");
                orgname.closest('.row').next().find('span').text(userType.val());
            };

        visBiz();
        userType.on('change', visBiz);

        WB.helpers.matchSelection($('select[id="nationality"]'), $('select[id="country"]'));

       /* $('#signupFrm').validator({
            custom: {
                birthdate: function($el) {
                    var d = $('#day').val(),
                        m = $('#month').val(),
                        y = $('#year').val();

                    m--;
                    var date = new Date(y, m, d);
                    return (date && date.getMonth() == m);
                }
            },
            errors: {
                birthdate: 'Please enter a valid date'
            }
        });*/

        $('button[role="submit"]').on('click', function(e) {
            e.preventDefault();
            var t = $(this),
                zeroPad = function(x) {
                    return ('00'+x).substring(x.length);
                },
                form = t.closest('form'),
                f = function(x) {
                    return this.find('[name="'+ x +'"]');
                }.bind(form);

            form.on('submit', function(e) {
                if (e.isDefaultPrevented()) {
                    t.prop('disabled', false);
                }
            });

            t.prop('disabled', true);
            f('csrf_token').val($('html').data('csrf'));
            f('birth_date').val([
                $('#year').val(),
                zeroPad($('#month').val()),
                zeroPad($('#day').val())
            ].join('-'));

            form.submit();
        });
    }

    WB.pages.addmoney = function() {
        var status = $('#paymentContainer').data('status');
        if (status) {
            if (status == 'succeeded') {
                $('#paymentContainer').hide();
                WB.helpers.info(
                    'Success! €'+ WB.money.format($('#paymentContainer').data('credited')) +
                    ' has been added to your account.'
                );
            } else if (status == 'created') {
                // we don't have support for pending transactions yet so 
                // we should never end up here ...
                // todo Once we do we should be able to read the amount that is
                //      pending (credited should be renamed amount)
                $('#paymentContainer').hide();
                WB.helpers.info('The transaction is pending ...');
            } else {
                var paymentError = $('#paymentContainer').data('error');
                if (paymentError) {
                    WB.helpers.alert(paymentError, 30);
                } else {
                    WB.helpers.alert("The transaction failed", 30);
                }
            }
        }

        var amountInput = $('#amount'),
            toDollar = function() {
                var sum = amountInput.val() * amountInput.data('dollar-rate');
                $('#dollar').html(Math.round(sum*100)/100);
            },
            activeForm = function() {
                if ($('#saved_cards input[type="radio"]:checked').length) {
                    return $("#savedcardsFrm");
                }

                var activeTab = $('#payment-tabs li.active a').attr('href');
                return $(activeTab+"Frm");
            };

        toDollar(); // set the initial dollar value

        // disable enter key for all forms
        $('form').bind('keypress keydown keyup', function(e) {
            if (e.keyCode == 13) e.preventDefault();
        });

        // disable all forms if amount fails validation.
        $('form').on('submit', function(e) {
            $('#amountFrm').has('.has-error').length && e.preventDefault();
        });

        // this triggers after validation
        amountInput.on('change keyup', function(e) {
            toDollar();
        });

        // this triggers before on(change)
        $('#amountFrm').on('invalid.bs.validator valid.bs.validator', function(e) {
            var frm = activeForm();
            if (e.type == 'valid'/* && e.detail*/) {
                frm.find('button[type="submit"]').prop('disabled', false);
                frm.validator('validate');
                return;
            }

            frm.find('button[type="submit"]').prop('disabled', true);
        });

        $('a[role="button increase"]').on('click', function(e) {
            e.preventDefault();
            var val = parseInt(amountInput.val());
            if (val >= 100) {
                return;
            }

            amountInput.val(++val).change();
        });

        $('a[role="button decrease"]').on('click', function(e) {
            e.preventDefault();
            var val = parseInt(amountInput.val());
            if (val <= 5) {
                return;
            }

            amountInput.val(--val).change();
        });

        //
        // Bank wire
        //
        var bank_fetch = WB.debounce(function() {
            if ($('#amountFrm').data('bs.validator').hasErrors()) return;
            if ($('#bankFrm').data('amount') == $('#amount').val()) return;
            $('#bankFrm').data('amount', $('#amount').val());

            WB.helpers.fetchJson(
                $('#bankFrm').data('payment-url'),
                {
                    amount: $('#amount').val()
                }
            ).done(function(response) {
                $.each(response, function(key, value) {
                    var x = $('#bank_'+ key);
                    x.text(x.data('entity') == 'money' ? WB.money.format(value) : value);
                });
            });
        }, 1000);

        $('#payment-tabs li a').on('shown.bs.tab', function(e) {
            if ($(e.target).attr('href').substr(1) != "bank") {
                $('#amountFrm').off('validated.bs.validator', bank_fetch);
                return;
            }

            $('#amountFrm').on('validated.bs.validator', bank_fetch);
            bank_fetch();
        });

        //
        // Sofort, GiroPay
        //
        $('#sofortFrm, #giropayFrm').on('submit', WB.helpers.deferredSubmit(function(e) {
            return WB.mangoPay.charge($(this).data('payment-url'), {
                amount: $('#amount').val(),
                type: $(this).find('input[name="type"]').val()
            }).done(function(response){
                if (response.redirectUrl) {
                    window.location = response.redirectUrl;
                }
            });
        }));

        //
        // saved cards form
        //

        var savedCardFrm = $('#saved_cards').closest('form');
        if ($('#saved_cards').children().length) {
            // sometimes when the page is loaded an option is
            // remembered from a previous visit.
            // So we make sure the correct form is shown.
            if ($('#new_card').prop('checked')) {
                $('#saved_cards').siblings().hide();
            } else {
                $('#payment-tabs').hide();
            }

            // sets initial state of the submit button
            savedCardFrm.find('button[type="submit"]').prop('disabled',
                            !savedCardFrm.find('input[type="radio"]:checked').length);

            savedCardFrm.find('input[type="radio"]').on('change', function() {
                if($(this).val() == 0) {
                    $('#saved_cards').siblings().hide();
                    $('#payment-tabs').show();
                } else {
                    $('#payment-tabs').hide();
                    $('#saved_cards').siblings().show();
                    savedCardFrm.find('button[type="submit"]').prop('disabled',
                            $('#amountFrm').data('bs.validator').hasErrors());
                }
            });

            savedCardFrm.on('submit', WB.helpers.deferredSubmit(function(e) {
                var r = $(this).find('input[type="radio"]:checked');
                if (!r.length) {
                    WB.helpers.alert("You need to select a card first.", 30);
                    return $.Deferred().reject().promise();
                }

                return WB.mangoPay.chargeCard($(this).data('payment-url'), {
                    amount  :$('#amount').val(),
                    card_id :r.val()
                });
            }));
        } else {
            savedCardFrm.hide();
        }

        //
        // Handle card payments with new cards
        //

        $('#cardFrm button[type="submit"]').prop('disabled', true);
        $('#remember_card').on('change', function() {
            var child = $('#auto_refill');

            if (!this.checked) {
                child.prop('checked', false)
                    .prop('disabled', true)
                    .closest('div.checkbox').addClass('illusive disabled');

                    //remove once auto-fill is enabled
                    $(".notenabled").removeClass("text-danger");
                    //

            } else {
                child.prop('disabled', false)
                    .closest('div.checkbox').removeClass('illusive disabled');

                    //added until auto-fill is enabled
                    $(".notenabled").addClass("text-danger");
                    //
            }
        });

        // form validation
        //   payment functions require jquery.payment.js
        //   https://github.com/stripe/jquery.payment
        $('[data-numeric]').payment('restrictNumeric');
        $('#cc-number').payment('formatCardNumber');
        $('#cc-exp').payment('formatCardExpiry');
        $('#cc-cvc').payment('formatCardCVC');
        $('#cardFrm').validator({
            custom: {
                'validate-amount': function(el) {
                    return false;
                },
                'validate-cc-number': function(el) {
                    var type = $.payment.cardType($(el).val());
                    if ($.inArray(type, ['visa', 'mastercard', 'maestro', 'jcb']) > -1) {
                        // todo should handle this by adding a class instead of
                        //      manipulating the dom
                        $('.cc-brand').html('<img src="/images/payment-icons/'+ type +'.svg">');
                        $('.cc-icon').css('display', 'none');
                        return $.payment.validateCardNumber($(el).val());
                    }

                    $('.cc-brand').css('display', 'block');
                    $('.cc-brand').html('');
                    return false;
                },
                'validate-cc-exp': function(el) {
                    return $.payment.validateCardExpiry($(el).payment('cardExpiryVal'));
                }
            },
            errors: {
                'validate-amount': 'bla bla',
                'validate-cc-number': 'ddkd',
                'validate-cc-exp': 'Please use format MM / YY'
            }
        }).on('submit', WB.helpers.deferredSubmit(function(e) {
            return WB.mangoPay.registerThenChargeCard($(this).data('payment-url'), {
                amount  : $('#amount').val(),
                number  : $('#cc-number').val().replace(/\s/g, ''),
                expire  : $('#cc-exp').val().replace(/\D/g, ''),
                cvc     : $('#cc-cvc').val(),
                remember: $('#remember_card').is(':checked') ? 1 : 0,
                refill  : $('#auto_refill').is(':checked') ? 1 : 0
            });
        }));
    }

    WB.pages.addbank = function() {

        WB.page.googleCallback = function() {
            var autocomplete = new google.maps.places.Autocomplete(
                document.getElementById('auto-address'), {types: ['geocode']}
            );

            autocomplete.addListener('place_changed', function() {
                var place = autocomplete.getPlace();

                var fields = {
                    street_address: ['street', 'long_name', true],
                    route:          ['street', 'long_name', false],
                    // street_number:  ['street_number', 'long_name', false],
                    postal_code:    ['postal', 'long_name', false],
                    postal_town:    ['city', 'long_name', true],
                    locality:       ['city', 'long_name', false],
                    country:        ['country', 'short_name', false],
                    administrative_area_level_1: ['region', 'long_name', false]
                };

                var part, field, address = {};
                while(part = place.address_components.shift()) {
                    if (!fields.hasOwnProperty(part.types[0]))
                        continue;

                    field = fields[part.types[0]];
                    var id = field[0], name = field[1], override = field[2];
                    if (!address[id] || override) {
                        address[id] = part[name];
                    }
                }

                var order = [
                    'postal',
                    'city',
                    'region',
                    'country'
                ];
                while(field = order.shift()) {
                    if (address.hasOwnProperty(field)) {
                        $('#owner_'+ field).val(address[field]);
                    }
                }

                if (place.formatted_address && address.hasOwnProperty('street')) {
                    $('#owner_address_1').val(
                        place.formatted_address.split(',', 1)[0]
                    );
                }

                $('#auto-address').closest('.form-group').hide();
                $('#extendedAddress').removeClass('hidden').show();
            });
        }
        $.getScript('https://maps.googleapis.com/maps/api/js?libraries=places&callback=Workbee.page.googleCallback');

        $('form').on('submit', WB.helpers.deferredSubmit(function(e) {
            e.preventDefault();

            var data = {}, fields = $(this).serializeArray(), item;
            while(item = fields.shift()) {
                data[item.name] = item.value;
            }

            var address = {}
            $('#addressSection').find('input[name], select[name]').each(function(i, e) {
                address[$(e).attr('name')] = $(e).val();
            });
            data.owner = address;

            return $.ajax({
                url: $(this).attr('action') || location.href,
                type: 'post',
                data: $.extend({
                    csrf_token :$('html').data('csrf')
                }, data)
            }).fail(function() {
                WB.helpers.alert("Failed to add bank account", 30);
            }).done(function() {
                $('#addbankaccount').slideUp(500, function() {
                    var info = WB.helpers.info("Successfully added bank account.");
                    // todo compare wallet value with minimum withdraw value
                    if ($('[data-entity="wallet"]').data('value')) {
                        info.append(" You can now <a href='/withdrawmoney'>withdraw</a> your money.");
                    }
                });
            });
        }));
    }

    WB.pages.bankdetails = function() {
        WB.helpers.entityList('.details-table');
    }

    WB.pages.paymentdetails = function() {
        //  Radio button behavour of checkboxes
        /* $('.radio-behave').click(function(){ */
        /*   if (this.checked) { */
        /*     $('.radio-behave').prop('checked', false); */
        /*     $(this).prop('checked', true); */
        /*   } */
        /* }); */
        WB.helpers.entityList('.details-table', {
            card: {
                toggle: function(event) {
                    var button = $(event.target),
                        newVal = button.prop('checked');

                    console.log('want to toggle '+ this.entity +' with id '+ this.id);

                    this.callAction('toggle', {
                        type: 'patch',
                        url: this.actionUrl +'/'+this.id,
                        data: {
                            enable_refill: newVal
                        }
                    }).fail(function() {
                        button.prop('checked', !newVal);
                    });
                }
            }
        });
    }

    WB.pages.withdraw = function() {
        // todo should have something better to select on
        $('[data-source]').each(function() {
            var elm = $(this),
                value = 0,
                rate = elm.data('rate'),
                source = $(elm.data('source'));

            if (source.is(':input') && source.attr('type') == 'number') {
                // listen to events and stuff
                source.on('change', function() {
                    value = parseInt(source.val()) || 0;
                    elm.text(WB.money.format((value * rate)*100.0));
                });

                value = parseInt(source.val()) || 0;
                value = (value * rate) * 100.0;
            } else if (source.data('entity') == 'wallet') {
                value = source.data('value') * rate;
            }

            elm.text(WB.money.format(value));
        });

        // form submit
        $('form').on('submit', WB.helpers.deferredSubmit(function() {
            return WB.helpers.fetchJson($(this).attr('action'), {
                bank: $('#bankaccounts').val(),
                amount: WB.money.parseString($('#amount').val())
            }).fail(function() {
                WB.helpers.alert("Failed to create bank transfer, please try again later.", 30);
            }).done(function() {
                $('#withdrawContainer').slideUp(500, function() {
                    WB.helpers.info(
                        'Success! We have initiated a transfer of ' +
                        '€'+ $('#amount').val() + ' to your bank account.');
                });
            });
        }));
    }

    WB.pages.transactions = function() {
        $('[data-entity="money"]').each(function() {
            var t = $(this);
            t.text(WB.money.format(t.data('value')));
        });
    }

    WB.pages.contact = function() {
        WB.helpers.previewToggle($('#preview'), $('#message'), $('#preview-out'));

        $('#contact').validator().on('submit', WB.helpers.deferredSubmit(function(e) {
            var data = {}, fields = $(this).serializeArray(), item;
            while(item = fields.shift()) {
                data[item.name] = item.value;
            }

            return WB.helpers.fetchJson($(this).attr('action'), data).fail(function() {
                WB.helpers.alert("Failed to send the message. Please try again later.", 30);
            }).done(function(response) {
                $('#contact').slideUp(500, function() {
                    WB.helpers.info('').append('We have received your <a href="'+ response.url +'">message</a> and will respond as soon as possible.');
                });
            });

        }));
    }

    WB.pages.message = function() {
        WB.helpers.previewToggle($('#preview'), $('#message'), $('#preview-out'));

        $('form').on('submit', WB.helpers.deferredSubmit(function(e) {
            return WB.helpers.fetchJson(
                window.location.href, {
                    'message': $('#message').val()
                }
            ).fail(function() {
                WB.helpers.alert("Failed to send the reply. Please try again later.", 30);
            }).done(function(response) {
                $('#message').val("");
                $('#preview').trigger("click");
                var elm = $('#messages > div:last-child').clone();
                elm.find('.message-body').addClass('well-white').html(response.message);
                elm.find('.message-from').text("You wrote");
                elm.hide();
                elm.appendTo('#messages').show('slow');
                setTimeout(function() {
                    $('button[type="submit"]').prop('disabled', false);
                }, 3000);
            });
        }));
    }

    WB.pages.embed = function() {
        var genStaticCode = function() {
                var template = 'https://@domain@/submit/auto?fid=@fid@&url=@url@';

                var attributes = {
                    fid: $('#btnCfg').data('fid'),
                    url: encodeURIComponent($('#btnCfg input[name=url]').val()),
                    domain: $('#btnCfg').data('domain')
                };

                $.each(attributes, function(key, value) {
                    template = template.replace("@"+key+"@", value);
                });

                if (!$('#only-url input').prop('checked')) {
                    var tmp = '<a href="@url@" target="_blank"><img src="//button.@domain@/Workbee-badge-large.png" alt="Workbee this" title="Workbee this" border="0"></a>';
                    template = tmp.replace("@url@", template);
                    template = template.replace("@domain@", attributes.domain);
                }

                $('#codeBox').val(template);
            },
            genDynamicCode = function() {
                var template = "<script id='@id@'>(function(i){var f,s=document.getElementById(i);f=document.createElement('iframe');WB.src='//button.@domain@/view/?fid=@fid@&@btntype@url=@url@;WB.title='Workbee';WB.height=@height@;WB.width=@width@;WB.style.borderWidth=0;s.parentNode.insertBefore(f,s);})('@id@');<";
                var attributes = {
                    id: 'fb'+(Math.random() + 1).toString(36).substring(2,7),
                    fid: $('#btnCfg').data('fid'),
                    domain: $('#btnCfg').data('domain')
                };

                if ($('#btnCfg input[name=button-type]:checked').val() == 'large') {
                    attributes.height = 62;
                    attributes.width  = 55;
                    attributes.btntype = '';
                } else {
                    attributes.height = 20;
                    attributes.width  = 110;
                    attributes.btntype = 'button=compact&';
                }

                if ($('#btnCfg input[name=url-mode]:checked').val() == "m") {
                    var url = $('#btnCfg input[name=url]').val();
                    attributes.url = encodeURIComponent(url) +"'";
                } else {
                    attributes.url = "'+encodeURIComponent(document.URL)";
                }

                $.each(attributes, function(key, value) {
                    template = template.replace("@"+key+"@", value);
                });

                template = template.replace("@id@", attributes.id);
                $('#codeBox').val(template +'/script>');
            },
            updateCodeBox = function() {
            $('#btnCfg').validator('validate');
            if ($('#btnCfg').has('.has-error').length) {
                $('#codeBox').val('');
                return
            }

            if ($('#btnCfg input[name=button-type]:checked').val() == 'static') {
                genStaticCode();
                return;
            }

            genDynamicCode();
        },
        toggleUrlElement = function() {
            var eUrl = $('#btnCfg input[name=url]');
            if ($('#btnCfg input[name=url-mode]:checked').val() == 'm') {
                eUrl.show();
            } else {
                eUrl.hide();
            }
            updateCodeBox();
        }

        $('#btnCfg input[name=button-type]').click(function() {
            if ($('#btnCfg input[name=button-type]:checked').val() == 'static') {
                $('#only-url').show();
                $('#btnCfg input[name=url-mode][value=a]').prop("disabled", true);
                $('#btnCfg input[name=url-mode][value=m]').prop("checked", true);
                toggleUrlElement();
            } else {
                $('#only-url').hide();
                $('#btnCfg input[name=url-mode][value=a]').prop("disabled", false);
                updateCodeBox();
            }
        });

        $('#btnCfg input[name=url-mode]').click(toggleUrlElement);
        $('input[name=only-url], input[name=url]').change(updateCodeBox);
        updateCodeBox();
    } // end embed

    $(document).ready(function() {
        // run pre-page-init-js
        $('#userNav a[role="signout"]').on('click', function(e) {
            e.preventDefault();

            $('<form method="POST"></form>')
                .attr('action', $(this).attr('href'))
                .append($('<input type="hidden" name="csrf_token">').val($('html').data('csrf')))
                .appendTo($('body')).submit();
        });

        // run page specific js
        var wb_js = $('html').data('wb_js');
        if (wb_js && typeof(WB.pages[wb_js]) === "function") {
            WB.pages[wb_js]();
        }

        // enable tooltips; must be done after page inits
        $("[data-toggle='tooltip']").tooltip();
        var infoTool = $("[data-toggle='tooltip'][data-trigger='click']");
        infoTool.click(function() {
            infoTool.not(this).tooltip('hide');
        });

        // Focus to field .focushere
        $(".focushere").focus();
    });

})(this);
