
Ext.define('Ext.ux.mantis.TicketDetail', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'ticketdetail',
    
    flex:1,
    border:false,
    bodyPadding: '10 10 10 10',
    cls: 'mantis-ticket-list-ticket-detail',
    iconCls: 'far fa-ticket-alt',

    viewModel: 
    {
        data: {
            record: null
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
        layout:
        {
            type: 'hbox',
            align: 'stretch',
            pack  : 'start'
        },
        bodyStyle: 
        {
            background: 'transparent'
        },
        items: [
        {
            flex: 1,
            cls: 'mantis-ticket-list-ticket-id mantis-text-shadow-letterpress',
            bind: 
            {
                html: 'Ticket #{record.id}'
            }
        },
        {
            margin: '0 5 0 0',
            items: [
            {
                bind: 
                {
                    html: '{record.custom_fields&&record.custom_fields.0.value?record.custom_fields.0.value:\'unknown\'}',
                    //html: '{record.severity.name==\'feature\'?record.severity.name:\'bug\'}',
                    bodyStyle: 
                    {
                        'color': 'white',
                        'background': '{typeColor}',
                        'text-align':'right',
                        'border-radius': '5px'
                    }
                },
                bodyPadding: '3 5 3 5'
            }]
        },
        {
            margin: '0 10 0 0',
            items: [
            {
                bind: 
                {
                    html: '{record.status.name}',
                    bodyStyle: 
                    {
                        'color': '#222222',
                        'background': '{record.status.color}',
                        'text-align':'right',
                        'border-radius': '5px'
                    }
                },
                bodyPadding: '3 5 3 5'
            }]
        }]
    },
    {
        cls: 'mantis-ticket-list-ticket-summary mantis-text-shadow-letterpress',
        bind: 
        {
            html: '{record.summary}'
        }
    },
    {
        flex: 1,
        cls: 'mantis-ticket-list-ticket-description',
        margin: '10 0 0 0',
        bind: 
        {
            html: '{record.description}'
        }
    }]

});
