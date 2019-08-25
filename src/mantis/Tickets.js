
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
        title: 'My Tickets',
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
                type: 'all'
            },
            listeners:
            {
                beforerender: function(tl, eopts)
                {
                    tl.params.filters = Ext.util.JSON.encode(Ext.manifest.mantis.myTicketFilters);
                }
            }
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
                type: 'open'
            },
            listeners:
            {
                beforerender: function(tl, eopts)
                {
                    tl.params.filters = Ext.util.JSON.encode(Ext.manifest.mantis.myTicketFilters);
                }
            }
        }]
    },
    {
        title: 'My Closed Tickets',
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
                type: 'closed'
            },
            listeners:
            {
                beforerender: function(tl, eopts)
                {
                    tl.params.filters = Ext.util.JSON.encode(Ext.manifest.mantis.myTicketFilters);
                }
            }
        }]
    },
    {
        title: 'Location Tickets',
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
                type: 'all'
            },
            listeners:
            {
                beforerender: function(tl, eopts)
                {
                    tl.params.filters = Ext.util.JSON.encode(Ext.manifest.mantis.locationTicketFilters);
                }
            }
        }]
    }]
    
});
