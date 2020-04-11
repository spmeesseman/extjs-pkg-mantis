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
        'Ext.ux.mantis.model.Project',
        'Ext.ux.mantis.model.Reproducibility',
        'Ext.ux.mantis.model.Severity',
        'Ext.ux.mantis.model.Ticket',
        'Ext.ux.mantis.store.Categories',
        'Ext.ux.mantis.store.FieldStore'
    ],
    
    flex:1,
    border:false,
    bodyPadding: '5 5 5 5',
    
    viewModel:
    {
        data:
        {
            record: Ext.ux.mantis.model.Ticket.create(),
            template: null
        }
    },
    
    layout: 
    {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },
    
    items: [
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
                    type: 'mantis.categories'
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
                    model: 'Ext.ux.mantis.model.Reproducibility'
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
                    model: 'Ext.ux.mantis.model.Severity'
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
    }],
    
    buttons: [
    {
        text: 'Clear',
        handler: function(btn)
        {
            btn.up('newticket').getViewModel().set('record', Ext.ux.mantis.model.Ticket.create());
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
                    btn.up('newticket').getViewModel().set('record', Ext.ux.mantis.model.Ticket.create());
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
