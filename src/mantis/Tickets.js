
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
    border: false,

    items: [
    {
        title: 'New Ticket',
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
