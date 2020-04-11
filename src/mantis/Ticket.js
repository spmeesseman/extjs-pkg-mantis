/**
 * @class Ext.ux.mantis.Ticket
 * 
 */
Ext.define('Ext.ux.mantis.Ticket', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'ticket',
    
    requires: [
        'Ext.ux.mantis.TicketHeader',
        'Ext.ux.mantis.TicketDetail'
    ],

    flex:1,
    border:false,
    bodyPadding: '10 10 10 10',
    userCls: 'mantis-ticket-list-ticket',
    overCls: 'mantis-ticket-list-ticket-hover',
    bodyStyle:
    {
        'border-radius': '10px'
    },

    viewModel: 
    {
        data: {
            record: null
        }
    },

    listeners:
    {
        render: function(panel) 
        {
            panel.body.on('click', function() 
            { 
                var ticketsTabPanel = panel.up('tickets');
                var tab = ticketsTabPanel.add(Ext.create('Ext.ux.mantis.TicketDetail',
                {
                    viewModel: panel.getViewModel(),
                    closable: true,
                    bind:
                    {
                        title: 'Ticket #{record.id}'
                    }
                }));
                ticketsTabPanel.setActiveTab(tab);
            });
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
        flex: 1
    },

    items: [
    {
        xtype: 'ticketheader'
    },
    {
        cls: 'mantis-ticket-list-ticket-summary',
        bind: 
        {
            html: '{record.summary}'
        }
    },
    {
        cls: 'mantis-ticket-list-ticket-description',
        bind: 
        {
            html: '{record.shortDescription}'
        }
    }]

});
