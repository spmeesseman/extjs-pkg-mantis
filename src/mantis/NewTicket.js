
Ext.define('Ext.ux.mantis.NewTicket', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'newticket',
    
    requires: [ 
        'Ext.data.ArrayStore',
        'Ext.ux.mantis.model.Ticket' 
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
        xtype: 'textfield',
        fieldLabel: 'Summary',
        tabindex: 2,
        maxlength: 64,
        listeners:
        {
            afterrender: function(txt, eopts)
            {
                txt.focus(true);
            }
        }
    },
    {
        xtype: 'combo',
        fieldLabel: 'Reproducibility',
        displayField:'name',
        valueField:'name',
        value: 4,
        queryMode: 'local',
        tabindex: 1,
        editable: false,
        bind: '{record.reproducibility.name}',
        store:
        {
            type: 'array',
            fields: [ 'name' ],
            data: [
                [['always'], ['have not tried'], ['n/a'], ['random'], ['sometimes'], ['unabled to reproduce'] ]
            ]
        }
    },
    {
        xtype: 'textarea',
        fieldLabel: 'Description',
        flex: 0.75,
        tabindex: 4,
        grow: true
    }],
    
    buttons: [
    {
        text: 'Submit',
        tabindex: 5,
        handler: 'submitClick'
    }]
    
});
