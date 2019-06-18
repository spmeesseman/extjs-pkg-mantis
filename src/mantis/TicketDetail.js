
Ext.define('Ext.ux.mantis.TicketDetail', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'ticketdetail',
    
    requires: [
        'Ext.ux.mantis.TicketHeader'
    ],

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
        xtype: 'ticketheader'
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
