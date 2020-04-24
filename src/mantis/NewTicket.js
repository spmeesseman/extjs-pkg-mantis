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
    bodyPadding: '5 5 5 5',
    
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
                    flex :1
                },
                items: [
                {
                    xtype: 'combo',
                    fieldLabel: 'Category',
                    displayField:'name',
                    valueField:'id',
                    editable: false,
                    localAfterLoad: true,
                    bind: '{record.category.id}',
                    store:
                    {
                        type: 'mantis.categories',
                        options: me.options
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Reproducibility',
                    displayField:'label',
                    valueField:'id',
                    editable: false,
                    localAfterLoad: true,
                    bind: '{record.reproducibility.id}',
                    store:
                    {
                        type: 'mantis.fieldstore',
                        model: 'Ext.ux.mantis.model.Reproducibility',
                        options: me.options
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Severity',
                    displayField:'label',
                    valueField:'id',
                    editable: false,
                    localAfterLoad: true,
                    bind: '{record.severity.id}',
                    store:
                    {
                        type: 'mantis.fieldstore',
                        model: 'Ext.ux.mantis.model.Severity',
                        options: me.options
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Priority',
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
                        xtraParams: { option: 'priority_enum_string' }
                    }
                }]
            },
            {
                xtype: 'image',
                src: Ext.manifest.resources.base + '/resources/mantis/mantisbt.png',
                height: 116,
                width: 116,
                padding: 10
            }]
        },
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
        }];

        me.callParent();

        me.newRecordOptions = {
            project: me.options.project_id,
            category: me.options.defaultTicketValues ? me.options.defaultTicketValues.category : 1,
            priority: me.options.defaultTicketValues ? me.options.defaultTicketValues.priority : 30,
            reproducibility: me.options.defaultTicketValues ? me.options.defaultTicketValues.reproducibility : 70,
            severity: me.options.defaultTicketValues ? me.options.defaultTicketValues.severity : 50
        };

        var record = Ext.ux.mantis.model.Ticket.create(me.newRecordOptions);
        record.appOptions = me.options;

        me.getViewModel().set('record', record);
    },
    
    buttons: [
    {
        text: 'Clear',
        handler: function(btn)
        {
            var newticket = btn.up('newticket');
            btn.up('newticket').getViewModel().set('record', Ext.ux.mantis.model.Ticket.create(newticket.newRecordOptions));
            //btn.up('newticket').down('textfield').focus();
        }
    },
    {
        text: 'Submit',
        handler: function(btn)
        {
            var newticket = btn.up('newticket');
            var rec = newticket.getViewModel().get('record');
            var mask = ToolkitUtils.mask(newticket, "Submitting ticket");
            rec.save(
            {
                scope: this,
                failure: function(record, operation) 
                {
                    ToolkitUtils.unmask(mask);
                    Ext.Msg.alert("Request Failed", "Failed to submit new ticket");
                },
                success: function(record, operation) 
                {
                    ToolkitUtils.unmask(mask);
                    Ext.toast("Ticket #" + record.getId() + " submitted successfully");
                    btn.up('newticket').getViewModel().set('record', Ext.ux.mantis.model.Ticket.create(newticket.newRecordOptions));
                    //btn.up('newticket').down('textfield').focus();
                }
            });
        }
    }],

    clearValues: function()
    {
        var cmps = this.query('textfield');
        for (var c in cmps) {
            if (cmps[c].getXType() == 'combobox') {
                continue;
            }
            cmps[c].setValue('');
        }
        cmps = this.query('textarea');
        for (var c2 in cmps) {
            cmps[c2].setValue('');
        }
    }
    
});
