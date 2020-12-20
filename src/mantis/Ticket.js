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

    config: {
        record: null
    },

    //viewModel: 
    //{
    //    data: {
    //        record: null
    //    }
    //},

    initComponent: function()
    {
        var me = this;

        me.items = [
        {
            xtype: 'ticketheader',
            record: me.record
        },
        {
            cls: 'mantis-ticket-list-ticket-summary',
            html: me.record.data.summary
        },
        {
            cls: 'mantis-ticket-list-ticket-description',
            html: me.record.data.shortDescription
        }];

        me.callParent();
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
                    closable: true,
                    record: panel.getRecord(),
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
    }

});
