/**
 * @class Ext.ux.mantis.NewTicket
 * 
 */
Ext.define('Ext.ux.mantis.NewTicket', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'newticket',
    
    requires: [ 
        'Ext.Img',
        'Ext.ux.mantis.model.Field',
        'Ext.ux.mantis.model.Category',
        'Ext.ux.mantis.model.Priority',
        'Ext.ux.mantis.model.Reproducibility',
        'Ext.ux.mantis.model.Severity',
        'Ext.ux.mantis.model.Ticket',
        'Ext.ux.mantis.store.Categories',
        'Ext.ux.mantis.store.FieldStore'
    ],
    
    flex:1,
    border:false,
    bodyPadding: '10 10 10 10',
    scrollable: true,

    config:
    {
        options: {}
    },

    viewModel:
    {
        data:
        {
            record: undefined,
            template: null
        }
    },

    layout: 
    {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },
    
    defaults:
    {
        labelWidth: 110
    },
    
    initComponent: function()
    {
        var me = this;
        
        me.items = [
        {
            layout: 'hbox',
            items: [
            {
                flex: 1,
                layout: 
                {
                    type: 'vbox',
                    align : 'stretch',
                    pack  : 'start'
                },
                defaults:
                {
                    flex :1,
                    labelWidth: 110
                },
                items: [
                {
                    xtype: 'combo',
                    fieldLabel: '<i class="fal fa-spinner fa-spin"></i> Category',
                    displayField:'name',
                    valueField:'id',
                    editable: false,
                    localAfterLoad: true,
                    bind: '{record.category.id}',
                    store:
                    {
                        type: 'mantis.categories',
                        options: me.options,
                        listeners: {
                            load: function() {
                                var cmb = me.down('combo');
                                cmb.setFieldLabel(cmb.getFieldLabel().replace('<i class="fal fa-spinner fa-spin"></i>', ''));
                            }
                        }
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: '<i class="fal fa-spinner fa-spin"></i> Reproducibility',
                    displayField:'label',
                    valueField:'id',
                    editable: false,
                    localAfterLoad: true,
                    bind: '{record.reproducibility.id}',
                    store:
                    {
                        type: 'mantis.fieldstore',
                        model: 'Ext.ux.mantis.model.Reproducibility',
                        options: me.options,
                        listeners: {
                            load: function() {
                                var cmb = me.down('combo').next('combo');
                                cmb.setFieldLabel(cmb.getFieldLabel().replace('<i class="fal fa-spinner fa-spin"></i>', ''));
                            }
                        }
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: '<i class="fal fa-spinner fa-spin"></i> Severity',
                    displayField:'label',
                    valueField:'id',
                    editable: false,
                    localAfterLoad: true,
                    bind: '{record.severity.id}',
                    store:
                    {
                        type: 'mantis.fieldstore',
                        model: 'Ext.ux.mantis.model.Severity',
                        options: me.options,
                        listeners: {
                            load: function() {
                                var cmb = me.down('combo').next('combo').next('combo');
                                cmb.setFieldLabel(cmb.getFieldLabel().replace('<i class="fal fa-spinner fa-spin"></i>', ''));
                            }
                        }
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: '<i class="fal fa-spinner fa-spin"></i> Priority',
                    displayField:'label',
                    valueField:'id',
                    editable: false,
                    localAfterLoad: true,
                    bind: '{record.priority.id}',
                    store:
                    {
                        type: 'mantis.fieldstore',
                        model: 'Ext.ux.mantis.model.Priority',
                        options: me.options,
                        xtraParams: { option: 'priority_enum_string' },
                        listeners: {
                            load: function() {
                                var cmb = me.down('combo').next('combo').next('combo').next('combo');
                                cmb.setFieldLabel(cmb.getFieldLabel().replace('<i class="fal fa-spinner fa-spin"></i>', ''));
                            }
                        }
                    }
                }]
            },
            {
                xtype: 'image',
                src: Ext.manifest.resources.base + '/resources/mantis/mantisbt.png',
                height: 116,
                width: 116,
                padding: 10,
                style: {
                    opacity: '0.7'
                }
            }]
        }];

        var xtypes = me.options.custom_fields_xtype;
        if (xtypes) {
            if (Ext.isArray(xtypes)) {
                me.items.push(...xtypes);
            }
            else if (Ext.isObject(xtypes)) {
                me.items.push(xtypes);
            }
        }

        me.items.push(...[
        {
            xtype: 'textfield',
            fieldLabel: 'Summary',
            maxlength: 64,
            bind: '{record.summary}',
            allowBlank: false,
            listeners:
            {
                afterrender: function(txt, eopts)
                {
                    txt.focus(true);
                }
            }
        },
        {
            xtype: 'textarea',
            fieldLabel: 'Description',
            bind: '{record.description}',
            allowBlank: false,
            grow: true
        },
        {
            xtype: 'textarea',
            fieldLabel: 'Steps to Reproduce',
            bind: '{record.steps_to_reproduce}',
            grow: true
        },
        {
            xtype: 'textarea',
            fieldLabel: 'Addtl Information',
            bind: '{record.additional_information}',
            grow: true
        }]);

        me.callParent();

        me.newRecordOptions = {
            project: me.options.project_id,
            category: me.options.defaultTicketValues ? me.options.defaultTicketValues.category : 1,
            priority: me.options.defaultTicketValues ? me.options.defaultTicketValues.priority : 30,
            reproducibility: me.options.defaultTicketValues ? me.options.defaultTicketValues.reproducibility : 70,
            severity: me.options.defaultTicketValues ? me.options.defaultTicketValues.severity : 50
        };

        var record = Ext.ux.mantis.model.Ticket.create(Ext.clone(me.newRecordOptions));
        record.appOptions = me.options;

        me.getViewModel().set('record', record);
    },
    
    clearFieldsCustom: function()
    {
        var me = this,
            xtypes = me.options.custom_fields_xtype,
            cmps = me.query('field');

        if (xtypes)
        {
            if (!Ext.isArray(xtypes)) {
                xtypes = [ xtypes ];
            }
            for (var x in xtypes) {
                var cmp = Ext.getCmp(xtypes[x].id);
                if (cmp) {
                    if (cmp.clearValue) {
                        cmp.clearValue();
                    }
                    if (cmp.clearInvalid) {
                        cmp.clearInvalid();
                    }
                }
            }
        }

        new Ext.util.DelayedTask(function() {
            for (var c in cmps) {
                if (cmps[c].clearInvalid) {
                    cmps[c].clearInvalid();
                }
            }
        }).delay(1);
    },

    buttons: [
    {
        text: 'Clear',
        handler: function(btn)
        {
            var newticket = btn.up('newticket'),
                vm = btn.up('newticket').getViewModel();
            vm.get('record').drop();
            vm.get('record').destroy();
            var record = Ext.ux.mantis.model.Ticket.create(Ext.clone(newticket.newRecordOptions));
            record.appOptions = newticket.options;
            vm.set('record', record);
            newticket.clearFieldsCustom();
        }
    },
    {
        text: 'Submit',
        handler: function(btn)
        {
            var newticket = btn.up('newticket'),
                rec = newticket.getViewModel().get('record');

            var mask = new Ext.LoadMask(
            {
                target: newticket,
                msg: "Submitting ticket"
            }).show();

            rec.save(
            {
                scope: this,
                
                failure: function(record, operation) 
                {
                    mask.hide();
                    mask.destroy();

                    Ext.Msg.alert("Request Failed", "Failed to submit new ticket");
                },

                success: function(record, operation) 
                {
                    mask.hide();
                    mask.destroy();

                    Ext.toast("Ticket #" + record.getId() + " submitted successfully");

                    var newRec = Ext.ux.mantis.model.Ticket.create(Ext.clone(newticket.newRecordOptions));
                    newRec.appOptions = newticket.options;
                    btn.up('newticket').getViewModel().set('record', newRec);
                    //btn.up('newticket').down('textfield').focus();

                    //
                    // Call application callback hook if defined
                    //
                    var fno = newticket.options.cb ? newticket.options.cb.newTicket : null;
                    if (fno)
                    {
                        if (Ext.isFunction(fno)) {
                            fno(record, newticket);
                        }
                        else if (Ext.isObject(fno) && fno.fn)
                        {
                            if (!fno.scope) {
                                fno.fn(record, newticket);
                            }
                            else {
                                fno.fn.call(fno.scope, record, newticket);
                            }
                        }
                    }

                    //
                    // Clear fields and place a new phantom model into the viewModel
                    //
                    newticket.clearFieldsCustom();
                }
            });
        }
    }]

});
