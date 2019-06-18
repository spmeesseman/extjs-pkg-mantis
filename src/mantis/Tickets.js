
Ext.define('Ext.ux.mantis.Tickets', 
{
    extend: 'Ext.tab.Panel',
    xtype: 'tickets',
    
    requires: [ 
        'Ext.ux.mantis.NewTicket',
        'Ext.ux.mantis.Ticket',
        'Ext.ux.mantis.TicketList'
    ],

    flex:1,
    border: true,
    bodyPadding: '5 5 5 5',

    items: [
    {
        title: 'New Ticket',
        border: false,
        iconCls: 'far fa-ticket-alt',
        layout: 
        {
            type: 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        items: [
        {
            xtype: 'newticket'
        }]
    },
    {
        title: 'My Open Tickets',
        border: false,
        iconCls: 'far fa-bars',
        layout: 
        {
            type: 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        items: [
        {
            xtype: 'ticketlist',
            params: {
                filter_id: 'reported'
            }
        }]
    },
    {
        title: 'All Tickets',
        border: false,
        iconCls: 'far fa-bars',
        layout: 
        {
            type: 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        items: [
        {
            xtype: 'ticketlist'
        }]
    }]
    
});
