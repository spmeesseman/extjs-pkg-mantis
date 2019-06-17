
Ext.define('Ext.ux.mantis.Ticket', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'ticket',
    
    requires: [
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
        },

        formulas:
        {
            statusColor: function(get) 
            {
                var ticket = get('record');
                if (ticket && ticket.data.status) 
                {
                    switch (ticket.data.status)
                    {
                        case "fixed":
                            return "#00aa00";
                        case "new":
                            return "#7a039b";
                        default:
                            break;
                    }
                } 
                return '#3bd3db';
            },

            typeColor: function(get) 
            {
                var ticket = get('record');
                if (ticket && ticket.data.type) 
                {
                    switch (ticket.data.type)
                    {
                        case "bug":
                        case "defect":
                            return "#ee0000";
                        case "enhancement":
                            return "#4286f4";
                        default:
                            break;
                    }
                } 
                return '#0000dd';
            }
        }
    },

    listeners:
    {
        render: function(panel) 
        {
            panel.body.on('click', function() 
            { 
                var ticketsTabPanel = panel.up('tickets');
                var tab = ticketsTabPanel.add(Ext.create('GEMS.view.miscellaneous.help.TicketDetail',
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
                html: '<span class="fal fa-ticket-alt"></span> Ticket #{record.id}'
            }
        },
        {
            margin: '0 5 0 0',
            items: [
            {
                bind: 
                {
                    html: '{record.type}',
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
                    html: '{record.status}',
                    bodyStyle: 
                    {
                        'color': 'white',
                        'background': '{statusColor}',
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
        cls: 'mantis-ticket-list-ticket-description',
        bind: 
        {
            html: '{record.description}'
        }
    }]

});
